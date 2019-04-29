import React from "react";
import PropTypes from "prop-types";
import Story from "./Story";
import { ProgressBar } from "./ProgressBar";

export default class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentId: 0,
      pause: true,
      count: 0,
      mousedownId: null
      // storiesDone: 0 // TODO
    };
    this.defaultInterval = 4000;
    this.width = "100%";
    this.height = props.height || 500;
    this.containerRef = React.createRef();
    this.debouncePause = this.debouncePause.bind(this);
    this.pause = this.pause.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
  }

  componentDidMount() {
    const { defaultInterval } = this.props;
    if (defaultInterval) this.defaultInterval = defaultInterval;
  }

  pause(action, bufferAction) {
    this.setState({ pause: action === "pause", bufferAction });
  }

  previous() {
    const { currentId } = this.state;
    if (currentId > 0) {
      this.setState({
        currentId: currentId - 1,
        count: 0
      });
    }
  }

  next() {
    const { stories } = this.props;
    const { currentId } = this.state;
    if (currentId < stories.length - 1) {
      this.setState({
        currentId: currentId + 1,
        count: 0
      });
    }
  }

  debouncePause(e) {
    e.preventDefault();
    this.setState({
      mousedownId: setTimeout(() => {
        this.pause("pause");
      }, 200)
    });
  }

  mouseUp(e, type) {
    const { pause, mousedownId } = this.state;
    e.preventDefault();
    if (mousedownId) clearTimeout(mousedownId);
    if (pause) {
      this.pause("play");
    } else if (type === "next") {
      this.next();
    } else {
      this.previous();
    }
  }

  render() {
    const { stories, loader } = this.props;
    const { pause, bufferAction, currentId, count } = this.state;
    return (
      <div
        ref={this.containerRef}
        className="wcp-fact-card__story-content__container"
      >
        <ProgressBar
          next={this.next}
          pause={pause}
          bufferAction={bufferAction}
          length={stories.map((s, i) => i)}
          defaultInterval={this.defaultInterval}
          currentStory={stories[currentId]}
          progress={{
            id: currentId,
            completed:
              count /
              ((stories[currentId] && stories[currentId].duration) ||
                this.defaultInterval)
          }}
        />
        <Story
          action={this.pause}
          bufferAction={bufferAction}
          height={this.height}
          playState={pause}
          width={this.width}
          story={stories[currentId]}
          loader={loader}
        />
        <div className="wcp-fact-card__story-content__container-overlay">
          <div
            className="wcp-fact-card__story-content__container-overlay__left-half"
            onTouchStart={this.debouncePause}
            onTouchEnd={e => this.mouseUp(e, "previous")}
            onMouseDown={this.debouncePause}
            onMouseUp={e => this.mouseUp(e, "previous")}
            role="presentation"
          />
          <div
            className="wcp-fact-card__story-content__container-overlay__right-half"
            onTouchStart={this.debouncePause}
            onTouchEnd={e => this.mouseUp(e, "next")}
            onMouseDown={this.debouncePause}
            onMouseUp={e => this.mouseUp(e, "next")}
            role="presentation"
          />
        </div>
      </div>
    );
  }
}

Container.propTypes = {
  stories: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      info: PropTypes.shape({
        heading: PropTypes.string,
        subheading: PropTypes.string
      })
    })
  ),
  defaultInterval: PropTypes.number,
  height: PropTypes.number,
  loader: PropTypes.element
};

Container.defaultProps = {
  stories: [],
  defaultInterval: 0,
  height: null,
  loader: null
};
