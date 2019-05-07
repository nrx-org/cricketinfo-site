import React from "react";
import PropTypes from "prop-types";

import { FullPageModal } from "./FullPageModal";
import { LanguageContext } from "../language_context";
import { factPropTypes } from "../lib/prop_types";
import { TinyCard } from "./TinyCard";
import { IconButton } from "./IconButton";

const TITLE_MESSAGE = {
  en: "Teams to look out for",
  hi: "दिलचस्प टीमें"
};

export const TeamsListModal = ({ teams, onClose }) => (
  <FullPageModal>
    <LanguageContext.Consumer>
      {lang => (
        <section className="wcp-teams-list-modal">
          <header className="wcp-teams-list-modal__header">
            <h1 className="wcp-teams-list-modal__title">
              {TITLE_MESSAGE[lang]}
            </h1>
            <IconButton onClick={onClose} altText="Close list" name="close" />
          </header>
          {teams.map(t => (
            <TinyCard
              title={t.label}
              href={t.value.url}
              coverImage={t.value.image}
            >
              {t.value.label}
            </TinyCard>
          ))}
        </section>
      )}
    </LanguageContext.Consumer>
  </FullPageModal>
);

TeamsListModal.propTypes = {
  teams: PropTypes.arrayOf(factPropTypes).isRequired,
  onClose: PropTypes.func.isRequired
};
