/* eslint-disable react/jsx-props-no-spreading */
import { ColorModeScript } from "@chakra-ui/react";
import type { DocumentContext } from "next/document";
import Document, { Html, Head, Main, NextScript } from "next/document";

import customTheme from "../styles/customTheme";

const APP_NAME = "KeyKovery";
const APP_DESCRIPTION =
  "Decentralized Privae Key Management with Social Recovery";

class MyDocument extends Document {
  static getInitialProps(ctx: DocumentContext) {
    return Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap"
            rel="stylesheet"
          />

          <meta name="application-name" content={APP_NAME} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content={APP_NAME} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#6415FF" />
          {/*<link rel="apple-touch-icon" href="public/logo192.png" />*/}

          {/*Open Graph*/}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={APP_NAME} />
          <meta property="og:title" content={APP_NAME} />
          <meta property="og:description" content={APP_DESCRIPTION} />
          <meta property="og:image" content="../src/images/logo-black.svg" />
          <meta property="og:type" content="website" />

          {/*Twitter*/}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="" />
          <meta name="twitter:creator" content="" />
          <meta name="twitter:title" content="" />
          <meta name="twitter:description" content={APP_DESCRIPTION} />
          <meta name="twitter:image" content="../src/images/logo-black.svg" />

          {/*<link rel="icon" href="favicon.ico" />*/}
        </Head>
        <body>
          <ColorModeScript
            initialColorMode={customTheme.config?.initialColorMode}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
