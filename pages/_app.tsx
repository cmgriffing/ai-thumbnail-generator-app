import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="min-w-screen flex flex-1 flex-grow flex-col prose mx-auto pt-8">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
