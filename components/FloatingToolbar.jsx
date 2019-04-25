import React from "react";
import { PropTypes } from "prop-types";

import { Icon } from "./Icon";
import { getAbsoluteArticleUrl, getPdfShareUrl } from "../lib/urls";

const SAVE_TEXT = {
  hi: "सेव करें",
  en: "Save for later"
};

const SHARE_TEXT = {
  hi: "लेख शेयर करें",
  en: "Share article"
};

export const FloatingToolbar = ({
  onShareClick,
  openModal,
  articleId,
  lang
}) => {
  return (
    <div className="wcp-floating-toolbar">
      <a
        href={getPdfShareUrl(getAbsoluteArticleUrl(articleId, lang))}
        className="wcp-floating-toolbar__item"
      >
        <Icon
          name="bookmark"
          altText="Save for Later Icon"
          className="wcp-floating-toolbar__item__icon"
        />
        <span className="wcp-floating-toolbar__item__text">
          {SAVE_TEXT[lang]}
        </span>
      </a>

      <div className="wcp-floating-toolbar__divider" />

      <button
        type="button"
        onClick={event => {
          onShareClick(event, openModal);
        }}
        className="wcp-floating-toolbar__item"
      >
        <Icon
          name="share"
          altText="Share Icon"
          className="wcp-floating-toolbar__item__icon"
        />
        <span className="wcp-floating-toolbar__item__text">
          {SHARE_TEXT[lang]}
        </span>
      </button>
    </div>
  );
};

FloatingToolbar.propTypes = {
  onShareClick: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  articleId: PropTypes.string.isRequired
};
