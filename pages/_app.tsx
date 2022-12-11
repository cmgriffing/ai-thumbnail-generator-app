import "../styles/globals.css";
import "../styles/Loader.css";
import type { AppProps } from "next/app";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="max-w-[488px] flex flex-1 flex-grow flex-col mx-auto p-16 mt-[80px] custom-border custom-border-radius backdrop-blur-[145.5px]">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
