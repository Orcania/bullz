import React from "react";
import "./style.scss";
import CountDown from "../../components/AuctionTimmer/auctionTimmer";
import { useHistory } from "react-router-dom";
import { YouTube } from "@material-ui/icons";

const ChallengeDetails = ({
  challenge,
  showCreator,
  showSocialRequires,
  showDistribution,
  showChallengeSubmission,
}) => {
  const history = useHistory();

  const isTimePassed = (startTime) => {
    var launchDate = new Date(parseInt(startTime)).getTime();
    var currDate = new Date().getTime();
    return launchDate < currDate;
  };

  return (
    <div className="details-container">
      {showCreator && (
        <>
          <div
            className="detail-item cursor-pointer"
            onClick={() =>
              challenge?.creator?.address
                ? history.push(`/profile/${challenge.creator.address}`)
                : undefined
            }
          >
            <img
              src={
                challenge?.creator?.avatar_img
                  ? challenge?.creator?.avatar_img
                  : "/images/default-profile-cover.png"
              }
              alt=""
            />
            <div className="content">
              <p className="title">Challenge Creator</p>
              <p className="subtitle">@{challenge?.creator?.username}</p>
            </div>
          </div>
        </>
      )}
      <hr className="devider" />
      {showChallengeSubmission && !isTimePassed(challenge.expiresAt) && (
        <div className="detail-item">
          <div className="styled-icon">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 14C3.1339 14 0 10.8661 0 7C0 3.1339 3.1339 0 7 0C10.8661 0 14 3.1339 14 7C14 10.8661 10.8661 14 7 14ZM7 12.6C8.48521 12.6 9.90959 12.01 10.9598 10.9598C12.01 9.90959 12.6 8.48521 12.6 7C12.6 5.51479 12.01 4.09041 10.9598 3.0402C9.90959 1.99 8.48521 1.4 7 1.4C5.51479 1.4 4.09041 1.99 3.0402 3.0402C1.99 4.09041 1.4 5.51479 1.4 7C1.4 8.48521 1.99 9.90959 3.0402 10.9598C4.09041 12.01 5.51479 12.6 7 12.6V12.6ZM7.7 7H10.5V8.4H6.3V3.5H7.7V7Z"
                fill="white"
              />
            </svg>
          </div>
          {/* <img src="/images/default-profile-cover.png" alt="" /> */}

          <div className="content">
            <p className="title">Challenge Submission</p>
            <p className="subtitle">
              {challenge && challenge.expiresAt ? (
                <CountDown auctionETime={parseInt(challenge.expiresAt)} />
              ) : (
                "00d 00h 00m 00s "
              )}
              <span className="inner">Left</span>
            </p>
          </div>
        </div>
      )}
      {showSocialRequires && (challenge?.isTwitter || challenge?.isInstagram || challenge?.isYoutube || challenge?.isTwitch || challenge?.isTiktok) && (
        <>
          <div className="detail-item">
            <div className="content ml-0">
              <p className="title mb-2">Related Social Media</p>

              <div className="d-flex">

              
              {challenge?.isTwitter && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  {/* <img src="/images/twitter.png" alt=""  className='mr-2'/> */}
                  <div className="styled-icon mr-2">
                  <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.9388 0.00752939C15.245 0.496905 14.4768 0.8712 13.6639 1.116C13.2275 0.614297 12.6476 0.258704 12.0026 0.0973125C11.3576 -0.0640788 10.6786 -0.0234819 10.0574 0.213613C9.43623 0.450707 8.90284 0.87286 8.5294 1.42298C8.15595 1.97309 7.96047 2.62463 7.96938 3.28946V4.01395C6.69619 4.04697 5.43459 3.76459 4.29695 3.19198C3.15931 2.61937 2.18094 1.77429 1.44898 0.732018C1.44898 0.732018 -1.44898 7.25242 5.07142 10.1504C3.57936 11.1632 1.80192 11.671 0 11.5994C6.5204 15.2218 14.4898 11.5994 14.4898 3.26773C14.4891 3.06593 14.4697 2.86462 14.4318 2.6664C15.1712 1.9372 15.693 1.01653 15.9388 0.00752939Z" fill="white"/>
                  </svg>

                  </div>
                  {/* <p className="subtitle">Twitter Required</p> */}
                </div>
              )}
              {challenge?.isInstagram && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <div className="styled-icon mr-2">
                    {/* <img src="/images/insta-inner.png" alt="" /> */}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M10.2525 0.000244141H3.4175C1.53007 0.000244141 0 1.53031 0 3.41774V10.2527C0 12.1402 1.53007 13.6702 3.4175 13.6702H10.2525C12.1399 13.6702 13.67 12.1402 13.67 10.2527V3.41774C13.67 1.53031 12.1399 0.000244141 10.2525 0.000244141ZM7.20498 4.49499C6.71937 4.42298 6.22341 4.50593 5.78765 4.73203C5.3519 4.95814 4.99853 5.31589 4.77781 5.7544C4.5571 6.19291 4.48027 6.68986 4.55827 7.17455C4.63626 7.65924 4.8651 8.107 5.21224 8.45413C5.55937 8.80127 6.00713 9.03011 6.49182 9.1081C6.97651 9.1861 7.47346 9.10927 7.91197 8.88856C8.35048 8.66784 8.70823 8.31447 8.93434 7.87872C9.16044 7.44296 9.24339 6.947 9.17138 6.46139C9.09793 5.96604 8.86711 5.50745 8.51301 5.15336C8.15892 4.79927 7.70033 4.56845 7.20498 4.49499ZM5.4192 4.02193C6.00431 3.71833 6.67027 3.60695 7.32233 3.70364C7.98746 3.80228 8.60324 4.11221 9.0787 4.58767C9.55416 5.06313 9.8641 5.67891 9.96273 6.34404C10.0594 6.99611 9.94804 7.66206 9.64444 8.24717C9.34083 8.83229 8.86046 9.30678 8.27164 9.60314C7.68282 9.89951 7.01555 10.0027 6.36473 9.89794C5.7139 9.79322 5.11267 9.48594 4.64655 9.01982C4.18043 8.5537 3.87315 7.95247 3.76843 7.30164C3.6637 6.65082 3.76686 5.98355 4.06323 5.39473C4.35959 4.80591 4.83408 4.32554 5.4192 4.02193ZM10.5899 2.57057C10.3138 2.57057 10.0899 2.79443 10.0899 3.07057C10.0899 3.34671 10.3138 3.57057 10.5899 3.57057H10.596C10.8721 3.57057 11.096 3.34671 11.096 3.07057C11.096 2.79443 10.8721 2.57057 10.596 2.57057H10.5899Z" fill="white"/>
                    </svg>

                  </div>
                  {/* <p className="subtitle">Instagram Required</p> */}
                </div>
              )}
              {challenge?.isYoutube && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <div className="styled-icon mr-2">
                    {/* <YouTube/> */}
                    <svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M17.9966 1.0015C18.2907 1.30476 18.4997 1.68028 18.6023 2.09014C18.8762 3.60893 19.0092 5.1498 18.9995 6.69308C19.005 8.21329 18.872 9.73084 18.6023 11.2269C18.4997 11.6368 18.2907 12.0123 17.9966 12.3156C17.7024 12.6188 17.3334 12.8391 16.9269 12.9541C15.4415 13.3514 9.5 13.3514 9.5 13.3514C9.5 13.3514 3.55849 13.3514 2.07311 12.9541C1.67484 12.8451 1.31141 12.6353 1.01793 12.3448C0.724448 12.0544 0.510841 11.6931 0.397746 11.296C0.123787 9.77722 -0.00919644 8.23635 0.000493667 6.69308C-0.00707491 5.16133 0.1259 3.63213 0.397746 2.12468C0.500331 1.71483 0.709257 1.3393 1.00342 1.03604C1.29759 0.732777 1.66658 0.512513 2.07311 0.397496C3.55849 0.000244141 9.5 0.000244141 9.5 0.000244141C9.5 0.000244141 15.4415 0.000244141 16.9269 0.362953C17.3334 0.47797 17.7024 0.698234 17.9966 1.0015ZM12.5235 6.69241L7.55781 9.51635V3.86846L12.5235 6.69241Z" fill="white"/>
                    </svg>
                  </div>
                  {/* <p className="subtitle">YouTube Required</p> */}
                </div>
              )}
              {challenge?.isTwitch && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <div className="styled-icon mr-2">
                    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.79922 0.200195L0.199219 3.4002V16.2002H4.19922V18.6002H7.39922L9.79922 16.2002H12.9992L17.7992 11.4002V0.200195H1.79922ZM3.39922 1.8002H16.1992V10.6002L13.7992 13.0002H8.99922L6.59922 15.4002V13.0002H3.39922V1.8002ZM7.39922 4.2002V9.8002H8.99922V4.2002H7.39922ZM10.5992 4.2002V9.8002H12.1992V4.2002H10.5992Z" fill="white"/>
                    </svg>

                  </div>
                </div>
              )}
              {challenge?.isTiktok && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <div className="styled-icon mr-2">
                    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.84918 1.17129C8.95906 1.06162 9.10797 1.00002 9.26322 1H11.6169C11.7618 1.00008 11.9016 1.05383 12.0092 1.15086C12.1168 1.2479 12.1846 1.38135 12.1997 1.52547C12.3914 3.35173 13.8607 4.78758 15.7039 4.91982C15.8517 4.93054 15.99 4.99684 16.0908 5.10538C16.1917 5.21391 16.2478 5.35663 16.2477 5.50482V8.24205C16.2477 8.38822 16.1931 8.52913 16.0947 8.63714C15.9962 8.74515 15.8609 8.81247 15.7154 8.82591C15.5697 8.83932 15.4175 8.8488 15.2574 8.8488C14.084 8.8488 13.0213 8.41683 12.1687 7.7349V13.0388C12.1687 16.1158 9.66125 18.6232 6.58437 18.6232C3.50741 18.6232 1 16.1158 1 13.0388C1 9.96183 3.50741 7.45443 6.58437 7.45443C6.69166 7.45443 6.78444 7.46119 6.86312 7.46693C6.88671 7.46865 6.90903 7.47027 6.9301 7.4716C7.07892 7.48093 7.21859 7.54662 7.32067 7.6553C7.42276 7.76399 7.4796 7.90749 7.47961 8.05659V10.5191C7.47971 10.602 7.4622 10.684 7.42826 10.7597C7.39432 10.8353 7.34472 10.9029 7.28272 10.958C7.22072 11.0131 7.14774 11.0544 7.0686 11.0792C6.98947 11.1039 6.90597 11.1117 6.82364 11.1018C6.78033 11.0966 6.74312 11.0918 6.71142 11.0876C6.64969 11.0796 6.60882 11.0743 6.58437 11.0743C5.49193 11.0743 4.61988 11.9464 4.61988 13.0388C4.61988 14.1312 5.49193 15.0044 6.58437 15.0044C7.68559 15.0044 8.65189 14.1349 8.65189 13.0709C8.65189 13.014 8.65302 12.3311 8.65533 11.2518C8.65643 10.7338 8.65787 10.1344 8.65941 9.49266C8.66108 8.79699 8.66287 8.05167 8.66449 7.30675C8.67064 4.44256 8.67708 1.585 8.67708 1.585C8.6774 1.42975 8.73929 1.28096 8.84918 1.17129ZM4.8688 9.01728C5.30167 8.8806 5.78024 8.79324 6.30733 8.76929V8.68281C5.79993 8.71579 5.31562 8.83164 4.8688 9.01728Z" fill="white"/>
                    </svg>

                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
          <hr className="devider" />
        </>
      )}

      {showDistribution && (
        <div className="detail-item">
          <div className="styled-icon">
            {/* <img src="/images/calender-icon.png" alt="" /> */}
            <svg
              width="14"
              height="16"
              viewBox="0 0 14 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.8736 2.41016H2.3592C1.60853 2.41016 1 3.04749 1 3.83367V13.7983C1 14.5845 1.60853 15.2218 2.3592 15.2218H11.8736C12.6242 15.2218 13.2328 14.5845 13.2328 13.7983V3.83367C13.2328 3.04749 12.6242 2.41016 11.8736 2.41016Z"
                stroke="white"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.83594 1V3.84703"
                stroke="white"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.40137 1V3.84703"
                stroke="white"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1 6.69922H13.2328"
                stroke="white"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.07617 10.276L6.43537 11.6995L9.00887 9.29688"
                stroke="white"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <div className="content">
            <p className="title">Airdrop Distribution</p>
            <p className="subtitle">
              {new Date(parseInt(challenge?.airdropStartAt)).toDateString()}{" "}
              <span className="inner">to</span>{" "}
              {new Date(parseInt(challenge?.airdropEndAt)).toDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeDetails;
