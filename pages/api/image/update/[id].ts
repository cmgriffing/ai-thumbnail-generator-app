import { GeneratedImageStatus } from "./../../../../types";
import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
const API_KEY = process.env.API_KEY;

interface UpdateImageRequest extends NextApiRequest {
  body: {
    urls: string[];
  };
}

export default async function handler(
  req: UpdateImageRequest,
  res: NextApiResponse
) {
  const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/?retryWrites=true&w=majority`;
  const dbClient = new MongoClient(uri);

  try {
    const id = req.query.id as string;

    const apiKeyInHeader = req.headers["X-API-KEY"];

    if (apiKeyInHeader !== API_KEY) {
      res.send(401);
      return;
    }

    if (!req.body.urls) {
      res.send(400);
      return;
    }

    await dbClient.db("db").collection("images").updateOne(
      { id },
      {
        urls: req.body.urls,
        status: GeneratedImageStatus.Complete,
        modifiedAt: Date.now(),
      }
    );

    const image = await dbClient.db("db").collection("images").findOne({ id });

    if (!image) {
      res.json({ image: undefined });
    } else {
      res.json({ image });
    }
  } catch (e: any) {
    res.send(500);
  } finally {
    await dbClient.close();
  }
}
