import React from "react";
import PropTypes from "prop-types";
import { TinyCardCarousel } from "./TinyCardCarousel";
import { SectionTitle } from "./SectionTitle";
import { factPropTypes } from "../lib/prop_types";

export const PopularArticles = ({ popularArticles }) => (
  <section className="wcp-popular-articles">
    <SectionTitle>{popularArticles.title}</SectionTitle>

    <div className="wcp-popular-articles__columns">
      {popularArticles.columns.map(column => (
        <div className="wcp-popular-articles__column">
          <TinyCardCarousel cards={column} />
        </div>
      ))}
    </div>
  </section>
);

PopularArticles.propTypes = {
  popularArticles: PropTypes.shape({
    columns: PropTypes.arrayOf(PropTypes.arrayOf(factPropTypes)),
    title: PropTypes.string,
    id: PropTypes.string
  }).isRequired
};
