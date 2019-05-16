import React from "react";
import PropTypes from "prop-types";
import { InterestingArticleItem } from "./InterestingArticleItem";
import { factPropTypes } from "../lib/prop_types";
import { SectionTitle } from "./SectionTitle";

export class InterestingArticles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      carouselWidth: "auto",
      cardStyles: props.interestingArticles.map(card => {
        return {
          width: 0,
          height: 0,
          left: 0,
          bottom: 0
        };
      })
    };

    this.computeCardStyles = this.computeCardStyles.bind(this);
  }

  componentDidMount() {
    this.computeCardStyles();
    this.setState({
      loaded: true
    });
  }

  computeCardStyles() {
    const { cardStyles } = this.state;
    const { interestingArticles } = this.props;

    const noOfRows = 3;
    const possibleCardSizesInVw = [6, 5.5, 5, 6.5];
    const interCardPaddingInVw = 0.5;

    const tempCardStyles = cardStyles.slice();

    interestingArticles.map((card, articleIndex) => {
      const rowNo = articleIndex % noOfRows;
      const size =
        possibleCardSizesInVw[articleIndex % possibleCardSizesInVw.length];

      let computedStyle = {};
      if (articleIndex == 0) {
        computedStyle = {
          width: size,
          height: size,
          left: 1 + Math.random(),
          top: Math.random()
        };
      } else if (articleIndex % noOfRows === 1) {
        const prevCardStyle = tempCardStyles[articleIndex - 1];
        computedStyle = {
          width: size,
          height: size,
          left: prevCardStyle.left + prevCardStyle.width * 0.1 + Math.random(),
          top: prevCardStyle.top + prevCardStyle.width * 1.1 + Math.random()
        };
      } else if (articleIndex % noOfRows === 2) {
        const prevCardStyle = tempCardStyles[articleIndex - 1];
        computedStyle = {
          width: size,
          height: size,
          left: prevCardStyle.left - prevCardStyle.width * 0.4 + Math.random(),
          top: prevCardStyle.top + prevCardStyle.width * 1.1 + Math.random()
        };
      } else if (articleIndex % noOfRows === 0) {
        const prevCardStyle = tempCardStyles[articleIndex - noOfRows];
        computedStyle = {
          width: size,
          height: size,
          left:
            prevCardStyle.left +
            prevCardStyle.width * 1.25 +
            2 * interCardPaddingInVw,
          top: Math.random()
        };
      }

      tempCardStyles[articleIndex] = computedStyle;
    });
    this.setState({
      cardStyles: tempCardStyles,
      carouselWidth:
        Math.round(
          Math.max.apply(
            Math,
            tempCardStyles.map(function(style) {
              return style.left;
            })
          ) + Math.max.apply(Math, possibleCardSizesInVw.map(size => size))
        ) + "rem"
    });
  }

  render() {
    const { interestingArticles } = this.props;
    const { loaded, cardStyles, carouselWidth } = this.state;
    return (
      <section className="wcp-interesting-articles">
        <SectionTitle>Interesting Articles</SectionTitle>
        <div className="wcp-circular-image-card-carousel-wrapper">
          <div
            style={{ width: carouselWidth }}
            className="wcp-circular-image-card-carousel"
          >
            {interestingArticles.map((card, index) => (
              <InterestingArticleItem
                key={`${card.label}-${card.id}`}
                coverImage={card.value.image}
                href={card.url || null}
                styles={cardStyles[index]}
              >
                {card.value.label}
              </InterestingArticleItem>
            ))}
          </div>
        </div>
      </section>
    );
  }
}

InterestingArticles.propTypes = {
  interestingArticles: PropTypes.arrayOf(factPropTypes).isRequired
};
