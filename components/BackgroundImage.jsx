import { PureComponent } from "react";
import PropTypes from "prop-types";

export default class BackgroundImageOnLoad extends PureComponent {
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
    const { onLoadBg, onError, src } = this.props;
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

  render() {
    return null;
  }
}

BackgroundImageOnLoad.propTypes = {
  src: PropTypes.string.isRequired,
  onLoadBg: PropTypes.func.isRequired,
  onError: PropTypes.func
};

BackgroundImageOnLoad.defaultProps = {
  onError: null
};
