import React from "react";
import PropTypes from "prop-types";
import { factPropTypes } from "../../lib/prop_types";
import BackgroundImage from "../BackgroundImage";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { ExternalUrlShareModalContainer } from "../ExternalUrlShareModalContainer";

export default class Story extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      favorited: false
    };
    this.imageLoaded = this.imageLoaded.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { story, action } = this.props;
    if (story !== prevProps.story) {
      action("pause", true);
    }
  }

  imageLoaded() {
    const { action } = this.props;
    try {
      this.setState({ loaded: true });
      action("play", true);
    } catch (e) {
      console.log(e);
    }
  }

  toggleFavorite() {
    const { favorited } = this.state;
    this.setState({ favorited: !favorited });
  }

  render() {
    const { story, loader, action, isFullScreen } = this.props;
    const { loaded, favorited } = this.state;
    const shareData = {
      url: story.value.url,
      title: story.label,
      text: story.value.label
    };
    return (
      <div className="wcp-fact-card__story-content__story-container">
        <div
          className="wcp-fact-card__story-content__image-container"
          style={{ backgroundImage: `url(${story.value.image.url})` }}
        >
          <BackgroundImage
            src={story.value.image.url}
            onLoadBg={this.imageLoaded}
            onError={err => console.log("error", err)}
          />
        </div>
        <div className="wcp-fact-card__story-content__info">
          <p className="wcp-fact-card__story-content__info__title">
            {story.label}
          </p>
          <p className="wcp-fact-card__story-content__info__caption">
            {story.value.label}
          </p>

          <div className={`wcp-fact-card__story-content__info__icons-and-buttons ${!isFullScreen ? 'wcp-hide': 'wcp-show'}`}>
            {story.value.url && story.value.url.length > 0 ? (
              <span className="wcp-fact-card__story-content__info__icons-and-buttons__share-icon">
                <ExternalUrlShareModalContainer
                  shareData={shareData}
                  onModalOpen={() => {
                    action("pause", true);
                  }}
                  onModalClose={() => {
                    action("play", true);
                  }}
                >
                  <Icon
                    className="wcp-fact-card__story-content__info__icons-and-buttons__share-icon-image"
                    name="share-white"
                    altText="Share Icon"
                    size="m"
                  />
                </ExternalUrlShareModalContainer>
              </span>
            ) : (
              ""
            )}
            <span
              className="wcp-fact-card__story-content__info__icons-and-buttons__favorite-icon"
              onClick={this.toggleFavorite}
              role="presentation"
            >
              <Icon
                className="wcp-fact-card__story-content__info__icons-and-buttons__favorite-icon-image"
                name={favorited ? "favorite-active" : "favorite"}
                altText="Favorite Icon"
                size="m"
              />
            </span>
            {story.value.url && story.value.url.length > 0 ? (
              <Button
                type="inverted"
                isFullWidth={false}
                className="wcp-fact-card__story-content__container__know-more-button"
                isLink
                href={story.value.url}
              >
                Know More
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
        {!loaded ? (
          <div className="wcp-fact-card__story-content__overlay">
            {loader || <p>loading..</p>}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

Story.propTypes = {
  story: factPropTypes.isRequired,
  action: PropTypes.func,
  loader: PropTypes.element,
  isFullScreen: PropTypes.bool
};

Story.defaultProps = {
  action: null,
  loader: null,
  isFullScreen: false
};
