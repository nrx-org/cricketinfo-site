import { PureComponent } from "react";
import PropTypes from "prop-types";

export default class BackgroundImageOnLoad extends PureComponent {
  static propTypes = {
    src: PropTypes.string.isRequired,
    onLoadBg: PropTypes.func.isRequired,
    onError: PropTypes.func
  };

  componentDidMount() {
    this.handleLoadImage();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.src !== this.props.src) {
      this.handleLoadImage();
    }
  }

  componentWillUnmount() {
    this.unMount = true;
  }

  handleLoadImage = () => {
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
  };

  render() {
    return null;
  }
}
