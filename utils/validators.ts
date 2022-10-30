import path from "path"

export const validateFileTypeArray = [
  ".apng",
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
]

export const isValidFile = (filename: string) => {
  const fileExtension = path.extname(filename)
  return validateFileTypeArray.includes(fileExtension)
}
