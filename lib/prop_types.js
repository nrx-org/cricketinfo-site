import PropTypes from "prop-types";

export const sectionsPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    title: PropTypes.string.isRequired,
    anchor: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    tocLevel: PropTypes.number.isRequired
  })
);

export const translationsPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired
  })
);

export const imagePropTypes = PropTypes.shape({
  url: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired
});

export const factCardDataPropTypes = PropTypes.shape({
  title: PropTypes.string.isRequired,
  cardType: PropTypes.string.isRequired,
  facts: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.shape({
        label: PropTypes.string.isRequired,
        url: PropTypes.string,
        image: imagePropTypes
      })
    })
  )
});
