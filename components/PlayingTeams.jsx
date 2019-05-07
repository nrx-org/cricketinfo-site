import React from "react";
import PropTypes from "prop-types";

import { factPropTypes } from "../lib/prop_types";
import { LargeCardCarousel } from "./LargeCardCarousel";
import { Button } from "./Button";
import { LanguageContext } from "../language_context";
import { ModalContextConsumer } from "./ModalContext";
import { TEAMS_LIST_MODAL_ID } from "../lib/modal_ids";
import { TeamsListModalContainer } from "./TeamsListModalContainer";

const TEAMS_TO_WATCH_MESSAGE = {
  en: "Playing teams",
  hi: "आज खेलने वाली टीमें",
  ta: "TODO"
};

const SEE_ALL_MESSAGE = {
  en: "See all participating teams",
  hi: "सभी भाग लेने वाली टीमें देखें",
  ta: "TODO"
};

export const PlayingTeams = ({ teams, allTeams }) => (
  <LanguageContext.Consumer>
    {lang => (
      <section className="wcp-playing-teams">
        <h1 className="wcp-playing-teams__title">
          {TEAMS_TO_WATCH_MESSAGE[lang]}
        </h1>
        <LargeCardCarousel cards={teams} />
        <ModalContextConsumer>
          {({ openModal, closeModal, registerModal, isModalOpen }) => (
            <>
              <Button
                type="inverted"
                onClick={() => openModal(TEAMS_LIST_MODAL_ID)}
              >
                {SEE_ALL_MESSAGE[lang]}
              </Button>
              <TeamsListModalContainer
                registerModal={registerModal}
                closeModal={closeModal}
                isModalOpen={isModalOpen}
                teams={allTeams}
              />
            </>
          )}
        </ModalContextConsumer>
      </section>
    )}
  </LanguageContext.Consumer>
);

PlayingTeams.defaultProps = {
  teams: [],
  allTeams: []
};

PlayingTeams.propTypes = {
  teams: PropTypes.arrayOf(factPropTypes),
  allTeams: PropTypes.arrayOf(factPropTypes)
};
