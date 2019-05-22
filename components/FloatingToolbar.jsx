import React from "react";
import { PropTypes } from "prop-types";

export class FloatingToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
    this.floatingToolbarRef = React.createRef();
    this.floatingToolbarOffsetTop = 0;
    this.state = {
      stuck: false
    };
  }

  componentDidMount() {
    const { stickToTop } = this.props;
    if (stickToTop) {
      this.floatingToolbarOffsetTop = this.floatingToolbarRef.current.offsetTop;
      window.addEventListener("scroll", this.handleScroll, true);
    }
  }

  componentWillUnmount() {
    const { stickToTop } = this.props;

    if (stickToTop) {
      window.removeEventListener("scroll", this.handleScroll, true);
    }
  }

  handleScroll() {
    if (this.floatingToolbarOffsetTop <= window.scrollY) {
      this.setState({
        stuck: true
      });
    } else {
      this.setState({
        stuck: false
      });
    }
  }

  render() {
    const { leftButton, rightButton } = this.props;
    const { stuck } = this.state;
    return (
      <div
        className={`wcp-floating-toolbar ${
          stuck ? "wcp-floating-toolbar--stick-to-top" : ""
        }`}
        ref={this.floatingToolbarRef}
      >
        <div className="wcp-floating-toolbar__button-container">
          {leftButton}
        </div>
        <div className="wcp-floating-toolbar__button-container">
          {rightButton}
        </div>
      </div>
    );
  }
}

FloatingToolbar.defaultProps = {
  stickToTop: false
};

FloatingToolbar.propTypes = {
  leftButton: PropTypes.node.isRequired,
  rightButton: PropTypes.node.isRequired,
  stickToTop: PropTypes.bool
};
