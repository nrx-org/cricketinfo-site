import React from "react";
import PropTypes from "prop-types";
import track from "react-tracking";
import cloudinary from "cloudinary-core";
import { LIKE_STORY } from "../../lib/matomo";
import { factPropTypes } from "../../lib/prop_types";
import { BackgroundImage } from "../BackgroundImage";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { ExternalUrlShareModalContainer } from "../ExternalUrlShareModalContainer";

const LOCALSTORAGE_KEY = "wcpStoryFavorites";

@track({ page: "StoryIndividual" })
export class Story extends React.Component {
  constructor(props) {
    super(props);

    this.imageLoaded = this.imageLoaded.bind(this);

    this.setFavoritedInfoToLocalStorage = this.setFavoritedInfoToLocalStorage.bind(
      this
    );

    if (props.story) {
      this.state = {
        isFavorited: Story.getFavoritedInfoFromLocalStorage()[props.story.id]
      };
    }
  }

  componentDidMount() {
    const { story } = this.props;
    const storyImageExists =
      story.value.image &&
      story.value.image.url &&
      story.value.image.url.length > 0;
    if (!storyImageExists) {
      this.imageLoaded();
    }
  }

  componentDidUpdate(prevProps) {
    const { story, setPlaybackAction } = this.props;
    if (story !== prevProps.story) {
      setPlaybackAction("pause", true);
    }
  }

  static getFavoritedInfoFromLocalStorage() {
    if (!process.browser) {
      return -1;
    }

    const storyFavoritesDataString = localStorage.getItem(LOCALSTORAGE_KEY);
    return storyFavoritesDataString && storyFavoritesDataString.length
      ? JSON.parse(storyFavoritesDataString)
      : {};
  }

  @track(props => {
    return LIKE_STORY(`${props.story.id}-${props.story.label}`);
  })
  setFavoritedInfoToLocalStorage() {
    const { story } = this.props;

    const storyFavoritesData = Story.getFavoritedInfoFromLocalStorage();

    storyFavoritesData[story.id] = !storyFavoritesData[story.id];
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(storyFavoritesData));
    this.setState({ isFavorited: storyFavoritesData[story.id] });
  }

  imageLoaded() {
    const { setPlaybackAction, onStoryImageLoad } = this.props;
    try {
      setPlaybackAction("play", true);
      onStoryImageLoad();
    } catch (e) {
      // eslint-disable-next-line no-console
      // console.log(e);
    }
  }

  render() {
    const {
      story,
      setPlaybackAction,
      isFullScreen,
      hasImageLoaded
    } = this.props;

    if (!story) {
      return null;
    }

    const { isFavorited } = this.state;
    const shareData = {
      url: story.value.image.url,
      title: story.label,
      text: story.value.label
    };

    const storyImageExists =
      story.value.image &&
      story.value.image.url &&
      story.value.image.url.length > 0;

    const cl = new cloudinary.Cloudinary({
      // TODO: Put this in a constant somewhere
      cloud_name: "cricwiki",
      secure: true
    });

    const cloudinaryUrl =
      process.env.NODE_ENV === "development"
        ? story.value.image.url
        : cl.url(story.value.image.url, {
            crop: "fit",
            width: 1200,
            quality: "auto:good",
            fetchFormat: "auto"
          });

    return (
      <div className="wcp-story-content__story-container">
        {storyImageExists ? (
          <div
            className="wcp-story-content__image-container"
            style={{ backgroundImage: `url(${cloudinaryUrl})` }}
          >
            <BackgroundImage
              src={cloudinaryUrl}
              onLoadBg={this.imageLoaded}
              hasImageLoaded={hasImageLoaded}
            />
          </div>
        ) : (
          <div className="wcp-story-image-placeholder">
            <span role="img" aria-label="Missing image">
              ❓
            </span>
          </div>
        )}

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
            {story.value.image.url && story.value.image.url.length > 0 ? (
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
              onClick={this.setFavoritedInfoToLocalStorage}
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
                isInverted
                isFullWidth={false}
                className="wcp-story-content__container__know-more-button"
                href={story.value.url}
              >
                Know More
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

Story.propTypes = {
  story: factPropTypes.isRequired,
  setPlaybackAction: PropTypes.func,
  isFullScreen: PropTypes.bool,
  hasImageLoaded: PropTypes.bool,
  onStoryImageLoad: PropTypes.func
};

Story.defaultProps = {
  setPlaybackAction: null,
  isFullScreen: false,
  hasImageLoaded: false,
  onStoryImageLoad: null
};
