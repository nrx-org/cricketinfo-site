import React, { Component } from "react";
import PropTypes from "prop-types";

import { FullPageModal } from "./FullPageModal";
import { imagePropTypes } from "../lib/prop_types";
import { IconButton } from "./IconButton";
import { getBasename } from "../lib/urls";

export class ImageAttributionsModal extends Component {
  componentDidUpdate(prevProps) {
    const { isOpen } = this.props;

    if (!prevProps.isOpen && isOpen) {
      // Modal is opening.
      document.body.classList.add("noscroll");
    } else if (prevProps.isOpen && !isOpen) {
      // Modal is closing.
      document.body.classList.remove("noscroll");
    }
  }

  render() {
    const { isOpen, attributions, onClose } = this.props;

    if (!isOpen) {
      return null;
    }

    return (
      <FullPageModal>
        <section className="wcp-image-attributions-modal">
          <header className="wcp-image-attributions-modal__header">
            <h1 className="wcp-image-attributions-modal__title">
              Image licenses
            </h1>
            <IconButton onClick={onClose} altText="Close list" name="close" />
          </header>
          <ul className="wcp-image-attributions-modal__attributions-list">
            {attributions.map(attribution => (
              <li>
                <a href={attribution.url}>{getBasename(attribution.url)}</a>
                {" is licensed under "}
                <a href={attribution.licenseUrl}>{attribution.license}</a>
              </li>
            ))}
          </ul>
        </section>
      </FullPageModal>
    );
  }
}

ImageAttributionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  attributions: PropTypes.arrayOf(imagePropTypes).isRequired,
  onClose: PropTypes.func.isRequired
};
