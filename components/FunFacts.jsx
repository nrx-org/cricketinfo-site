import React from "react";
import PropTypes from "prop-types";
import { LanguageContext } from "../language_context";
import { factPropTypes } from "../lib/prop_types";
import { LargeCardCarousel } from "./LargeCardCarousel";
import { LargeSectionTitle } from "./LargeSectionTitle";
import { todayString } from "../lib/date";

const SECTION_TITLE_MESSAGE = {
  en: "Fun facts",
  hi: "दिलचस्प तथ्य",
  ta: "TODO"
};

export const FunFacts = ({ scheduled, constant }) => {
  const dateString = todayString();
  const facts = [...scheduled.filter(f => f.date === dateString), ...constant];

  return (
    <LanguageContext.Consumer>
      {lang => (
        <section>
          <LargeSectionTitle>{SECTION_TITLE_MESSAGE[lang]}</LargeSectionTitle>
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
