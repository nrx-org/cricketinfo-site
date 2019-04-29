import React from "react";
import PropTypes from "prop-types";
import ProgressBarSingle from "./ProgressBarSingle";

export const ProgressBar = props => {
  const { length, next, defaultInterval, progress, pause } = props;
  return (
    <div className="wcp-fact-card__story-content__progress-bar">
      {length.map(i => {
        let isActive = 0;
        if (i === progress.id) {
          isActive = 1;
        } else if (i < progress.id) {
          isActive = 2;
        }
        return (
          <ProgressBarSingle
            key={`${React.createRef()}`}
            width={1 / length.length}
            next={next}
            defaultInterval={defaultInterval}
            active={isActive}
            pause={pause}
          />
        );
      })}
    </div>
  );
};

ProgressBar.propTypes = {
  length: PropTypes.arrayOf(PropTypes.number),
  progress: PropTypes.shape({
    id: PropTypes.number
  }),
  pause: PropTypes.bool,
  next: PropTypes.func,
  defaultInterval: PropTypes.number
};

ProgressBar.defaultProps = {
  length: [],
  progress: null,
  pause: false,
  next: null,
  defaultInterval: 0
};
