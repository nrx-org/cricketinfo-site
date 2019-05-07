import React from "react";
import PropTypes from "prop-types";
import { factPropTypes } from "../../lib/prop_types";
import { BackgroundImage } from "../BackgroundImage";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { ExternalUrlShareModalContainer } from "../ExternalUrlShareModalContainer";

export class Story extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFavorited: false
    };

    this.imageLoaded = this.imageLoaded.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { story, setPlaybackAction } = this.props;
    if (story !== prevProps.story) {
      setPlaybackAction("pause", true);
    }
  }

  imageLoaded() {
    const { setPlaybackAction, onStoryImageLoad } = this.props;
    try {
      setPlaybackAction("play", true);
      onStoryImageLoad();
    } catch (e) {
      console.log(e);
    }
  }

  toggleFavorite() {
    const { isFavorited } = this.state;
    this.setState({ isFavorited: !isFavorited });
  }

  render() {
    const {
      story,
      loader,
      setPlaybackAction,
      isFullScreen,
      hasImageLoaded
    } = this.props;
    const { isFavorited } = this.state;
    const shareData = {
      url: story.value.url,
      title: story.label,
      text: story.value.label
    };
    return (
      <div className="wcp-story-content__story-container">
        <div
          className="wcp-story-content__image-container"
          style={{ backgroundImage: `url(${story.value.image.url})` }}
        >
          <BackgroundImage
            src={story.value.image.url}
            onLoadBg={this.imageLoaded}
            hasImageLoaded={hasImageLoaded}
            onError={err => console.log("error", err)}
          />
        </div>
        <div className="wcp-story-content__info">
          <p className="wcp-story-content__info__title">{story.label}</p>
          <p className="wcp-story-content__info__caption">
            {story.value.label}
          </p>

          <div
            className={`wcp-story-content__info__icons-and-buttons ${
              !isFullScreen ? "wcp-hide" : "wcp-show"
            }`}
          >
            {story.value.url && story.value.url.length > 0 ? (
              <span className="wcp-story-content__info__icons-and-buttons__share-icon">
                <ExternalUrlShareModalContainer
                  shareData={shareData}
                  onModalOpen={() => {
                    setPlaybackAction("pause", true);
                  }}
                  onModalClose={() => {
                    setPlaybackAction("play", true);
                  }}
                >
                  <Icon
                    className="wcp-story-content__info__icons-and-buttons__share-icon-image"
                    name="share-white"
                    altText="Share Icon"
                    size="m"
                  />
                </ExternalUrlShareModalContainer>
              </span>
            ) : null}
            <span
              className="wcp-story-content__info__icons-and-buttons__favorite-icon"
              onClick={this.toggleFavorite}
              role="presentation"
            >
              <Icon
                className="wcp-story-content__info__icons-and-buttons__favorite-icon-image"
                name={isFavorited ? "favorite-active" : "favorite"}
                altText="Favorite Icon"
                size="m"
              />
            </span>
            {story.value.url && story.value.url.length > 0 ? (
              <Button
                type="inverted"
                isFullWidth={false}
                className="wcp-story-content__container__know-more-button"
                isLink
                href={story.value.url}
              >
                Know More
              </Button>
            ) : null}
          </div>
        </div>
        {!hasImageLoaded ? (
          <div className="wcp-story-content__overlay">
            {loader || <p>loading..</p>}
          </div>
        ) : null}
      </div>
    );
  }
}

Story.propTypes = {
  story: factPropTypes.isRequired,
  setPlaybackAction: PropTypes.func,
  loader: PropTypes.element,
  isFullScreen: PropTypes.bool,
  hasImageLoaded: PropTypes.bool,
  onStoryImageLoad: PropTypes.func
};

Story.defaultProps = {
  setPlaybackAction: null,
  loader: null,
  isFullScreen: false,
  hasImageLoaded: false,
  onStoryImageLoad: null
};
