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
      interestingArticles: props.interestingArticles.concat(
        props.interestingArticles
      ),
      cardStyles: props.interestingArticles.map(() => {
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
    const { cardStyles, interestingArticles } = this.state;

    const noOfRows = 3;
    const possibleCardSizes = [6, 5.5, 6.5, 7];

    // TODO: if there are lesser circles to show, make sure
    // they span the entire width
    // if(interestingArticles.length < 6) {
    //   noOfRows = 2;
    // }

    const interCardPadding = 0.5;

    const tempCardStyles = cardStyles.slice();

    interestingArticles.forEach((card, articleIndex) => {
      const size = possibleCardSizes[articleIndex % possibleCardSizes.length];

      let computedStyle = {};
      if (articleIndex === 0) {
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
            2 * interCardPadding,
          top: Math.random()
        };
      }

      tempCardStyles[articleIndex] = computedStyle;
    });

    const carouselWidth = Math.round(
      Math.max(
        ...tempCardStyles.map(function(style) {
          return style.left;
        })
      ) + Math.max(...possibleCardSizes.map(size => size))
    );
    this.setState({
      cardStyles: tempCardStyles,
      carouselWidth: `${carouselWidth}rem`
    });
  }

  render() {
    const {
      cardStyles,
      carouselWidth,
      interestingArticles,
      loaded
    } = this.state;
    return (
      <section
        className={`wcp-interesting-articles ${
          loaded ? "wcp-interesting-articles--loaded" : ""
        }`}
      >
        <SectionTitle>Interesting Articles</SectionTitle>
        <div className="wcp-circular-image-card-carousel-wrapper">
          <div
            style={{ width: carouselWidth }}
            className="wcp-circular-image-card-carousel"
          >
            <div className="wcp-circular-image-card-carousel-group-1">
              {interestingArticles
                .slice(0, parseInt(interestingArticles.length / 2, 10))
                .map((card, index) => (
                  <InterestingArticleItem
                    key={`${card.label}-${card.id}-group1`}
                    coverImage={card.value.image}
                    href={card.value.url || null}
                    styles={cardStyles[index]}
                  >
                    {card.value.label}
                  </InterestingArticleItem>
                ))}
            </div>
            <div className="wcp-circular-image-card-carousel-group-2">
              {interestingArticles
                .slice(
                  parseInt(interestingArticles.length / 2, 10),
                  interestingArticles.length
                )
                .map((card, index) => (
                  <InterestingArticleItem
                    key={`${card.label}-${card.id}-group2`}
                    coverImage={card.value.image}
                    href={card.value.url || null}
                    styles={cardStyles[index]}
                  >
                    {card.value.label}
                  </InterestingArticleItem>
                ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

InterestingArticles.propTypes = {
  interestingArticles: PropTypes.arrayOf(factPropTypes).isRequired
};
