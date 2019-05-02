import React from "react";
import PropTypes from "prop-types";
import { factPropTypes } from "../../lib/prop_types";
import BackgroundImage from "../BackgroundImage";
import { Icon } from "../Icon";
import { Button } from "../Button";

export default class Story extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
    this.imageLoaded = this.imageLoaded.bind(this);
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

  render() {
    const { story, loader } = this.props;
    const { loaded } = this.state;
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
          <div className="wcp-fact-card__story-content__info__icons-and-buttons">
            {story.value.url && story.value.url.length > 0 ? (
              <Icon
                className="wcp-fact-card__story-content__info__icons-and-buttons__share-icon"
                name="share-white"
                altText="Share Icon"
                size="m"
              />
            ) : (
              ""
            )}
            <Icon
              className="wcp-fact-card__story-content__info__icons-and-buttons__favorite-icon"
              name="love-white"
              altText="Favorite Icon"
              size="m"
            />
            {story.value.url && story.value.url.length > 0 ? (
              <Button
                isFullWidth={false}
                className="wcp-fact-card__story-content__container__know-more-button"
                isLink={true}
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
            <p>loading..</p>
            {loader || (
              <div>
                <div className="wcp-fact-card__story-content__spinner" />
              </div>
            )}
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
  loader: PropTypes.element
};

Story.defaultProps = {
  action: null,
  loader: null
};
