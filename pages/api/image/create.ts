import { NextApiRequest, NextApiResponse } from "next";
import { GeneratedImage, GeneratedImageStatus } from "../../../types";
import Case from "case";

interface CreateImageRequest extends NextApiRequest {
  body: {
    title: string;
    description: string;
  };
}

export default function handler(req: CreateImageRequest, res: NextApiResponse) {
  const { title, description } = req.body;

  const contentType =
    req.headers["Content-Type"] || req.headers["content-type"];

  const isAjax = contentType === "application/json";

  console.log({ contentType });

  const searchParams = new URLSearchParams();
  if (!title || title.length > 100) {
    searchParams.append("errors", "title");
  }

  if (!description || description.length > 1000) {
    searchParams.append("errors", "description");
  }

  const queryString = searchParams.toString();
  if (queryString !== "") {
    if (isAjax) {
      res.send(400);
    } else {
      res.redirect(`/?${queryString}`);
    }
    return;
  }

  // hardcoded for now

  const id = "abcdef123";

  const image: GeneratedImage = {
    id,
    title,
    description,
    status: GeneratedImageStatus.Pending,
    url: "http://localhost:3000/image.jpg",
    createdAt: 0,
    modifiedAt: Date.now(),
  };

  if (isAjax) {
    res.json({ image });
  } else {
    res.redirect(`/images/${id}`);
  }
}
