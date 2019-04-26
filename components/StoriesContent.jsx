import React, { Component } from "react";
import Container from "./Stories/Container";
import PropTypes from "prop-types";
import { factCardDataPropTypes } from "../lib/prop_types";

export class StoriesContainer extends Component {
  constructor(props) {
    super(props);
    this.pause = this.pause.bind(this);
    this.play = this.play.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
  }
  componentDidMount() {
    this.props.cardData.facts.map(s => {
      let i = new Image();
      if (!(typeof s === "object")) {
        i.src = typeof s === "object" ? s.url : s;
      }
    });
  }

  pause() {
    if (this.c) {
      this.c.pause("pause");
      return true;
    } else return false;
  }

  play() {
    if (this.c) {
      this.c.pause("play");
      return true;
    } else return false;
  }

  previous() {
    if (this.c) {
      this.c.previous();
      return true;
    } else return false;
  }

  next() {
    if (this.c) {
      this.c.next();
      return true;
    } else return false;
  }

  toggleSeeMore(show) {
    if (this.c) {
      return this.c.toggleMore(show);
    } else return false;
  }

  render() {
    return (
      <div>
        <Container
          ref={c => (this.c = c)}
          stories={this.props.cardData.stories}
          defaultInterval={this.props.defaultInterval}
          width={this.props.width || "100%"}
          height={this.props.height}
          loader={this.props.loader}
          header={this.props.header}
        />
      </div>
    );
  }
}

StoriesContainer.propTypes = {
  cardData: factCardDataPropTypes.isRequired,
  defaultInterval: PropTypes.number,
  width: PropTypes.string,
  height: PropTypes.number,
  loader: PropTypes.element,
  header: PropTypes.element
};
