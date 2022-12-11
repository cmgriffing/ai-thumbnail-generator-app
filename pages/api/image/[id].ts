import { NextApiRequest, NextApiResponse } from "next";
import { GeneratedImage, GeneratedImageStatus } from "../../../types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;

  const pendingImage: GeneratedImage = {
    id,
    title: "Mocked Image",
    description: "Mocked Description",
    status: GeneratedImageStatus.Pending,
    url: "http://localhost:3000/image.jpg",
    createdAt: 0,
    modifiedAt: Date.now(),
  };

  const completeImage: GeneratedImage = {
    id,
    title: "Mocked Image",
    description: "Mocked Description",
    status: GeneratedImageStatus.Complete,
    url: "https://loremflickr.com/640/360",
    createdAt: 0,
    modifiedAt: Date.now(),
  };

  res.json({ image: pendingImage });
}
