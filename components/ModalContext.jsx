import React from "react";
import PropTypes from "prop-types";

const ModalContext = React.createContext();

export class ModalContextProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: {},
      callbacks: {},
      modalData: null
    };
  }

  registerModal(modalId, callbacks) {
    this.setState(state => {
      return {
        ...state,
        isModalOpen: {
          ...state.isModalOpen,
          [modalId]: false
        },
        callbacks: {
          ...state.callbacks,
          [modalId]: callbacks
        }
      };
    });
  }

  openModal(modalId, modalData) {
    const { isModalOpen, callbacks } = this.state;
    const nextIsModalOpen = Object.keys(isModalOpen).reduce((acc, key) => {
      return { ...acc, [key]: key === modalId };
    }, {});

    this.setState(
      state => {
        return {
          ...state,
          isModalOpen: nextIsModalOpen,
          modalData
        };
      },
      () => {
        if (callbacks[modalId] && callbacks[modalId].onOpen) {
          callbacks[modalId].onOpen();
        }
      }
    );
  }

  closeModal(modalId) {
    const { callbacks } = this.state;

    this.setState(
      state => {
        return {
          ...state,
          isModalOpen: {
            ...state.isModalOpen,
            [modalId]: false
          },
          modalData: null
        };
      },
      () => {
        if (callbacks[modalId] && callbacks[modalId].onClose) {
          callbacks[modalId].onClose();
        }
      }
    );
  }

  isModalOpen(modalId) {
    const { isModalOpen } = this.state;
    return isModalOpen[modalId];
  }

  render() {
    const { children } = this.props;
    const { modalData } = this.state;

    return (
      <ModalContext.Provider
        value={{
          registerModal: this.registerModal.bind(this),
          openModal: this.openModal.bind(this),
          closeModal: this.closeModal.bind(this),
          isModalOpen: this.isModalOpen.bind(this),
          modalData
        }}
      >
        {children}
      </ModalContext.Provider>
    );
  }
}

ModalContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const ModalContextConsumer = ModalContext.Consumer;
