import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const sourceDirectory = "../public/paintings/source"
const outputDirectory = {
  square: "../public/paintings/square",
  normal: "../public/paintings/normal",
}

const getFilePath = (filename: string) => {
  const directory = dirname(fileURLToPath(import.meta.url))
  return join(directory, sourceDirectory, filename)
}

const getNormalOutputPath = (filename: string) => {
  const directory = dirname(fileURLToPath(import.meta.url))
  return join(directory, outputDirectory.normal, filename)
}

const getSquareOutputPath = (filename: string) => {
  const directory = dirname(fileURLToPath(import.meta.url))
  return join(directory, outputDirectory.square, filename)
}

const createBlurhash = async (sharpImage: sharp.Sharp) => {
  const meta = await sharpImage.metadata()

  if (!meta.width || !meta.height) throw Error("No meta data")

  const placeholderImgWidth = 20
  const imgAspectRatio = meta.width / meta.height
  const placeholderImgHeight = Math.round(placeholderImgWidth / imgAspectRatio)
  const imageBase64 = await sharpImage
    .resize(placeholderImgWidth, placeholderImgHeight)
    .toBuffer()
    .then(
      buffer => `data:image/${meta.format};base64,${buffer.toString("base64")}`
    )

  return imageBase64
}

export const createImages = async (filename: string) => {
  const input = getFilePath(filename)
  const normalOutput = getNormalOutputPath(filename)
  const squareOutput = getSquareOutputPath(filename)

  // Create and write the images
  const sharpImage = sharp(input)

  await sharpImage
    .resize(640, 480, {
      fit: "inside",
    })
    .toFile(normalOutput)

  await sharpImage
    .resize(200, 200, {
      fit: "cover",
    })
    .toFile(squareOutput)

  // Create the blurhash
  const sharpNormalOutput = sharp(normalOutput)
  const imageBlurhash = await createBlurhash(sharpNormalOutput)

  const sharpSquareOutput = sharp(squareOutput)
  const squareBlurhash = await createBlurhash(sharpSquareOutput)

  // Extract width and height
  const { width: imageWidth, height: imageHeight } = await sharp(
    normalOutput
  ).metadata()
  const { width: thumbnailWidth, height: thumbnailHeight } = await sharp(
    squareOutput
  ).metadata()

  return {
    imageWidth,
    imageHeight,
    thumbnailWidth,
    thumbnailHeight,
    imageBlurhash,
    squareBlurhash,
  }
}
