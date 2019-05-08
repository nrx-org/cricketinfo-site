import React from "react";
import PropTypes from "prop-types";
import { LanguageContext } from "../language_context";
import { factPropTypes } from "../lib/prop_types";
import { LargeCardCarousel } from "./LargeCardCarousel";

const SECTION_TITLE_MESSAGE = {
  en: "Fun facts",
  hi: "दिलचस्प तथ्य",
  ta: "TODO"
};

export const FunFacts = ({ scheduled, constant }) => {
  const date = new Date();
  const dateString = `${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()}`;
  const facts = [...scheduled.filter(f => f.date === dateString), ...constant];

  return (
    <LanguageContext.Consumer>
      {lang => (
        <section>
          <h1>{SECTION_TITLE_MESSAGE[lang]}</h1>
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
