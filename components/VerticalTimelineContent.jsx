import React from "react";
import PropTypes from "prop-types";
import { factCardDataPropTypes } from "../lib/prop_types";
import { Card } from "./Card";

class VerticalTimelineContentSingle extends React.Component {
  constructor (props) {
    super(props)
    this.selector = React.createRef();
    this.state = {
      lineStyle: {
        height: 0
      }
    }
  }
  componentDidMount () {
    const rect = this.selector.current.getBoundingClientRect()
    this.setState({ lineStyle: {height: rect.height + 'px'} });
  }
  render() {
    const innerCardsList = this.props.fact.value.innerCards.map((g, gIndex) => {
      return (
        <Card
        key={`${g.label}-${gIndex}`}
        shadowSize="s"
        coverImage={g.value.image}
        imagePosition="left"
        title={g.label}
        titleClassName="wcp-fact-card__vertical-timeline-content__item__card__title"
        className="wcp-fact-card__vertical-timeline-content__item__card"
        coverImageClassName="wcp-fact-card__vertical-timeline-content__item__card__cover-image"
        contentClassName="wcp-fact-card__vertical-timeline-content__item__card__content"
        children={<div className="wcp-fact-card__vertical-timeline-content__item__card__description">{g.value.label}</div>}
        />
      )
    });
    return (
      <div key={`${this.props.fact.label}-${this.props.factIndex}`} ref={this.selector} className="wcp-fact-card__vertical-timeline-content__item">
      <h2 className="wcp-fact-card__vertical-timeline-content__item__label">
      {this.props.fact.label}
      {this.props.fact.labelHelperText ? <span className="wcp-fact-card__vertical-timeline-content__item__label-helper-text"> ({this.props.fact.labelHelperText})</span> : ''}
      </h2>
      <div className="wcp-fact-card__vertical-timeline-content__item__content">
      {this.props.fact.value.label}
      </div>
      <div className="wcp-fact-card__vertical-timeline-content__inner-cards-list">
      {innerCardsList}
      </div>
      <div className="wcp-fact-card__vertical-timeline-content__line-and-dot">
      <div className="wcp-fact-card__vertical-timeline-content__dot"></div>

      <div className="wcp-fact-card__vertical-timeline-content__line" style={this.state.lineStyle}></div>
      </div>
      </div>
    )
  }
}

VerticalTimelineContentSingle.propTypes = {
  fIndex: PropTypes.number
};

export class VerticalTimelineContent extends React.Component {
  render() {
    return (
      <div className="wcp-fact-card__vertical-timeline-content">
      {this.props.cardData.facts.map((fact, factIndex) => {
        return (
          <VerticalTimelineContentSingle fact={fact} factIndex={factIndex}></VerticalTimelineContentSingle>
        );
      })}
      </div>
    )
  };
};


VerticalTimelineContent.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};
