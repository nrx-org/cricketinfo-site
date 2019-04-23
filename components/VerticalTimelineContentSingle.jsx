import React from "react";
import { factPropTypes } from "../lib/prop_types";
import { Card } from "./Card";

export class VerticalTimelineContentSingle extends React.Component {
  constructor(props) {
    super(props);
    this.selector = React.createRef();
    this.state = {
      lineStyle: {
        height: 0
      }
    };
  }

  componentDidMount() {
    const rect = this.selector.current.getBoundingClientRect();
    this.setState({ lineStyle: { height: `${rect.height}px` } });
  }

  render() {
    const { fact } = this.props;
    const { lineStyle } = this.state;
    const innerCardsList = fact.value.innerCards.map(g => {
      return (
        <Card
          key={`${g.label}-${g.id}`}
          shadowSize="s"
          coverImage={g.value.image}
          imagePosition="left"
          title={g.label}
          titleClassName="wcp-fact-card__vertical-timeline-content__item__card__title"
          className="wcp-fact-card__vertical-timeline-content__item__card"
          coverImageClassName="wcp-fact-card__vertical-timeline-content__item__card__cover-image"
          contentClassName="wcp-fact-card__vertical-timeline-content__item__card__content"
        >
          <div className="wcp-fact-card__vertical-timeline-content__item__card__description">
            {g.value.label}
          </div>
        </Card>
      );
    });
    return (
      <div
        ref={this.selector}
        className="wcp-fact-card__vertical-timeline-content__item"
      >
        <h2 className="wcp-fact-card__vertical-timeline-content__item__label">
          {fact.label}
          {fact.labelHelperText ? (
            <span className="wcp-fact-card__vertical-timeline-content__item__label-helper-text">
              {" "}
              {fact.labelHelperText}
            </span>
          ) : (
            ""
          )}
        </h2>
        <div className="wcp-fact-card__vertical-timeline-content__item__content">
          {fact.value.label}
        </div>
        <div className="wcp-fact-card__vertical-timeline-content__inner-cards-list">
          {innerCardsList}
        </div>
        <div className="wcp-fact-card__vertical-timeline-content__line-and-dot">
          <div className="wcp-fact-card__vertical-timeline-content__dot" />

          <div
            className="wcp-fact-card__vertical-timeline-content__line"
            style={lineStyle}
          />
        </div>
      </div>
    );
  }
}

VerticalTimelineContentSingle.propTypes = {
  fact: factPropTypes
};

VerticalTimelineContentSingle.defaultProps = {
  fact: null
};
