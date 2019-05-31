import React from "react";
import Document, { Head, Main, NextScript } from "next/document";

import {
  MATOMO_SCRIPT_URL,
  MATOMO_TRACKER_URL,
  MATOMO_SITEID
} from "../lib/matomo";

export default class extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <script async src={MATOMO_SCRIPT_URL} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            var _paq = window._paq || [];
            _paq.push(["trackPageView"]);
            _paq.push(['enableLinkTracking']);
            (function(){
              _paq.push(['setTrackerUrl', "${MATOMO_TRACKER_URL}"]);
              _paq.push(['setSiteId', "${MATOMO_SITEID}"]);
            })()
          `
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
