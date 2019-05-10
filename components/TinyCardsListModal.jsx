import React, { Component } from "react";
import PropTypes from "prop-types";

import { FullPageModal } from "./FullPageModal";
import { factPropTypes } from "../lib/prop_types";
import { TinyCard } from "./TinyCard";
import { IconButton } from "./IconButton";

export class TinyCardsListModal extends Component {
  componentDidUpdate(prevProps) {
    const { isOpen } = this.props;

    if (!prevProps.isOpen && isOpen) {
      // Modal is opening.
      document.body.classList.add("noscroll");
    } else if (prevProps.isOpen && !isOpen) {
      // Modal is closing.
      document.body.classList.remove("noscroll");
    }
  }

  render() {
    const { isOpen, teams, onClose, title } = this.props;

    if (!isOpen) {
      return null;
    }

    return (
      <FullPageModal>
        <section className="wcp-tiny-cards-list-modal">
          <header className="wcp-tiny-cards-list-modal__header">
            <h1 className="wcp-tiny-cards-list-modal__title">{title}</h1>
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
      </FullPageModal>
    );
  }
}

TinyCardsListModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  teams: PropTypes.arrayOf(factPropTypes).isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};
