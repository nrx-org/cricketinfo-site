import React from "react";
import PropTypes from "prop-types";

export default class ProgressBarSingle extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      duration: props.interval
    };
    this.next = this.next.bind(this);
  }

  componentDidMount() {
    if (this.inner) {
      this.inner.addEventListener("webkitAnimationEnd", this.next, false);
      this.inner.addEventListener("animationend", this.next, false);
      this.inner.addEventListener("oanimationend", this.next, false);
    }
  }

  static getDerivedStateFromProps(props) {
    return { duration: props.interval };
  }

  next() {
    const { next } = this.props;
    next();
  }

  render() {
    const { active, pause, width } = this.props;
    const { duration } = this.state;
    let innerStyle;
    switch (active) {
      case 2:
        innerStyle = { width: "100%" };
        break;
      case 1:
        innerStyle = {
          animation: `${duration}ms linear 0ms slidein`,
          animationPlayState: pause ? "paused" : "running"
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
          width: `${width * 100}%`,
          opacity: pause ? 0 : 1
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

ProgressBarSingle.propTypes = {
  width: PropTypes.number,
  interval: PropTypes.number,
  pause: PropTypes.bool,
  next: PropTypes.func,
  active: PropTypes.number
};

ProgressBarSingle.defaultProps = {
  width: 0,
  interval: 0,
  pause: false,
  next: null,
  active: null
};
