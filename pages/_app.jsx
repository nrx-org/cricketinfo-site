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
      console.log("Adding Event to Matomo Collection: ", data);
      // _paq.push(data.matomoEvent);
      if (Array.isArray(data)) paq.push(data);
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
