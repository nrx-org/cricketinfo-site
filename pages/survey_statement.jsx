/* eslint-disable react/no-danger */

import React from "react";
import Head from "next/head";

import { BaseLayout } from "../components/BaseLayout";
import { HomeHeader } from "../components/HomeHeader";
import { surveyStatement } from "../lib/legal";
import { makeSurveyPolicyTitle } from "../lib/make_title";

const SurveyStatement = () => {
  return (
    <BaseLayout>
      <Head>
        <title>{makeSurveyPolicyTitle("en")}</title>
      </Head>
      <HomeHeader />
      <article
        className="wcp-survey-statement wcp-long-form"
        dangerouslySetInnerHTML={{ __html: surveyStatement }}
      />
    </BaseLayout>
  );
};

export default SurveyStatement;
