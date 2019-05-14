import React from "react";
import PropTypes from "prop-types";

export class LiveScoreContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      score: null,
      isLoadingScore: false
    };
  }

  async componentDidMount() {
    this.setState({
      isLoadingScore: true
    });

    const scoreResponse = await fetch("/static/content/en/score.json");
    const scoreJson = await scoreResponse.json();

    this.setState({
      score: scoreJson,
      isLoadingScore: false
    });
  }

  render() {
    const { isLoadingScore, score } = this.state;

    return <h1>hi</h1>;
  }
}

LiveScoreContainer.propTypes = {};
