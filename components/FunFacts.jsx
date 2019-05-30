import React from "react";
import PropTypes from "prop-types";
import { LanguageContext } from "../language_context";
import { factPropTypes } from "../lib/prop_types";
import { LargeCardCarousel } from "./LargeCardCarousel";
import { LargeSectionTitle } from "./LargeSectionTitle";
import { todayString } from "../lib/date";
import { homeUiStrings } from "../lib/ui_strings";

export const FunFacts = ({ scheduled, constant }) => {
  const dateString = todayString();
  let facts = [
    ...scheduled.filter(f => f.dates.indexOf[dateString] > -1),
    ...constant
  ];

  if (scheduled.filter(f => f.dates.indexOf[dateString] > -1).length === 0) {
    facts = [
      ...scheduled.filter(f => f.dates.indexOf("2019-05-31") > -1),
      ...constant
    ];
  }
  return (
    <LanguageContext.Consumer>
      {lang => (
        <section>
          <LargeSectionTitle>{homeUiStrings.funFacts[lang]}</LargeSectionTitle>
          <LargeCardCarousel cards={facts} />
        </section>
      )}
    </LanguageContext.Consumer>
  );
};

FunFacts.propTypes = {
  scheduled: PropTypes.arrayOf(factPropTypes).isRequired,
  constant: PropTypes.arrayOf(factPropTypes).isRequired
};
