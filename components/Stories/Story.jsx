import React from "react";
import PropTypes from "prop-types";
import BackgroundImage from "../BackgroundImage";
import { Icon } from "../Icon";

export default class Story extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.story !== prevProps.story) {
      this.pauseId && clearTimeout(this.pauseId);
      this.pauseId = setTimeout(() => {
        this.setState({ loaded: false });
      }, 100);
      this.props.action("pause", true);
    }
  }
  toggleMore = show => {
    this.setState({ showMore: show });
  };
  imageLoaded = () => {
    try {
      if (this.pauseId) clearTimeout(this.pauseId);
      this.setState({ loaded: true });
      this.props.action("play", true);
    } catch (e) {
      console.log(e);
    }
  };
  render() {
    let isInfo = this.props.story.info;
    let imageUrl = this.props.story.url;
    return (
      <div className="wcp-fact-card__story-content__main-container">
        <div
          className="wcp-fact-card__story-content__image-container"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <BackgroundImage
            src={imageUrl}
            onLoadBg={this.imageLoaded}
            onError={err => console.log("error", err)}
          />
        </div>
        {isInfo && (
          <div className="wcp-fact-card__story-content__info">
            <p className="wcp-fact-card__story-content__info__title">
              {this.props.story.info.heading}
            </p>
            <p className="wcp-fact-card__story-content__info__caption">
              {this.props.story.info.subheading}
            </p>
            <div className="wcp-fact-card__story-content__info__icons">
              <Icon name="share-white" altText="Share Icon" size="m" />
              <Icon name="love-white" altText="Bookmark Icon" size="m" />
            </div>
          </div>
        )}
        {!this.state.loaded && (
          <div className="wcp-fact-card__story-content__overlay">
            {this.props.loader || (
              <div className="wcp-fact-card__story-content__spinner" />
            )}
          </div>
        )}
      </div>
    );
  }
}

Story.propTypes = {
  story: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  height: PropTypes.number,
  width: PropTypes.string,
  action: PropTypes.func,
  loader: PropTypes.element,
  header: PropTypes.element,
  playState: PropTypes.bool,
  bufferAction: PropTypes.bool
};
