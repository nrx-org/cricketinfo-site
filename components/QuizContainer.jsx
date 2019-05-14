import React, { Component } from "react";
import PropTypes from "prop-types";
import { LargeSectionTitle } from "./LargeSectionTitle";
import { QuizQuestion } from "./QuizQuestion";
import { quizQuestionPropType } from "../lib/prop_types";

const LOCALSTORAGE_KEY = "wcpQuizContainerData";

export class QuizContainer extends Component {
  constructor(props) {
    super(props);

    this.setUserAnswerIndex = this.setUserAnswerIndex.bind(this);
  }

  static getUserAnswerIndex(questionId) {
    if (!process.browser) {
      return -1;
    }

    const quizContainerDataString = localStorage.getItem(LOCALSTORAGE_KEY);

    if (!quizContainerDataString) {
      return -1;
    }

    const quizContainerData = JSON.parse(quizContainerDataString);

    if (typeof quizContainerData[questionId] === "undefined") {
      return -1;
    }

    return quizContainerData[questionId];
  }

  setUserAnswerIndex(questionId, userAnswerIndex) {
    if (!process.browser) {
      return;
    }

    const quizContainerDataString = localStorage.getItem(LOCALSTORAGE_KEY);

    let quizContainerData = {};

    if (quizContainerDataString) {
      quizContainerData = JSON.parse(quizContainerDataString);
    }

    quizContainerData[questionId] = userAnswerIndex;

    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(quizContainerData));

    this.forceUpdate();
  }

  render() {
    if (!process.browser) {
      return null;
    }

    const { questions } = this.props;

    return (
      <section>
        <LargeSectionTitle>Do you know?</LargeSectionTitle>
        {questions.map(q => (
          <QuizQuestion
            key={`quizQuestion${q.id}`}
            question={q}
            userAnswerIndex={QuizContainer.getUserAnswerIndex(q.id)}
            setUserAnswerIndex={index => this.setUserAnswerIndex(q.id, index)}
          />
        ))}
      </section>
    );
  }
}

QuizContainer.propTypes = {
  questions: PropTypes.arrayOf(quizQuestionPropType).isRequired
};
