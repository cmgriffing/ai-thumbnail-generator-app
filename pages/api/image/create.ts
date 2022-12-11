import { NextApiRequest, NextApiResponse } from "next";
import { GeneratedImage, GeneratedImageStatus } from "../../../types";
import Case from "case";
import { MongoClient } from "mongodb";

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;

interface CreateImageRequest extends NextApiRequest {
  body: {
    title: string;
    description: string;
  };
}

export default async function handler(
  req: CreateImageRequest,
  res: NextApiResponse
) {
  const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/?retryWrites=true&w=majority`;
  const dbClient = new MongoClient(uri);

  const contentType =
    req.headers["Content-Type"] || req.headers["content-type"];

  const isAjax = contentType === "application/json";

  try {
    // TODO: hit Rox's API
    // get real jobId
    const jobId = Date.now().toString();

    const { title, description } = req.body;

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

    const now = Date.now();

    const image: GeneratedImage = {
      id: jobId,
      status: GeneratedImageStatus.Pending,
      title,
      description,
      createdAt: now,
      modifiedAt: now,
      urls: [],
    };

    await dbClient.db("db").collection("images").insertOne(image);

    if (isAjax) {
      res.json({ image });
    } else {
      res.redirect(`/images/${jobId}`);
    }
  } catch (e: any) {
    if (isAjax) {
      res.send(500);
    } else {
      res.redirect(`/server-error`);
    }
  } finally {
    await dbClient.close();
  }
}
