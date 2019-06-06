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

  return (
    <CloudinaryImage
      cloudName="cricwiki"
      publicId={src.slice(1)}
      alt={alt}
      className={`wcp-image ${className}`}
      responsive="auto"
      responsivePlaceholder="blank"
    >
      <Transformation
        quality="auto"
        width="auto"
        crop="scale"
        fetchFormat="auto"
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
