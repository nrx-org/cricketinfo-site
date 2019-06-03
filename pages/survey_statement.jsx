/* eslint-disable react/no-danger */

import React from "react";

import { BaseLayout } from "../components/BaseLayout";
import { HomeHeader } from "../components/HomeHeader";
import { surveyStatement } from "../lib/legal";

const SurveyStatement = () => {
  return (
    <BaseLayout>
      <HomeHeader />
      <article
        className="wcp-survey-statement wcp-long-form"
        dangerouslySetInnerHTML={{ __html: surveyStatement }}
      />
    </BaseLayout>
  );
};

export default SurveyStatement;
