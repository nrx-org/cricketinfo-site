import React, { Component } from "react";
import PropTypes from "prop-types";

const PLACEHOLDER_EMOJIS = {
  generic: "❓",
  award: "🏆"
};

export class Image extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.onError = this.onError.bind(this);

    this.state = {
      isBroken: !props.src
    };
  }

  componentDidMount() {
    if (this.ref && this.ref.current) {
      this.ref.current.addEventListener("error", this.onError);
    }
  }

  componentWillUnmount() {
    if (this.ref && this.ref.current) {
      this.ref.current.removeEventListener("error", this.onError);
    }
  }

  onError() {
    this.setState({ isBroken: true });
  }

  render() {
    const { src, alt, className, type } = this.props;
    const { isBroken } = this.state;

    if (isBroken) {
      return (
        <div className={`wcp-image wcp-image--error ${className}`} title={alt}>
          <span role="img" aria-label="Missing image">
            {PLACEHOLDER_EMOJIS[type]}
          </span>
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        ref={this.ref}
        className={`wcp-image ${className}`}
      />
    );
  }
}

Image.defaultProps = {
  type: "generic"
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["generic", "award"])
};
