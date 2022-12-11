import Head from "next/head";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { useRouter } from "next/router";
import Case from "case";
import { GetServerSidePropsContext } from "next";
import { GeneratedImage, GeneratedImageStatus } from "../../../types";
import Link from "next/link";
import { Loader } from "../../../components/Loader";

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
      if (image?.status === GeneratedImageStatus.Processing) {
        try {
          const response = await fetch(`/api/image/get/${image.id}`);
          setFetchedImage((await response.json()).image);
        } catch (e) {
          console.log("Error fetching image:", e);
        }
      }
    }, 15000);

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
          <h1 className="text-[32px] leading-[43px] font-bold mb-2">
            {fetchedImage.title}
          </h1>

          {fetchedImage.status === GeneratedImageStatus.Processing && (
            <>
              <h2>
                We are still generating the images. Just give us a moment or
                two.
              </h2>
              <noscript>
                <p>
                  JavaScript is off so you will need to refresh the page to see
                  the updates.
                </p>
              </noscript>
            </>
          )}

          <div className="flex flex-row flex-wrap items-center justify-center">
            {fetchedImage.urls.map((url) => (
              <a
                href={url}
                key={url}
                target="_blank"
                rel="noreferrer"
                className="w-full p-1 hover:scale-150 transition-transform"
              >
                <img
                  src={url}
                  alt={fetchedImage.description}
                  className="w-full h-auto"
                />
              </a>
            ))}
          </div>

          {fetchedImage.status === GeneratedImageStatus.Processing && (
            <div>
              <Loader small={false} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
