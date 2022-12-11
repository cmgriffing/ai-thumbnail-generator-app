import { NextApiRequest, NextApiResponse } from "next";
import { GeneratedImage, GeneratedImageStatus } from "../../../types";
import Case from "case";
import { MongoClient } from "mongodb";
import { nanoid } from "../../../nanoid";

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
const JOB_TRACKER_HOST = process.env.JOB_TRACKER_HOST;

interface CreateImageRequest extends NextApiRequest {
  body: {
    title: string;
    description: string;
  };
}

// /jobs/create, title, description, count: 10, id POST

// /jobs/{jobId} GET

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
    const jobId = nanoid();

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
        res.status(400);
        res.end();
      } else {
        res.redirect(`/?${queryString}`);
      }
      return;
    }

    const body = JSON.stringify({ id: jobId, title, description, count: 3 });

    console.log({ body });

    const createResponse = await fetch(
      `https://${JOB_TRACKER_HOST}/api/jobs/create`,
      {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("response", await createResponse.json());

    const now = Date.now();

    const image: GeneratedImage = {
      id: jobId,
      status: GeneratedImageStatus.Processing,
      title,
      description,
      createdAt: now,
      modifiedAt: now,
      urls: [],
    };

    await dbClient.db("db").collection("images").insertOne(image);

    if (isAjax) {
      res.json({ image: { ...image, urls: [] } });
    } else {
      const dasherizedTitle = encodeURIComponent(Case.kebab(image.title));
      res.redirect(`/images/${jobId}/${dasherizedTitle}`);
    }
  } catch (e: any) {
    if (isAjax) {
      console.log("Error creating image", e);
      res.status(500);
      res.end();
    } else {
      res.redirect(`/server-error`);
    }
  } finally {
    await dbClient.close();
  }
}
