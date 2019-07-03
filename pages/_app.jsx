import React from "react";
import track from "react-tracking";
import App from "next/app";

// import {
//   MATOMO_SCRIPT_URL,
//   MATOMO_TRACKER_URL,
//   MATOMO_SITEID
// } from "../lib/matomo";

@track(
  {},
  {
    dispatch: data => {
      /* eslint-disable */
      var paq = window._paq || [];
      // _paq.push(data.matomoEvent);
      if (Array.isArray(data)) {
        paq.push(data);
      }
      else if (Array.isArray(data.data)) {
        paq.push(data.data);
        paq.push(["trackPageView"]);
      }
      /* eslint-enable */
    }
  }
)
export default class WCPApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}
