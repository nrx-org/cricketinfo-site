import PropTypes from "prop-types";

export const sectionsPropTypes = PropTypes.arrayOf(
  PropTypes.objectOf({
    title: PropTypes.string.isRequired,
    anchor: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    tocLevel: PropTypes.number.isRequired
  })
);
