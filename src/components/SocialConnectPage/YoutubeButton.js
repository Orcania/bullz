import React, { useState, useEffect } from "react";
import "./style.scss";
import { GoogleLogin, useGoogleLogout } from "react-google-login";
import { gapi } from "gapi-script";
import "./style.scss";
import { YouTube } from "@material-ui/icons";
import { YoutubeService } from "services/youtube.service";
import { useSnackbar } from "notistack";

const notificationConfig = {
  preventDuplicate: true,
  vertical: "bottom",
  horizontal: "left",
};

function YoutubeButton({
  isConncetNow,
  backendUrl,
  setIsYoutubeSelected,
  setYoutubeUrl,
  updateYoutubeInfo,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const youtubeService = new YoutubeService(backendUrl);



  const onLogoutSuccess = (res) => {
    printLog(['onLogoutSuccess', res], 'success');
  }

  const onLogoutFailure = (err) => {
    printLog(['onLogoutFailure', err]);
  }
  const { signOut, loaded } = useGoogleLogout({
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    onFailure: onLogoutFailure,
    cookiePolicy: "single_host_origin",
    onLogoutSuccess: onLogoutSuccess
  })
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const onSuccess = async (res) => {
    if (res?.accessToken) {
      printLog(["success:", res], 'success');
      const youtubeData = await youtubeService.getUserYoutubeInfo(
        res.accessToken
      );
      printLog(["youtubeData:", youtubeData], 'success');
      if (youtubeData?.items?.length > 0) {
        const channelId = youtubeData?.items[0].id;
        setYoutubeUrl(`https://www.youtube.com/channel/${channelId}`);
        setIsYoutubeSelected(true);
        updateYoutubeInfo(`https://www.youtube.com/channel/${channelId}`);
        printLog(["channelId", channelId], 'success');
      } else {
        signOut();
        showNotification("Did not get the youtube channel id");
      }
    }
  };
  const onFailure = (err) => {
    printLog(["failed:", err]);
  };

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: "https://www.googleapis.com/auth/youtube.readonly",
      });
    };
    gapi.load("client:auth2", initClient);
  });

  const showNotification = (msg, variant = "") => {
    enqueueSnackbar(msg, {
      ...notificationConfig,
      variant: variant ? variant : "error",
    });
  };

  return (
    <>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        render={(renderProps) => (
          <>
            {isConncetNow ? (
              <button
                className="connect-now"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                <span>Connect Now</span>
              </button>
            ) : (
              <button
                className="btn-continue btn-insta"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                <svg style={{ marginRight: "8px" }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M20.9966 6.00125C21.2907 6.30452 21.4997 6.68004 21.6023 7.08989C21.8762 8.60869 22.0092 10.1496 21.9995 11.6928C22.005 13.213 21.872 14.7306 21.6023 16.2267C21.4997 16.6365 21.2907 17.0121 20.9966 17.3153C20.7024 17.6186 20.3334 17.8389 19.9269 17.9539C18.4415 18.3511 12.5 18.3511 12.5 18.3511C12.5 18.3511 6.55849 18.3511 5.07311 17.9539C4.67484 17.8449 4.31141 17.635 4.01793 17.3446C3.72445 17.0541 3.51084 16.6929 3.39775 16.2958C3.12379 14.777 2.9908 13.2361 3.00049 11.6928C2.99293 10.1611 3.1259 8.63188 3.39775 7.12443C3.50033 6.71458 3.70926 6.33906 4.00342 6.0358C4.29759 5.73253 4.66658 5.51227 5.07311 5.39725C6.55849 5 12.5 5 12.5 5C12.5 5 18.4415 5 19.9269 5.36271C20.3334 5.47773 20.7024 5.69799 20.9966 6.00125ZM15.5235 11.6922L10.5578 14.5161V8.86822L15.5235 11.6922Z" fill="white"/>
                </svg>

                {/* <YouTube style={{ marginRight: "1rem" }} /> */}
                <span>Connect Youtube</span>
              </button>
            )}
          </>
        )}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
      />
    </>
  );
}

export default React.memo(YoutubeButton);
