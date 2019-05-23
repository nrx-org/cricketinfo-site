import React from "react";
import track from "react-tracking";
import App, { Container } from "next/app";

import {
  MATOMO_SCRIPT_URL,
  MATOMO_TRACKER_URL,
  MATOMO_SITEID
} from "../lib/matomo";

@track(
  {},
  {
    dispatch: data => {
      console.log("Adding Event to Matomo Collection: ", data);
      var _paq = window._paq || [];
      // _paq.push(data.matomoEvent);
      if (Array.isArray(data)) _paq.push(data);
    }
  }
)
export default class WCPApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}
