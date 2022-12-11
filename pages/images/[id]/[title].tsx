import Head from "next/head";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { useRouter } from "next/router";
import Case from "case";
import { GetServerSidePropsContext } from "next";
import { GeneratedImage, GeneratedImageStatus } from "../../../types";
import Link from "next/link";

const scheme = process.env.NODE_ENV === "development" ? "http" : "https";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const imageId = context.query.id as string;
  const titleInUrl = context.query.title as string;

  try {
    const imageResponse = await fetch(
      `${scheme}://${context.req.headers.host}/api/image/get/${imageId}`
    );

    const { image }: { image: GeneratedImage } = await imageResponse.json();

    const dasherizedTitle = encodeURIComponent(Case.kebab(image.title));

    if (dasherizedTitle !== titleInUrl) {
      return {
        redirect: `/images/${imageId}/${dasherizedTitle}`,
      };
    }

    if (image) {
      return { props: { image } };
    } else {
      return { props: {} };
    }
  } catch (e: any) {
    console.log({ e });
    return { props: {} };
  }
}

export default function GeneratedImagePage({
  image,
}: {
  image?: GeneratedImage;
}) {
  const [fetchedImage, setFetchedImage] = useState(image);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (image?.status === GeneratedImageStatus.Pending) {
        const response = await fetch(`/api/image/get/${image.id}`);
        setFetchedImage(await response.json());
      }
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [image]);

  return (
    <div className="text-center">
      {!fetchedImage && (
        <>
          <Head>
            <meta name="title" content="Image not found" />
          </Head>
          <h1>Image not found</h1>
          <p>
            Head to the <Link href="/">home page</Link> and create a new one
          </p>
        </>
      )}

      {!!fetchedImage && (
        <>
          <Head>
            <meta name="title" content={fetchedImage.title} />
            <meta name="description" content={fetchedImage.description} />

            <meta property="og:url" content="https://thumb.farm" />
            <meta property="og:type" content="website" />
            <meta
              property="og:title"
              content="I just generated a YouTube Thumbnail using AI"
            />
            <meta property="og:description" content={fetchedImage.title} />
            <meta property="og:image" content={fetchedImage.urls[0]} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta property="twitter:domain" content="thumb.farm" />
            <meta
              property="twitter:url"
              content={`https://thumb.farm/images/${fetchedImage.id}`}
            />
            <meta
              name="twitter:title"
              content="I just generated a YouTube Thumbnail using AI"
            />
            <meta name="twitter:description" content={fetchedImage.title} />
            <meta name="twitter:image" content={fetchedImage.urls[0]} />
          </Head>
          <h1 className="text-center text-4xl font-bold m-4">
            {fetchedImage.title}
          </h1>

          {fetchedImage.status === GeneratedImageStatus.Pending && (
            <>
              <h2>
                We are still generating the image. Give us a minute or two. If
                the page has not updated within that time, please try refreshing
                the page.
              </h2>
            </>
          )}

          {fetchedImage.status === GeneratedImageStatus.Complete && (
            <div className="flex flex-row flex-wrap items-center justify-center">
              {fetchedImage.urls.map((url) => (
                <img
                  src={url}
                  alt={fetchedImage.description}
                  className="h-20 w-20"
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
