import { v4 as uuidv4 } from "uuid"
import { createImages } from "./sharp"

const extractTitle = (filename: string) => {
  const regextitle = /[^-]*/ // Everything from the start to the first "-"
  const extractedTitle = filename.match(regextitle)
  const rawTitle = extractedTitle ? extractedTitle[0] : "Untitled"

  return (
    rawTitle[0].toUpperCase() +
    rawTitle.substring(1, filename.lastIndexOf(".")).replaceAll("_", " ")
  )
}

const extractYear = (filename: string) => {
  const regexYear = /-\d{4}-/gm // Four digits between "-"
  const extractedYear = filename.match(regexYear)
  return extractedYear ? parseInt(extractedYear[0].slice(1, 5), 10) : 0
}

const extractDimensions = (filename: string) => {
  const regexFormat = /-\d+x\d+/gm // two group of digits with "x" in between
  const extractedFormat = filename.match(regexFormat)
  if (!extractedFormat) return { height: 0, width: 0 }
  const format = extractedFormat[0].slice(1)
  const formatArr = format.split("x")
  const height = parseInt(formatArr[0], 10)
  const width = parseInt(formatArr[1], 10)
  return { height, width }
}

const slugify = (string: string) =>
  string
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

const extractDataFromImages = (filenames: string[]) =>
  Promise.all(
    filenames.map(async filename => {
      // Extract info from the filename
      const title = extractTitle(filename)
      const year = extractYear(filename)
      const { height, width } = extractDimensions(filename)
      const slug = slugify(title)

      const {
        imageWidth,
        imageHeight,
        thumbnailWidth,
        thumbnailHeight,
        imageBlurhash,
        squareBlurhash,
      } = await createImages(filename)

      return {
        id: uuidv4(),
        filename,
        title,
        year,
        height,
        width,
        slug,
        visible: true,
        featured: false,
        imageWidth,
        imageHeight,
        thumbnailWidth,
        thumbnailHeight,
        imageBlurhash,
        squareBlurhash,
      }
    })
  )

const buildPaintings = async (filenames: string[]) => {
  const data = await extractDataFromImages(filenames)
  return data
    .sort((a, b) => b.year - a.year)
    .map((painting, index) => ({ ...painting, order: (index + 1) * 10 }))
}

export default buildPaintings
