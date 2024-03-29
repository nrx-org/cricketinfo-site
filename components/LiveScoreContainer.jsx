import React from "react";
import { getFlagImageUrl } from "../lib/urls";
import { getLiveScore } from "../lib/live_score";
import { Image } from "./Image";

const formatScore = team => {
  if (!team.score) {
    return "-";
  }

  if (team.score.runs === 0 && team.score.wickets === 0) {
    return "-";
  }

  return `${team.score.runs}/${team.score.wickets}`;
};

const MATCH_STATUS_STARTED = "started";
const MATCH_STATUS_COMPLETED = "completed";

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

    const score = await getLiveScore();

    this.setState({
      score: {
        matches: score
      },
      isLoadingScore: false
    });
  }

  render() {
    const { isLoadingScore, score } = this.state;

    if (!score || isLoadingScore) {
      return null;
    }

    return (
      <div className="wcp-live-score-container">
        {score.matches.map(match => (
          <div className="wcp-live-score-container__score-table-container">
            <div className="wcp-live-score-container__title">
              {match.status === MATCH_STATUS_STARTED ? (
                <div className="wcp-live-score-container__title__dot" />
              ) : null}
              <span className="wcp-live-score-container__title__text">
                {match.status === MATCH_STATUS_STARTED ? "LIVE" : ""}
                {match.status === MATCH_STATUS_COMPLETED && match.resultMessage
                  ? match.resultMessage
                  : ""}
              </span>
            </div>
            <table className="wcp-live-score-container__score-table">
              <tr>
                <th className="wcp-font-family-heading">
                  <Image
                    className="wcp-live-score-container__team-flag"
                    src={getFlagImageUrl(match.teamA.name)}
                    alt={`Flag of ${match.teamA.name}`}
                  />
                  <span className="wcp-live-score-container__team-label">
                    {match.teamA.label.toLocaleUpperCase()}
                  </span>
                </th>
                <td>{formatScore(match.teamA)}</td>
              </tr>
              <tr>
                <th className="wcp-font-family-heading">
                  <img
                    className="wcp-live-score-container__team-flag"
                    src={getFlagImageUrl(match.teamB.name)}
                    alt={`Flag of ${match.teamB.name}`}
                  />
                  <span className="wcp-live-score-container__team-label">
                    {match.teamB.label.toLocaleUpperCase()}
                  </span>
                </th>
                <td>{formatScore(match.teamB)}</td>
              </tr>
            </table>
          </div>
        ))}
      </div>
    );
  }
}

LiveScoreContainer.propTypes = {};
