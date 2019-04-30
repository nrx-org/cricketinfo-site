import React from "react";
import PropTypes from "prop-types";
import { storyPropTypes } from "../../lib/prop_types";
import BackgroundImage from "../BackgroundImage";
import { Icon } from "../Icon";

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
          style={{ backgroundImage: `url(${story.url})` }}
        >
          <BackgroundImage
            src={story.url}
            onLoadBg={this.imageLoaded}
            onError={err => console.log("error", err)}
          />
        </div>
        {story.info ? (
          <div className="wcp-fact-card__story-content__info">
            <p className="wcp-fact-card__story-content__info__title">
              {story.info.heading}
            </p>
            <p className="wcp-fact-card__story-content__info__caption">
              {story.info.subheading}
            </p>
            <div className="wcp-fact-card__story-content__info__icons">
              <Icon name="share-white" altText="Share Icon" size="m" />
              <Icon name="love-white" altText="Bookmark Icon" size="m" />
            </div>
          </div>
        ) : (
          ""
        )}
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
  story: storyPropTypes.isRequired,
  action: PropTypes.func,
  loader: PropTypes.element
};

Story.defaultProps = {
  action: null,
  loader: null
};
