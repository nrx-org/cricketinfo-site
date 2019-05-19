import React from "react";
import PropTypes from "prop-types";
import { getFlagImageUrl } from "../lib/urls";

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

    if (!score) {
      return null;
    }

    return (
      <div className="wcp-live-score-container">
        <div className="wcp-live-score-container__title">
          <div className="wcp-live-score-container__title__dot" />
          <span className="wcp-live-score-container__title__text">Live</span>
        </div>

        <div className="wcp-live-score-container__score-table-container">
          {score.matches.map(match => (
            <table className="wcp-live-score-container__score-table">
              <tr>
                <th className="wcp-font-family-heading">
                  <img
                    className="wcp-live-score-container__team-flag"
                    src={getFlagImageUrl(match.teamA.label)}
                    alt={`Flag of ${match.teamA.label}`}
                  />
                  <span className="wcp-live-score-container__team-label">
                    {match.teamA.label}
                  </span>
                </th>
                {match.teamA.score ? (
                  <td>
                    {`${match.teamA.score.runs}/${match.teamA.score.wickets}`}
                  </td>
                ) : (
                  <td>-</td>
                )}
              </tr>
              <tr>
                <th className="wcp-font-family-heading">
                  <img
                    className="wcp-live-score-container__team-flag"
                    src={getFlagImageUrl(match.teamB.label)}
                    alt={`Flag of ${match.teamB.label}`}
                  />
                  <span className="wcp-live-score-container__team-label">
                    {match.teamB.label}
                  </span>
                </th>
                {match.teamB.score ? (
                  <td>
                    {`${match.teamB.score.runs}/${match.teamB.score.wickets}`}
                  </td>
                ) : (
                  <td>-</td>
                )}
              </tr>
            </table>
          ))}
        </div>
      </div>
    );
  }
}

LiveScoreContainer.propTypes = {};
