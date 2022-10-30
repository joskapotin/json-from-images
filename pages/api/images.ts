import type { NextApiRequest, NextApiResponse } from "next"
import { postImages } from "../../services/api"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if ((req.method = "POST")) {
    const { filenames } = req.body
    try {
      const paintings = await postImages(filenames)
      res.status(200).json(paintings)
    } catch (error) {
      res.status(500).json(error)
    }
  }
}
