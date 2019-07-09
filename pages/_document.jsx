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
            _paq.push(['enableLinkTracking']);
            _paq.push(['trackAllContentImpressions']);
            _paq.push(['enableHeartBeatTimer']);
            (function(){
              _paq.push(['setTrackerUrl', "${MATOMO_TRACKER_URL}"]);
              _paq.push(['setSiteId', "${MATOMO_SITEID}"]);
            })()
          `
            }}
          />
        </Head>
        <body>
          <img
            src={`${MATOMO_TRACKER_URL}?idsite=${MATOMO_SITEID}&rec=1&action_name=img_beacon`}
            style={{ border: 0 }}
            alt=""
          />
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
