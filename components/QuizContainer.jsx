import React, { Component } from "react";
import PropTypes from "prop-types";
import { LargeSectionTitle } from "./LargeSectionTitle";
import { QuizQuestion } from "./QuizQuestion";
import { quizQuestionPropType } from "../lib/prop_types";
import { todayString } from "../lib/date";

const LOCALSTORAGE_KEY = "wcpQuizContainerData";

export class QuizContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showQuizComponent: false,
      scheduledQuestions: []
    };

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

  setUserAnswerIndex(questionId, userAnswerIndex, callback) {
    if (!process.browser) {
      return;
    }

    const quizContainerDataString = localStorage.getItem(LOCALSTORAGE_KEY);

    let quizContainerData = {};

    if (quizContainerDataString) {
      quizContainerData = JSON.parse(quizContainerDataString);
    }

    // Do not let users change the answer
    if(typeof quizContainerData[questionId] !== 'undefined' && quizContainerData[questionId] > -1) {
      return;
    }

    quizContainerData[questionId] = userAnswerIndex;

    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(quizContainerData));

    this.forceUpdate();

    if(callback) {
      callback()
    }
  }

  componentDidMount() {
    const { questions } = this.props;

    const dateString = todayString();
    const scheduledQuestions = questions.filter(q => q.date === dateString);

    if (scheduledQuestions.length > 0) {
      this.setState({
        showQuizComponent: true,
        scheduledQuestions: scheduledQuestions
      });
    }
  }

  render() {
    const { questions } = this.props;
    const { showQuizComponent, scheduledQuestions } = this.state;

    return (
      <React.Fragment>
        {showQuizComponent ? (
          <section>
            <LargeSectionTitle>Do you know?</LargeSectionTitle>
            {scheduledQuestions.map(q => (
              <QuizQuestion
                key={`quizQuestion${q.id}`}
                question={q}
                userAnswerIndex={QuizContainer.getUserAnswerIndex(q.id)}
                setUserAnswerIndex={(index, callback) =>
                  this.setUserAnswerIndex(q.id, index, callback)
                }
              />
            ))}
          </section>
        ) : null}
      </React.Fragment>
    );
  }
}

QuizContainer.propTypes = {
  questions: PropTypes.arrayOf(quizQuestionPropType).isRequired
};
