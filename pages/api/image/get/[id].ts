import { NextApiRequest, NextApiResponse } from "next";
import { GeneratedImage, GeneratedImageStatus } from "../../../../types";
import { MongoClient } from "mongodb";

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
const JOB_TRACKER_HOST = process.env.JOB_TRACKER_HOST;

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
      res.status(404);
      res.end();
      return;
    }

    const imageStatusResponse = await fetch(
      `https://${JOB_TRACKER_HOST}/api/jobs/${id}`
    );
    const json = await imageStatusResponse.json();
    const { status, urls }: { status: GeneratedImageStatus; urls: string[] } =
      json; // {status: processing or done, urls: string[]}

    console.log("JSON", json, id);

    res.json({
      image: {
        ...image,
        urls,
        status,
      },
    });
  } catch (e: any) {
    res.status(500);
    res.end();
    console.log("Error in getter", e);
  } finally {
    await dbClient.close();
  }
}
