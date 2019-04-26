import React from "react";
import ProgressBarSingle from "./ProgressBarSingle";
import PropTypes from "prop-types";

export default class ProgressArray extends React.Component {
  render() {
    return (
      <div className="wcp-fact-card__story-content__progress-bar">
        {this.props.length.map((i, index) => (
          <ProgressBarSingle
            key={index}
            width={1 / this.props.length.length}
            next={this.props.next}
            defaultInterval={this.props.defaultInterval}
            currentStory={this.props.currentStory}
            active={
              i === this.props.progress.id
                ? 1
                : i < this.props.progress.id
                ? 2
                : 0
            }
            pause={this.props.pause}
            bufferAction={this.props.bufferAction}
          />
        ))}
      </div>
    );
  }
}

ProgressArray.propTypes = {
  length: PropTypes.array,
  progress: PropTypes.object,
  pause: PropTypes.bool,
  next: PropTypes.func,
  currentStory: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  defaultInterval: PropTypes.number,
  bufferAction: PropTypes.bool
};
