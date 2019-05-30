import React from "react";

import { SectionTitle } from "./SectionTitle";

import { factCardDataPropTypes } from "../lib/prop_types";

import ArticleSummaryLink from "./ArticleSummaryLink";

export const AvatarList = ({ cardData }) => (
  <section className="wcp-avatar-list">
    <SectionTitle>{cardData.title}</SectionTitle>

    {cardData.label && (
      <p className="wcp-avatar-list__summary">{cardData.label}</p>
    )}

    <div className="wcp-avatar-list__item-list-wrapper">
      {cardData.facts.map(f => {
        const content = (
          <div className="wcp-avatar-list__item">
            <div
              className="wcp-avatar-list__item__profile-picture"
              style={{
                backgroundImage: `url(${
                  f.value && f.value.image ? f.value.image.url : ""
                })`
              }}
              title={f.value && f.value.image ? f.value.image.alt : ""}
            />
            <div className="wcp-avatar-list__item__info">
              <div className="wcp-avatar-list__item__info__label">
                {f.label}
              </div>
              <div className="wcp-avatar-list__item__info__value wcp-font-family-heading">
                {f.value.label}
              </div>
            </div>
          </div>
        );

        return f.value.url ? (
          <ArticleSummaryLink
            className="wcp-avatar-list__item-wrapper wcp-avatar-list__item-wrapper--active"
            href={f.value.url}
          >
            {content}
          </ArticleSummaryLink>
        ) : (
          <div className="wcp-avatar-list__item-wrapper">{content}</div>
        );
      })}
    </div>
  </section>
);

AvatarList.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};
