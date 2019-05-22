/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { LanguageContextConsumer } from "../language_context";
import { TinyCard } from "./TinyCard";
import { quizQuestionPropType } from "../lib/prop_types";

const CORRECT_ANSWER_MESSAGE = {
  en: "Correct answer! Learn more:",
  hi: "सही जवाब! और जानें:",
  ta: "TODO"
};

const INCORRECT_ANSWER_MESSAGE = (lang, answerIndex) => {
  const answerLetter = ["A", "B"][answerIndex];

  return {
    en: `Wrong answer! The correct answer is option ${answerLetter}. Learn more:`,
    hi: `गलत जवाब! सही जवाब है विकल्प ${answerLetter}। और जानें:`,
    ta: "TODO"
  }[lang];
};

export class QuizQuestion extends Component {
  constructor(props) {
    super(props);
    this.questionRef = React.createRef();
    this.scrollToRelatedArticleIfNecessary = this.scrollToRelatedArticleIfNecessary.bind(
      this
    );
  }

  scrollToRelatedArticleIfNecessary() {
    if (this.questionRef.current.offsetTop > window.scrollY)
      window.scrollTo({
        left:0,
        top:this.questionRef.current.offsetTop - 100,
        behavior: 'smooth'
      });
  }

  render() {
    const { question, userAnswerIndex, setUserAnswerIndex } = this.props;
    const isAnswered = userAnswerIndex !== -1;
    const isAnsweredCorrectly = userAnswerIndex === question.answerIndex;

    return (
      <LanguageContextConsumer>
        {lang => (
          <div className="wcp-quiz-question" ref={this.questionRef}>
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
                  <li
                    className={className}
                    onClick={() =>
                      setUserAnswerIndex(
                        index,
                        this.scrollToRelatedArticleIfNecessary
                      )
                    }
                  >
                    <span className="wcp-quiz-question__answers__answer">
                      {o.label}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div>
              {isAnswered && isAnsweredCorrectly ? (
                <p>{CORRECT_ANSWER_MESSAGE[lang]}</p>
              ) : null}
              {isAnswered && !isAnsweredCorrectly ? (
                <p>{INCORRECT_ANSWER_MESSAGE(lang, question.answerIndex)}</p>
              ) : null}
              {isAnswered ? (
                <TinyCard
                  title={question.relatedArticle.label}
                  coverImage={question.relatedArticle.value.image}
                  href={question.relatedArticle.value.url}
                >
                  {question.relatedArticle.value.label}
                </TinyCard>
              ) : null}
            </div>
          </div>
        )}
      </LanguageContextConsumer>
    );
  }
}

QuizQuestion.propTypes = {
  question: quizQuestionPropType.isRequired,
  userAnswerIndex: PropTypes.oneOf([-1, 0, 1]).isRequired,
  setUserAnswerIndex: PropTypes.func.isRequired
};
