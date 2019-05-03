import React from "react";
import PropTypes from "prop-types";
import { factCardDataPropTypes } from "../lib/prop_types";
import { Container } from "./Stories/Container";
import { SectionTitle } from "./SectionTitle";

export const StoriesContainer = props => {
  const { cardData, loader, interval } = props;
  return (
    <section className="wcp-story-content">
      <SectionTitle>{cardData.title}</SectionTitle>
      <div className="wcp-story-content__container-wrapper">
        <Container
          stories={cardData.facts}
          interval={interval}
          loader={loader}
        />
      </div>
    </section>
  );
};

StoriesContainer.propTypes = {
  cardData: factCardDataPropTypes.isRequired,
  interval: PropTypes.number,
  loader: PropTypes.element
};

StoriesContainer.defaultProps = {
  interval: null,
  loader: null
};
