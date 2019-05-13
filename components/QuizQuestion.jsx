import React from "react";
import PropTypes from "prop-types";

export const QuizQuestion = ({ question, userAnswerIndex }) => {
  const isAnswered = userAnswerIndex !== -1;
  const isAnsweredCorrectly = userAnswerIndex === question.answerIndex;

  return (
    <div className="wcp-quiz-question">
      <p>{question.label}</p>
      <ul className="wcp-quiz-question__answers">
        {question.options.map((o, index) => {
          let className = "wcp-quiz-question__answers__answer-wrapper";

          className = `${className} ${
            isAnswered && index !== userAnswerIndex
              ? "wcp-quiz-question__answers__answer-wrapper--inactive"
              : ""
          }`;

          className = `${className} ${
            isAnsweredCorrectly && index === question.answerIndex
              ? "wcp-quiz-question__answers__answer-wrapper--correct"
              : ""
          }`;

          className = `${className} ${
            !isAnsweredCorrectly && index === userAnswerIndex
              ? "wcp-quiz-question__answers__answer-wrapper--incorrect"
              : ""
          }`;

          return (
            <li className={className}>
              <span className="wcp-quiz-question__answers__answer">
                {o.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

QuizQuestion.propTypes = {};
