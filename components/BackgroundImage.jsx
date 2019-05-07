import { PureComponent } from "react";
import PropTypes from "prop-types";

export class BackgroundImage extends PureComponent {
  componentDidMount() {
    this.handleLoadImage();
  }

  componentDidUpdate(prevProps) {
    const { src } = this.props;
    if (prevProps.src !== src) {
      this.handleLoadImage();
    }
  }

  componentWillUnmount() {
    this.unMount = true;
  }

  handleLoadImage() {
    const { onLoadBg, onError, src, hasImageLoaded } = this.props;

    // if the image has loaded once, do not create image object
    if (hasImageLoaded && !this.unMount && onLoadBg) {
      onLoadBg();
    } else {
      const image = new Image();
      image.src = src;
      image.onload = () => {
        if (!this.unMount && onLoadBg) {
          onLoadBg(image);
        }
      };
      image.onerror = e => {
        if (onError) {
          onError(e);
        }
      };
    }
  }

  render() {
    return null;
  }
}

BackgroundImage.propTypes = {
  src: PropTypes.string.isRequired,
  onLoadBg: PropTypes.func.isRequired,
  onError: PropTypes.func,
  hasImageLoaded: PropTypes.bool
};

BackgroundImage.defaultProps = {
  onError: null,
  hasImageLoaded: false
};
