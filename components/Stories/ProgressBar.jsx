import React from "react";
import PropTypes from "prop-types";
import ProgressBarSingle from "./ProgressBarSingle";

export const ProgressBar = props => {
  const { progressMap, next, interval, progress, pause } = props;
  return (
    <div className="wcp-fact-card__story-content__progress-bar">
      {progressMap.map(i => {
        let isActive = 0;
        if (i.id === progress.id) {
          isActive = 1;
        } else if (i.id < progress.id) {
          isActive = 2;
        }
        return (
          <ProgressBarSingle
            key={`${i.id}-${i.url}`}
            width={1 / progressMap.length}
            next={next}
            interval={interval}
            active={isActive}
            pause={pause}
          />
        );
      })}
    </div>
  );
};

ProgressBar.propTypes = {
  progressMap: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      url: PropTypes.string
    })
  ),
  progress: PropTypes.shape({
    id: PropTypes.number,
    completed: PropTypes.number
  }),
  pause: PropTypes.bool,
  next: PropTypes.func,
  interval: PropTypes.number
};

ProgressBar.defaultProps = {
  progressMap: [],
  progress: null,
  pause: false,
  next: null,
  interval: 0
};
