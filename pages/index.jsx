import Router from "next/router";
import acceptLanguageParser from "accept-language-parser";

import { getMainPageUrl } from "../lib/urls";

const Index = () => null;

// We use the getInitialProps of this component to redirect people to the
// Home route, and add the correct language parameter to it.
Index.getInitialProps = async ({ req, res }) => {
  // Parse the Accept-Language header to detect supported languages.
  const acceptedLanguages = acceptLanguageParser.parse(
    req.headers["accept-language"]
  );

  // The first language in the list is our preferred language.
  const preferredLanguage = acceptedLanguages[0].code;

  // If the preferred language is Tamil or Hindi, redirect to those pages.
  // Otherwise, redirect to English.
  let redirectTo = "en";
  if (preferredLanguage === "hi" || preferredLanguage === "hin") {
    redirectTo = "hi";
  } else if (preferredLanguage === "ta" || preferredLanguage === "tam") {
    redirectTo = "ta";
  }

  const mainPageUrl = getMainPageUrl(redirectTo);

  if (res) {
    res.writeHead(302, {
      Location: mainPageUrl
    });
    res.end();
  } else {
    Router.push(mainPageUrl);
  }

  return {};
};

export default Index;
