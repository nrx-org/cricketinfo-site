import React, { Component } from "react";
import PropTypes from "prop-types";
import { factCardDataPropTypes } from "../lib/prop_types";
import Container from "./Stories/Container";
import { SectionTitle } from "./SectionTitle";

export class StoriesContainer extends Component {
  constructor(props) {
    super(props);
    this.pause = this.pause.bind(this);
    this.play = this.play.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
  }

  pause() {
    if (this.c) {
      this.c.pause("pause");
      return true;
    }
    return false;
  }

  play() {
    if (this.c) {
      this.c.pause("play");
      return true;
    }
    return false;
  }

  previous() {
    if (this.c) {
      this.c.previous();
      return true;
    }
    return false;
  }

  next() {
    if (this.c) {
      this.c.next();
      return true;
    }
    return false;
  }

  render() {
    const { cardData, loader, interval } = this.props;
    return (
      <section className="wcp-fact-card__story-content">
        <SectionTitle>{cardData.title}</SectionTitle>
        <div className="wcp-fact-card__story-content__container-wrapper">
          <Container
            stories={cardData.facts}
            interval={interval}
            loader={loader}
          />
        </div>
      </section>
    );
  }
}

StoriesContainer.propTypes = {
  cardData: factCardDataPropTypes.isRequired,
  interval: PropTypes.number,
  loader: PropTypes.element
};

StoriesContainer.defaultProps = {
  interval: null,
  loader: null
};
