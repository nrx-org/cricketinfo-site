/* eslint-disable react/no-danger */

import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";

import { BaseLayout } from "../components/BaseLayout";
import { HomeHeader } from "../components/HomeHeader";
import { privacyPolicy } from "../lib/legal";
import { makePrivacyPolicyTitle } from "../lib/make_title";

const PrivacyPolicy = ({ lang }) => {
  return (
    <BaseLayout>
      <Head>
        <title>{makePrivacyPolicyTitle(lang)}</title>
      </Head>
      <HomeHeader />
      <article
        className="wcp-privacy-policy wcp-long-form"
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
