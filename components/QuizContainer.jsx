import React from "react";
import PropTypes from "prop-types";
import { LargeSectionTitle } from "./LargeSectionTitle";
import { QuizQuestion } from "./QuizQuestion";

export const QuizContainer = ({ questions }) => (
  <section>
    <LargeSectionTitle>Do you know?</LargeSectionTitle>
    {questions.map(q => (
      <QuizQuestion question={q} userAnswerIndex={0} />
    ))}
  </section>
);

QuizContainer.propTypes = {};
