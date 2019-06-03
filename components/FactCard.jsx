import React from "react";
import PropTypes from "prop-types";

import { StoriesContainer } from "./StoriesContainer";
import { factCardDataPropTypes } from "../lib/prop_types";
import { Timeline } from "./Timeline";
import { SectionTitle } from "./SectionTitle";
import { AvatarList } from "./AvatarList";
import { TagCard } from "./TagCard";
import { ListCard } from "./ListCard";
import { FactCardSimple } from "./FactCardSimple";
import { TinyCardCarouselWithInfo } from "./TinyCardCarouselWithInfo";
import { BarChartWithInfo } from "./BarChartWithInfo";
import { Button } from "./Button";
import { articleUiStrings } from "../lib/ui_strings";
import { getSurveyUrl } from "../lib/urls";

class SurveyButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matomoVisitorId: null
    };
  }

  componentDidMount() {
    /* eslint-disable */
    const paq = window._paq || [];
    /* eslint-enable */
    const self = this;
    let visitorId = null;
    paq.push([
      function() {
        visitorId = this.getVisitorId();
        self.setState({
          matomoVisitorId: visitorId
        });
      }
    ]);
  }

  render() {
    const { matomoVisitorId } = this.state;
    const { lang, articleId } = this.props;
    return (
      <section>
        <Button
          href={getSurveyUrl(lang, matomoVisitorId, articleId)}
          isFullWidth
          shouldOpenInNewTab
        >
          {articleUiStrings.takeSurvey[lang]}
        </Button>
      </section>
    );
  }
}

SurveyButton.propTypes = {
  lang: PropTypes.string.isRequired,
  articleId: PropTypes.string.isRequired
};

const FactCardTable = ({ cardData }) => {
  const content = cardData.facts.map(f => (
    <tr key={f.label}>
      <th>{f.label}</th>
      <td>
        {f.value.url ? (
          <a href={f.value.url}>{f.value.label}</a>
        ) : (
          f.value.label
        )}
      </td>
    </tr>
  ));
  return (
    <section>
      <SectionTitle>{cardData.title}</SectionTitle>
      <table className="wcp-fact-card-table-content">
        <tbody>{content}</tbody>
      </table>
    </section>
  );
};

FactCardTable.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};

export const FactCard = ({ cardData }) => {
  if (cardData.cardType === "table") {
    return <FactCardTable cardData={cardData} />;
  }

  if (cardData.cardType === "avatar") {
    return <AvatarList cardData={cardData} />;
  }

  if (cardData.cardType === "simple") {
    return <FactCardSimple cardData={cardData} />;
  }

  if (cardData.cardType === "vertical_timeline") {
    return <Timeline cardData={cardData} type="vertical" />;
  }

  if (cardData.cardType === "horizontal_timeline") {
    return <Timeline cardData={cardData} type="horizontal" />;
  }

  if (cardData.cardType === "stories") {
    return <StoriesContainer cardData={cardData} />;
  }

  if (cardData.cardType === "tag_card") {
    return <TagCard cardData={cardData} />;
  }

  if (cardData.cardType === "list_card") {
    return <ListCard cardData={cardData} />;
  }

  if (cardData.cardType === "tiny_card_carousel_with_info") {
    return <TinyCardCarouselWithInfo cardData={cardData} />;
  }

  if (cardData.cardType === "bar_chart_with_info") {
    return <BarChartWithInfo cardData={cardData} />;
  }

  if (cardData.cardType === "survey_link") {
    return <SurveyButton lang={cardData.lang} articleId={cardData.articleId} />;
  }

  return null;
};

FactCard.propTypes = {
  cardData: factCardDataPropTypes.isRequired
};
