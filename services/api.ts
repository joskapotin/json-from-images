import { readdir } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import buildPaintings from "../utils/factories"
import { isValidFile } from "../utils/validators"

export const getFilesFromDirectory = async (directory: string) => {
  const workingDirectory = dirname(fileURLToPath(import.meta.url))
  const path = join(workingDirectory, directory)
  try {
    const result = await readdir(path, { withFileTypes: true })
    return result.map(file => file.name)
  } catch (error) {
    throw Error("Error while reading the directory", { cause: error })
  }
}

export const postImages = async (filenames: string[]) => {
  const valideFiles = filenames.filter(isValidFile)
  return await buildPaintings(valideFiles)
}
