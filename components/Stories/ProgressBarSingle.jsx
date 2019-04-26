import React from "react";
import PropTypes from "prop-types";

export default class Progress extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      duration: this.props.defaultInterval
    };
  }

  componentDidMount() {
    if (this.inner) {
      this.inner.addEventListener("webkitAnimationEnd", this.next, false);
      this.inner.addEventListener("animationend", this.next, false);
      this.inner.addEventListener("oanimationend", this.next, false);
    }
  }

  static getDerivedStateFromProps(props, state) {
    let current = props.currentStory;
    if (current.duration) return { duration: current.duration };
    return { duration: props.defaultInterval };
  }

  next = () => {
    this.props.next();
  };

  render() {
    let innerStyle;
    switch (this.props.active) {
      case 2:
        innerStyle = { width: "100%" };
        break;
      case 1:
        innerStyle = {
          animation: `${this.state.duration}ms linear 0ms slidein`,
          animationPlayState: this.props.pause ? "paused" : "running"
        };
        break;
      case 0:
        innerStyle = { width: 0 };
        break;
      default:
        innerStyle = { width: 0 };
        break;
    }
    return (
      <div
        className="wcp-fact-card__story-content__progress-bar__single"
        style={{
            width: `${this.props.width * 100}%`,
            opacity: this.props.pause && !this.props.bufferAction ? 0 : 1
        }}
      >
        <div
          ref={r => {
            this.inner = r;
          }}
          className="wcp-fact-card__story-content__progress-bar__single__inner"
          style={innerStyle}
        />
      </div>
    );
  }
}

Progress.propTypes = {
  width: PropTypes.number,
  defaultInterval: PropTypes.number,
  pause: PropTypes.bool,
  next: PropTypes.func,
  active: PropTypes.number,
  currentStory: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  bufferAction: PropTypes.bool
};
