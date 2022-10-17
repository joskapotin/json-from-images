import { v4 as uuidv4 } from "uuid"
import encodeImageToBlurhash from "./blurhash"

const extractTitle = (filename: string) => {
  const regextitle = /[^-]*/
  const extractedTitle = filename.match(regextitle)
  const rawTitle = extractedTitle ? extractedTitle[0] : "Untitled"
  const title =
    rawTitle[0].toUpperCase() +
    rawTitle.substring(1, filename.lastIndexOf(".")).replaceAll("_", " ")

  return title
}

const extractYear = (filename: string) => {
  const regexYear = /-\d{4}-/gm
  const extractedYear = filename.match(regexYear)
  const year = extractedYear ? extractedYear[0].slice(1, 5) : "nc"
  return year
}

const extractDimensions = (filename: string) => {
  const regexFormat = /-\d+x\d+/gm
  const extractedFormat = filename.match(regexFormat)
  const format = extractedFormat ? extractedFormat[0].slice(1) : "ncxnc"
  const formatArr = format.split("x")
  const height = formatArr[0]
  const width = formatArr[1]
  return { height, width }
}

const slugify = (string: string) =>
  string
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

const extractData = (filenames: string[]) => {
  const data = filenames.map((filename, index) => {
    const title = extractTitle(filename)
    const year = extractYear(filename)
    const { height, width } = extractDimensions(filename)
    const slug = slugify(title)
    return {
      id: uuidv4(),
      filename,
      title,
      year,
      height,
      width,
      slug,
      order: index + 1,
      visible: true,
    }
  })
  return data
}

const addBlurHash = async (data: ReturnType<typeof extractData>) => {
  const newData = data.map(async item => {
    try {
      const { blurhash, imageWidth, imageHeight } = await encodeImageToBlurhash(
        `tableaux/source/${item.filename}`
      )
      const {
        blurhash: thumbBlurhash,
        imageWidth: thumbWidth,
        imageHeight: thumbHeight,
      } = await encodeImageToBlurhash(`tableaux/square/${item.filename}`)
      console.log("filename", item.filename)
      console.log("blurhash", blurhash)
      return {
        ...item,
        blurhash,
        imageWidth,
        imageHeight,
        thumbBlurhash,
        thumbWidth,
        thumbHeight,
      }
    } catch (error) {
      console.error("error on file", item.filename)
      console.error(error)
      return item
    }
  })

  return Promise.allSettled(newData)
}

const processFilenames = async (filenames: string[]) => {
  const extractedData = extractData(filenames)
  const results = await addBlurHash(extractedData)
  const data = results
    .filter(item => item.status === "fulfilled")
    .map(item => item.value)
  const jsonData = JSON.stringify(data, null, 4)
  console.log(
    "Errors",
    results.filter(item => item.status === "rejected")
  )
  console.log("Done", data)
  return jsonData
}

export default processFilenames
