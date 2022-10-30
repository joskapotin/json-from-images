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

export const createImages = async (filename: string) => {
  const input = getFilePath(filename)
  const normalOutput = getNormalOutputPath(filename)
  const squareOutput = getSquareOutputPath(filename)

  await sharp(input)
    .resize(640, 480, {
      fit: "inside",
    })
    .toFile(normalOutput)

  await sharp(input)
    .resize(200, 200, {
      fit: "cover",
    })
    .toFile(squareOutput)

  const { width: imageWidth, height: imageHeight } = await sharp(
    normalOutput
  ).metadata()
  const { width: thumbnailWidth, height: thumbnailHeight } = await sharp(
    squareOutput
  ).metadata()

  return { imageWidth, imageHeight, thumbnailWidth, thumbnailHeight }
}
