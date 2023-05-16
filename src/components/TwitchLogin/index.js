import React, { Component } from "react";
import PropTypes from "prop-types";
import "whatwg-fetch";
import "url-search-params-polyfill";
import { printLog } from "utils/printLog";

class TwitchLogin extends Component {
  constructor(props) {
    super(props);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onButtonClick(e) {
    e.preventDefault();
    return this.getRequestToken();
  }

  getRequestToken() {
    var popup = this.openPopup();
    let authenticationUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${
      this.props.clientId
    }&redirect_uri=${encodeURIComponent(
      this.props.redirectUri
    )}&response_type=token`;

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
          !popup.location.hostname.includes("twitch.tv") &&
          !popup.location.hostname == ""
        ) {
          if (popup.location.hash && popup.location.hash != "") {
            var parsedHash = new URLSearchParams(popup.location.hash.slice(1));
            if (parsedHash.get("access_token")) {
              var access_token = parsedHash.get("access_token");
              fetch("https://api.twitch.tv/helix/users", {
                headers: {
                  "Client-ID": this.props.clientId,
                  Authorization: "Bearer " + access_token,
                },
              })
                .then((resp) => resp.json())
                .then((resp) => {
                  closeDialog();
                  this.props.onSuccess(resp?.data[0]?.login ? resp?.data[0]?.login : resp?.data[0]?.display_name);
                })
                .catch((err) => {
                  printLog(["err", err]);
                  return this.props.onFailure(err);
                });
            }
          } else if (
            document.location.search &&
            document.location.search != ""
          ) {
            var parsedParams = new URLSearchParams(window.location.search);
            return this.props.onFailure(parsedParams);
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
    const twitchButton = React.createElement(
      this.props.tag,
      {
        onClick: this.onButtonClick,
        style: this.props.style,
        disabled: this.props.disabled,
        className: this.props.className,
      },
      this.props.children ? this.props.children : this.getDefaultButtonContent()
    );
    return twitchButton;
  }
}

TwitchLogin.propTypes = {
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

TwitchLogin.defaultProps = {
  tag: "button",
  text: "Sign in with Twitch",
  disabled: false,
  dialogWidth: 480,
  dialogHeight: 790,
  showIcon: true,
  credentials: "same-origin",
  customHeaders: {},
  forceLogin: false,
  screenName: "",
};
export default TwitchLogin;
