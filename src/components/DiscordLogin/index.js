import React, { Component } from "react";
import PropTypes from "prop-types";
import "whatwg-fetch";
import "url-search-params-polyfill";
import { printLog } from "utils/printLog";

class DiscordLogin extends Component {
  constructor(props) {
    super(props);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onButtonClick(e) {
    e.preventDefault();
    return this.getRequestToken();
  }

  generateRandomString() {
    let randomString = "";
    const randomNumber = Math.floor(Math.random() * 10);

    for (let i = 0; i < 20 + randomNumber; i++) {
      randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
    }

    return randomString;
  }
  getRequestToken() {
    const randomString = this.generateRandomString();
    localStorage.setItem("oauth-state", randomString);

    var popup = this.openPopup();

    let authenticationUrl = `https://discord.com/api/oauth2/authorize?client_id=${
      this.props.clientId
    }&redirect_uri=${encodeURIComponent(
      this.props.redirectUri
    )}&response_type=code&scope=identify%20guilds%20guilds.members.read&state=${btoa(
      randomString
    )}`;

    if (this.props.screenName) {
      authenticationUrl = `${authenticationUrl}&screen_name=${this.props.screenName}`;
    }
    popup.location = authenticationUrl;
    this.polling(popup);
  }

  openPopup() {
    const w = this.props.dialogWidth;
    const h = this.props.dialogHeight;
    const left = window.screen.width / 2 - w / 2;
    const top = window.screen.height / 2 - h / 2;

    return window.open(
      "",
      "",
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
        w +
        ", height=" +
        h +
        ", top=" +
        top +
        ", left=" +
        left
    );
  }

  polling(popup) {
    const polling = setInterval(() => {
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(polling);
        this.props.onFailure(new Error("Popup has been closed by user"));
      }

      const closeDialog = () => {
        clearInterval(polling);
        popup.close();
      };

      try {
        if (
          !popup.location.hostname.includes("discord.com") &&
          !popup.location.hostname == ""
        ) {
          printLog([popup.location.search], 'success');

          const fragment = new URLSearchParams(popup.location.search.slice(1));
          const [accessCode, state] = [
            fragment.get("code"),
            fragment.get("state"),
          ];

          if (accessCode) {
            printLog([atob(decodeURIComponent(state))], 'success');
            clearInterval(polling);
            if (
              localStorage.getItem("oauth-state") !==
              atob(decodeURIComponent(state))
            ) {
              closeDialog();
              return this.props.onFailure(
                new Error("Warning: Your request is going wrong.")
              );
            }

            if (accessCode) {
              closeDialog();
              this.props.onSuccess(accessCode);
            }
          }
        }
      } catch (error) {
        // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
        // A hack to get around same-origin security policy errors in IE.
      }
    }, 500);
  }

  getDefaultButtonContent() {
    const defaultIcon = this.props.showIcon ? <></> : null;

    return (
      <span>
        {defaultIcon} {this.props.text}
      </span>
    );
  }

  render() {
    const discordButton = React.createElement(
      this.props.tag,
      {
        onClick: this.onButtonClick,
        style: this.props.style,
        disabled: this.props.disabled,
        className: this.props.className,
      },
      this.props.children ? this.props.children : this.getDefaultButtonContent()
    );
    return discordButton;
  }
}

DiscordLogin.propTypes = {
  tag: PropTypes.string,
  text: PropTypes.string,
  clientId: PropTypes.string.isRequired,
  redirectUri: PropTypes.string.isRequired,
  onFailure: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  dialogWidth: PropTypes.number,
  dialogHeight: PropTypes.number,
  showIcon: PropTypes.bool,
  credentials: PropTypes.oneOf(["omit", "same-origin", "include"]),
  customHeaders: PropTypes.object,
  forceLogin: PropTypes.bool,
  screenName: PropTypes.string,
};

DiscordLogin.defaultProps = {
  tag: "button",
  text: "Sign in with Discord",
  disabled: false,
  dialogWidth: 480,
  dialogHeight: 790,
  showIcon: true,
  credentials: "same-origin",
  customHeaders: {},
  forceLogin: false,
  screenName: "",
};
export default DiscordLogin;
