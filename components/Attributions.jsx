/* eslint-disable react/no-danger */

import React from "react";
import PropTypes from "prop-types";

import { ModalContextConsumer } from "./ModalContext";
import { IMAGE_ATTRIBUTIONS_MODAL_ID } from "../lib/modal_ids";
import { imagePropTypes } from "../lib/prop_types";
import { getContactFormUrl } from "../lib/urls";
import { commonUiStrings } from "../lib/ui_strings";

export const Attributions = ({ attributions, lang }) => (
  <section className="wcp-attributions">
    {/* eslint-disable react/jsx-one-expression-per-line */}
    <p dangerouslySetInnerHTML={{ __html: commonUiStrings.license[lang] }} />
    <p>
      <ModalContextConsumer>
        {({ openModal }) => (
          <button
            onClick={() =>
              openModal(IMAGE_ATTRIBUTIONS_MODAL_ID, { attributions })
            }
            type="button"
            className="wcp-attributions__know-more"
          >
            {commonUiStrings.seeImageLicenses[lang]}
          </button>
        )}
      </ModalContextConsumer>
    </p>
    <p
      dangerouslySetInnerHTML={{ __html: commonUiStrings.usesCookies[lang]() }}
    />
    <p>
      <a
        href={getContactFormUrl(lang)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {commonUiStrings.contactUs[lang]}
      </a>
    </p>
    {/* eslint-enable react/jsx-one-expression-per-line */}
  </section>
);

Attributions.propTypes = {
  attributions: PropTypes.arrayOf(imagePropTypes).isRequired,
  lang: PropTypes.string.isRequired
};
