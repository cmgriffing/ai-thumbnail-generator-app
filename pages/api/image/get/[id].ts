import { NextApiRequest, NextApiResponse } from "next";
import { GeneratedImage, GeneratedImageStatus } from "../../../../types";
import { MongoClient } from "mongodb";

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/?retryWrites=true&w=majority`;
  const dbClient = new MongoClient(uri);

  try {
    const id = req.query.id as string;

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
