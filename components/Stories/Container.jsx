import React from "react";
import PropTypes from "prop-types";
import track from "react-tracking";
import { OPEN_STORY_FULL_SCREEN } from "../../lib/matomo";
import { factPropTypes } from "../../lib/prop_types";
import { Story } from "./Story";
import { ProgressBar } from "./ProgressBar";
import { Icon } from "../Icon";

@track({ page: "StoryContainer" })
export class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStoryIndex: 0,
      isPaused: true,
      isFullScreen: false,
      mousedownId: null,
      storyImagesLoaded: props.stories.map(story => {
        if (
          story.value.image &&
          story.value.image.url &&
          story.value.image.url.length > 0
        ) {
          return false;
        }
        return true;
      })
    };
    this.defaultInterval = 4000;
    this.width = "100%";
    this.height = props.height || 500;
    this.containerRef = React.createRef();
    this.setPlaybackAction = this.setPlaybackAction.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onOpenFullScreen = this.onOpenFullScreen.bind(this);
    this.onCloseFullScreen = this.onCloseFullScreen.bind(this);
    this.pauseAndPlay = this.pauseAndPlay.bind(this);
    this.debouncePause = this.debouncePause.bind(this);
    this.onStoryImageLoad = this.onStoryImageLoad.bind(this);
  }

  componentDidMount() {
    const { interval } = this.props;
    if (interval) this.defaultInterval = interval;
  }

  @track(() => {
    return OPEN_STORY_FULL_SCREEN(window.location.pathname);
  })
  onOpenFullScreen(e) {
    e.preventDefault();
    this.setState({
      isFullScreen: true
    });
    this.pauseAndPlay();
    document.body.style.overflow = "hidden";
    document.body.classList.add("no-scroll");
  }

  onCloseFullScreen(e) {
    e.preventDefault();
    this.setState({
      isFullScreen: false
    });
    this.pauseAndPlay();
    document.body.style.overflow = "visible";
    document.body.classList.remove("no-scroll");
  }

  onClick(e, type) {
    const { isPaused, mousedownId } = this.state;
    e.preventDefault();
    if (mousedownId) clearTimeout(mousedownId);
    if (isPaused) {
      this.setPlaybackAction("play");
    } else if (type === "next") {
      this.next();
    } else {
      this.previous();
    }
  }

  onStoryImageLoad() {
    const { currentStoryIndex } = this.state;
    this.setState(prevState => {
      const newStoryImagesLoaded = [...prevState.storyImagesLoaded];
      newStoryImagesLoaded[currentStoryIndex] = false;
      return { storyImagesLoaded: newStoryImagesLoaded };
    });
  }

  setPlaybackAction(action) {
    this.setState({ isPaused: action === "pause" });
  }

  previous() {
    this.setPlaybackAction("pause");
    const { currentStoryIndex } = this.state;
    if (currentStoryIndex > 0) {
      this.setState({
        currentStoryIndex: currentStoryIndex - 1
      });
    }
  }

  next() {
    this.setPlaybackAction("pause");
    const { stories } = this.props;
    const { currentStoryIndex } = this.state;
    if (currentStoryIndex < stories.length - 1) {
      this.setState({
        currentStoryIndex: currentStoryIndex + 1
      });
    } else {
      this.setState({
        currentStoryIndex: 0
      });
    }
  }

  debouncePause(e) {
    e.preventDefault();
    this.setState({
      mousedownId: setTimeout(() => {
        this.setPlaybackAction("pause");
      }, 200)
    });
  }

  pauseAndPlay() {
    this.setPlaybackAction("pause");
    setTimeout(() => {
      this.setPlaybackAction("play");
    }, 50);
  }

  render() {
    const { stories, loader } = this.props;
    const {
      isPaused,
      currentStoryIndex,
      isFullScreen,
      storyImagesLoaded
    } = this.state;

    return (
      <div
        ref={this.containerRef}
        className={
          isFullScreen
            ? "wcp-story-content__container wcp-story-content__container__full-screen"
            : "wcp-story-content__container"
        }
      >
        {isFullScreen ? (
          <div
            className="wcp-story-content__container__close-fullscreen-icon"
            onClick={this.onCloseFullScreen}
            role="presentation"
          >
            <Icon name="close" altText="Close Fullscreen Story Icon" size="m" />
          </div>
        ) : null}
        <ProgressBar
          next={this.next}
          pause={isPaused}
          progressMap={stories.map((s, i) => {
            return { url: s.url, id: i };
          })}
          interval={this.defaultInterval}
          currentStory={stories[currentStoryIndex]}
          progress={{
            id: currentStoryIndex,
            completed: 0 / this.defaultInterval
          }}
        />
        <Story
          setPlaybackAction={this.setPlaybackAction}
          story={stories[currentStoryIndex]}
          loader={loader}
          key={currentStoryIndex}
          isFullScreen={isFullScreen}
          hasImageLoaded={storyImagesLoaded[currentStoryIndex]}
          onStoryImageLoad={this.onStoryImageLoad}
        />
        <div className="wcp-story-content__container-overlay">
          {!isFullScreen ? (
            <div
              className="wcp-story-content__full-screen-trigger"
              onClick={this.onOpenFullScreen}
              role="presentation"
            />
          ) : null}
          <div
            className="wcp-story-content__container-overlay__left-half"
            onTouchStart={this.debouncePause}
            onTouchEnd={e => this.onClick(e, "previous")}
            onMouseDown={this.debouncePause}
            onMouseUp={e => this.onClick(e, "previous")}
            role="presentation"
          />
          <div
            className="wcp-story-content__container-overlay__right-half"
            onTouchStart={this.debouncePause}
            onTouchEnd={e => this.onClick(e, "next")}
            onMouseDown={this.debouncePause}
            onMouseUp={e => this.onClick(e, "next")}
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
