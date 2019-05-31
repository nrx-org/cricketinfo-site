/* eslint-disable react/no-danger */

import React from "react";
import PropTypes from "prop-types";

import { BaseLayout } from "../components/BaseLayout";
import { HomeHeader } from "../components/HomeHeader";
import { privacyPolicy } from "../lib/legal";

const PrivacyPolicy = ({ lang }) => {
  return (
    <BaseLayout>
      <HomeHeader />
      <article
        className="wcp-privacy-policy"
        dangerouslySetInnerHTML={{ __html: privacyPolicy[lang] }}
      />
    </BaseLayout>
  );
};

PrivacyPolicy.getInitialProps = async ({ query }) => {
  const { lang } = query;

  return { lang };
};

PrivacyPolicy.propTypes = {
  lang: PropTypes.string.isRequired
};

export default PrivacyPolicy;
