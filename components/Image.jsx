import React from "react";
import PropTypes from "prop-types";

import { Image as CloudinaryImage, Transformation } from "cloudinary-react";

const PLACEHOLDER_EMOJIS = {
  generic: "❓",
  award: "🏆"
};

export const Image = ({ src, alt, className, type }) => {
  if (!src) {
    return (
      <div className={`wcp-image wcp-image--error ${className}`} title={alt}>
        <span role="img" aria-label="Missing image">
          {PLACEHOLDER_EMOJIS[type]}
        </span>
      </div>
    );
  }

  if (process.env.NODE_ENV === "development") {
    return <img src={src} alt={alt} className={`wcp-image ${className}`} />;
  }

  let fetchFormat = "auto";
  if (src.slice(src.length - 3).toLocaleLowerCase() === "svg") {
    fetchFormat = "svg";
  }

  return (
    <CloudinaryImage
      cloudName="cricwiki"
      secure="true"
      publicId={src.slice(1)}
      alt={alt}
      className={`wcp-image ${className}`}
    >
      <Transformation
        quality="auto:low"
        width="1200"
        crop="limit"
        fetchFormat={fetchFormat}
      />
    </CloudinaryImage>
  );
};

Image.defaultProps = {
  type: "generic"
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["generic", "award"])
};
