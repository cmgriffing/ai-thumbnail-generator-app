import Head from "next/head";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { useRouter } from "next/router";
import Case from "case";
import { GetServerSidePropsContext } from "next";
import { GeneratedImage, GeneratedImageStatus } from "../../types";
import Link from "next/link";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const imageId = context.query.id as string;

  try {
    const imageResponse = await fetch(
      `http://localhost:3000/api/image/${imageId}`
    );

    const { image } = await imageResponse.json();

    return { props: { image } };
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
        const response = await fetch(`/api/image/${image.id}`);
        setFetchedImage(await response.json());
      }
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [image]);

  return (
    <div className="text-center">
      {!image && (
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

      {!!image && (
        <>
          <Head>
            <meta name="title" content={image.title} />
            <meta name="description" content={image.description} />

            <meta property="og:url" content="https://thumb.farm" />
            <meta property="og:type" content="website" />
            <meta
              property="og:title"
              content="I just generated a YouTube Thumbnail using AI"
            />
            <meta property="og:description" content={image.title} />
            <meta property="og:image" content={image.url} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta property="twitter:domain" content="thumb.farm" />
            <meta
              property="twitter:url"
              content={`https://thumb.farm/images/${image.id}`}
            />
            <meta
              name="twitter:title"
              content="I just generated a YouTube Thumbnail using AI"
            />
            <meta name="twitter:description" content={image.title} />
            <meta name="twitter:image" content={image.url} />
          </Head>
          <h1 className="text-center text-4xl font-bold m-4">{image.title}</h1>

          {image.status === GeneratedImageStatus.Pending && (
            <>
              <h2>
                We are still generating the image. Give us a minute or two. If
                the page has not updated within that time, please try refreshing
                the page.
              </h2>
            </>
          )}

          {image.status === GeneratedImageStatus.Complete && (
            <>
              <img src={image.url} alt={image.description} />
            </>
          )}
        </>
      )}
    </div>
  );
}
