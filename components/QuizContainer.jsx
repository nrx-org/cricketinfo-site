import React, { Component } from "react";
import PropTypes from "prop-types";
import track from "react-tracking";
import {
  CLICK_QUIZ_ANSWER,
  QUIZ_ANSWER_CORRECT,
  QUIZ_ANSWER_WRONG
} from "../lib/matomo";
import { LargeSectionTitle } from "./LargeSectionTitle";
import { QuizQuestion } from "./QuizQuestion";
import { quizQuestionPropType } from "../lib/prop_types";
import { todayString } from "../lib/date";
import { homeUiStrings } from "../lib/ui_strings";
import { LanguageContext } from "../language_context";

const LOCALSTORAGE_KEY = "wcpQuizContainerData";

@track({ page: "QuizContainer" })
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

  componentDidMount() {
    const { questions } = this.props;

    const dateString = todayString();
    let scheduledQuestions = questions.filter(
      q => q.dates.indexOf(dateString) > -1
    );

    if (!scheduledQuestions.length) {
      scheduledQuestions = questions.filter(
        q => q.dates.indexOf("2019-05-31") > -1
      );
    }

    if (scheduledQuestions.length > 0) {
      this.setState({
        showQuizComponent: true,
        scheduledQuestions
      });
    }
  }

  @track((props, state, methodArgs) => {
    const questionId = methodArgs[0];
    const answerId = methodArgs[1];
    const currentQuestion = state.scheduledQuestions.find(el => {
      return el.id === questionId;
    });
    if (answerId === currentQuestion.answerIndex) {
      return QUIZ_ANSWER_CORRECT(questionId);
    }
    return QUIZ_ANSWER_WRONG(questionId);
  })
  @track((props, state, methodArgs) => {
    const questionId = methodArgs[0];
    return CLICK_QUIZ_ANSWER(questionId);
  })
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
    if (
      typeof quizContainerData[questionId] !== "undefined" &&
      quizContainerData[questionId] > -1
    ) {
      return;
    }

    quizContainerData[questionId] = userAnswerIndex;

    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(quizContainerData));

    this.forceUpdate();

    if (callback) {
      callback();
    }
  }

  render() {
    const { showQuizComponent, scheduledQuestions } = this.state;

    return (
      <React.Fragment>
        {showQuizComponent ? (
          <LanguageContext.Consumer>
            {lang => (
              <section>
                <LargeSectionTitle>
                  {homeUiStrings.doYouKnow[lang]}
                </LargeSectionTitle>
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
            )}
          </LanguageContext.Consumer>
        ) : null}
      </React.Fragment>
    );
  }
}

QuizContainer.propTypes = {
  questions: PropTypes.arrayOf(quizQuestionPropType).isRequired
};
