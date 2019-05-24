import React from "react";
import { factCardDataPropTypes } from "../lib/prop_types";
import { SectionTitle } from "./SectionTitle";
import { TinyCardCarousel } from "./TinyCardCarousel";
import { BarChart } from "./BarChart";

export const BarChartWithInfo = ({ cardData }) => {
  const tinyCardCarouselSection = cardData.facts[0];
  const barChartSection = cardData.facts[1];

  return (
    <section className="wcp-bar-chart-with-info">
      <SectionTitle>{cardData.title}</SectionTitle>

      <div className="wcp-bar-chart-with-info-content">
        <div className="wcp-bar-chart-with-info__item" key={cardData.id}>
          {tinyCardCarouselSection ? (
            <div className="wcp-bar-chart-with-info__tiny-cards-carousel-section">
              <h2 className="wcp-bar-chart-with-info__item__label">
                {tinyCardCarouselSection.label}
              </h2>
              <div className="wcp-bar-chart-with-info__item__text-content">
                <div className="wcp-bar-chart-with-info__item__description">
                  {tinyCardCarouselSection.value.label}
                </div>
              </div>
              <div className="wcp-bar-chart-with-info__tiny-cards-carousel-wrapper">
                <TinyCardCarousel cards={tinyCardCarouselSection.value.facts} />
              </div>
            </div>
          ) : null}

          {barChartSection ? (
            <div className="wcp-bar-chart-with-info__bar-chart-section">
              <h2 className="wcp-bar-chart-with-info__item__label">
                {barChartSection.label}
              </h2>
              <BarChart facts={barChartSection.value.facts} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

BarChartWithInfo.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};
