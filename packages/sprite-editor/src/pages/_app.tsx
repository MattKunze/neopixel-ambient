import Head from "next/head"
import { AppProps } from "next/app"
import "tailwindcss/tailwind.css"

import "styles/global.css"
// import "components/atoms/Slider/Slider.css"

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Sprite Editor</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
