import React from "react";
import PropTypes from "prop-types";

import { ModalContextConsumer } from "./ModalContext";
import { ARTICLE_SUMMARY_MODAL_ID } from "../lib/modal_ids";

const ArticleSummaryLink = ({ href, className, children, styles, onClick }) => {
  const articleSlug = href
    .split("/")
    .filter(item => item)
    .slice(-1)
    .pop();

  return (
    <ModalContextConsumer>
      {({ openModal }) => (
        <>
          <div
            role="presentation"
            onClick={() => {
              if (onClick) onClick();
              openModal(ARTICLE_SUMMARY_MODAL_ID, { articleSlug });
            }}
            className={`wcp-article-summary-link ${className}`}
            style={styles}
          >
            {children}
          </div>
        </>
      )}
    </ModalContextConsumer>
  );
};

ArticleSummaryLink.defaultProps = {
  className: "",
  children: null,
  styles: null,
  onClick: null
};

ArticleSummaryLink.propTypes = {
  href: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  styles: PropTypes.shape({
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }),
  onClick: PropTypes.func
};

export default ArticleSummaryLink;
