import React from "react";
import PropTypes from "prop-types";
import { factPropTypes } from "../../lib/prop_types";
import Story from "./Story";
import { ProgressBar } from "./ProgressBar";
import { Icon } from "../Icon";

export default class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentId: 0,
      pause: true,
      mousedownId: null,
      isFullScreen: false
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
    this.openFullScreen = this.openFullScreen.bind(this);
    this.closeFullScreen = this.closeFullScreen.bind(this);
    this.pauseAndPlay = this.pauseAndPlay.bind(this);
  }

  componentDidMount() {
    const { interval } = this.props;
    if (interval) this.defaultInterval = interval;
  }

  pause(action) {
    this.setState({ pause: action === "pause" });
  }

  previous() {
    const { currentId } = this.state;
    if (currentId > 0) {
      this.setState({
        currentId: currentId - 1
      });
    }
  }

  next() {
    const { stories } = this.props;
    const { currentId } = this.state;
    if (currentId < stories.length - 1) {
      this.setState({
        currentId: currentId + 1
      });
    } else {
      this.setState({
        currentId: 0
      });
    }
  }

  debouncePause(e) {
    e.preventDefault();
    this.setState({
      mousedownId: setTimeout(() => {
        this.pause("pause");
      }, 50)
    });
  }

  openFullScreen(e) {
    e.preventDefault();
    this.setState({
      isFullScreen: true
    });
    this.pauseAndPlay();
    document.body.style.overflow = "hidden";
    document.body.classList.add("no-scroll");
  }

  closeFullScreen(e) {
    e.preventDefault();
    this.setState({
      isFullScreen: false
    });
    this.pauseAndPlay();
    document.body.style.overflow = "visible";
    document.body.classList.remove("no-scroll");
  }

  pauseAndPlay() {
    this.pause("pause");
    setTimeout(() => {
      this.pause("play");
    }, 50);
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
    const { pause, currentId, isFullScreen } = this.state;
    return (
      <div
        ref={this.containerRef}
        className={
          isFullScreen
            ? "wcp-fact-card__story-content__container wcp-fact-card__story-content__container__full-screen"
            : "wcp-fact-card__story-content__container"
        }
      >
        {isFullScreen ? (
          <div
            className="wcp-fact-card__story-content__container__close-fullscreen-icon"
            onTouchStart={this.closeFullScreen}
            onMouseDown={this.closeFullScreen}
            role="presentation"
          >
            <Icon name="close" altText="Close Fullscreen Story Icon" size="m" />
          </div>
        ) : (
          ""
        )}
        <ProgressBar
          next={this.next}
          pause={pause}
          progressMap={stories.map((s, i) => {
            return { url: s.url, id: i };
          })}
          interval={this.defaultInterval}
          currentStory={stories[currentId]}
          progress={{
            id: currentId,
            completed: 0 / this.defaultInterval
          }}
        />
        <Story
          action={this.pause}
          height={this.height}
          playState={pause}
          width={this.width}
          story={stories[currentId]}
          loader={loader}
          key={currentId}
        />
        <div className="wcp-fact-card__story-content__container-overlay">
          {!isFullScreen ? (
            <div
              className="wcp-fact-card__story-content__full-screen-trigger"
              onTouchStart={this.openFullScreen}
              onMouseDown={this.openFullScreen}
              role="presentation"
            />
          ) : (
            ""
          )}
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
  stories: PropTypes.arrayOf(factPropTypes),
  interval: PropTypes.number,
  height: PropTypes.number,
  loader: PropTypes.element
};

Container.defaultProps = {
  stories: [],
  interval: 0,
  height: null,
  loader: null
};
