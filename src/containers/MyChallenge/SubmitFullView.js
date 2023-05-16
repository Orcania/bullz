import React, { useEffect, useRef, useState } from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import parse from "html-react-parser";
import "./style.scss";
const SubmitFullView = ({
  submittedTask,
  setIsOpenLightBox,
  setLookboxImage,
  getUrl,
  renderIcon,
  info,
}) => {
  const visitProfile = (social_name) => {
    switch (social_name) {
      case "Twitter":
        window.open(info.user.twitter_url, "_blank");
        break;
      case "Discord":
        window.open(info.user.discord_url, "_blank");
        break;
      case "Telegram":
        window.open(info.user.telegram_url, "_blank");
        break;
      default:
        break;
    }
  };
  switch (submittedTask.challenge_task.task_template.identifier) {
    case "twitter_follow":
    case "twitter_like":
    case "twitter_retweet":
    case "twitter_quote":
    case "twitter_bio":
    case "discord_join":
    case "telegram_join":
    case "youtube_watch_video":
    case "youtube_visit_channel":
    case "visit_website":
      return (
        <div className="inner social">
          <p className="title">
            {submittedTask.challenge_task.task_template.submit_card_title}
          </p>
          <div className="social-container">
            {renderIcon(
              submittedTask.challenge_task.task_template.social_name.toLowerCase()
            )}
            <p
              className="inner-text"
              onClick={() => {
                visitProfile(
                  submittedTask.challenge_task.task_template.social_name
                );
              }}
            >
              {
                submittedTask.challenge_task.task_template
                  .submit_card_button_text
              }
            </p>
          </div>
          <div className="links d-flex mt-2">
            {submittedTask.file_url && (
              <>
                <div
                  className="icon-container fullscreen"
                  onClick={() => {
                    setIsOpenLightBox(true);
                    setLookboxImage(submittedTask.file_url);
                  }}
                >
                  <svg
                    width="15"
                    height="14"
                    viewBox="0 0 15 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.532 0.333008H14.9987V4.77745H13.532V1.81449H10.5987V0.333008H13.532ZM1.7987 0.333008H4.73203V1.81449H1.7987V4.77745H0.332031V0.333008H1.7987ZM13.532 12.1849V9.2219H14.9987V13.6663H10.5987V12.1849H13.532ZM1.7987 12.1849H4.73203V13.6663H0.332031V9.2219H1.7987V12.1849Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </>
            )}

            {submittedTask.external_url && (
              <a
                rel="noopener noreferrer"
                href={getUrl(submittedTask.external_url)}
                target="_blank"
              >
                <div className="icon-container download ml-2">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.21982 6.4785V9.76643C9.21982 10.0571 9.10435 10.3359 8.89882 10.5414C8.69328 10.7469 8.41452 10.8624 8.12385 10.8624H2.09598C1.80531 10.8624 1.52654 10.7469 1.321 10.5414C1.11547 10.3359 1 10.0571 1 9.76643V3.73855C1 3.44788 1.11547 3.16912 1.321 2.96358C1.52654 2.75805 1.80531 2.64258 2.09598 2.64258H5.38391"
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7.5752 1H10.8631V4.28793"
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M4.83496 7.02787L10.8628 1"
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </a>
            )}
          </div>
        </div>
      );

      break;
    case "question_with_answer":
    case "question_without_answer":
      return (
        <div className="inner text">
          <p className="title"> {submittedTask.challenge_task.task_template.submit_card_title}</p>
          <div className="social-container">
            <p className="inner-text">
            {submittedTask.answer_text}
            </p>
          </div>
          <div className="links d-flex mt-2">
            {submittedTask.file_url && (
              <>
                <div
                  className="icon-container fullscreen"
                  onClick={() => {
                    setIsOpenLightBox(true);
                    setLookboxImage(submittedTask.file_url);
                  }}
                >
                  <svg
                    width="15"
                    height="14"
                    viewBox="0 0 15 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.532 0.333008H14.9987V4.77745H13.532V1.81449H10.5987V0.333008H13.532ZM1.7987 0.333008H4.73203V1.81449H1.7987V4.77745H0.332031V0.333008H1.7987ZM13.532 12.1849V9.2219H14.9987V13.6663H10.5987V12.1849H13.532ZM1.7987 12.1849H4.73203V13.6663H0.332031V9.2219H1.7987V12.1849Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </>
            )}

            {submittedTask.external_url && (
              <a
                rel="noopener noreferrer"
                href={getUrl(submittedTask.external_url)}
                target="_blank"
              >
                <div className="icon-container download ml-2">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.21982 6.4785V9.76643C9.21982 10.0571 9.10435 10.3359 8.89882 10.5414C8.69328 10.7469 8.41452 10.8624 8.12385 10.8624H2.09598C1.80531 10.8624 1.52654 10.7469 1.321 10.5414C1.11547 10.3359 1 10.0571 1 9.76643V3.73855C1 3.44788 1.11547 3.16912 1.321 2.96358C1.52654 2.75805 1.80531 2.64258 2.09598 2.64258H5.38391"
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7.5752 1H10.8631V4.28793"
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M4.83496 7.02787L10.8628 1"
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </a>
            )}
          </div>
        </div>
      );
      break;
    case "twitter_create":
    case "instagram_create_post":
    case "instagram_create_reel":
    case "tiktok_create_video":
    case "youtube_create_video":
      return (
        <div className="inner">
          <p className="title">{submittedTask.challenge_task.task_template.submit_card_title}</p>

          <img
            className="inner-img"
            src={
              submittedTask.file_url
                ? submittedTask.file_url
                : "/images/challenge_bg.png"
            }
            alt=""
          />
          <div className="links d-flex mt-2">
            {submittedTask.file_url && (
              <>
                <div
                  className="icon-container fullscreen"
                  onClick={() => {
                    setIsOpenLightBox(true);
                    setLookboxImage(submittedTask.file_url);
                  }}
                >
                  <svg
                    width="15"
                    height="14"
                    viewBox="0 0 15 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.532 0.333008H14.9987V4.77745H13.532V1.81449H10.5987V0.333008H13.532ZM1.7987 0.333008H4.73203V1.81449H1.7987V4.77745H0.332031V0.333008H1.7987ZM13.532 12.1849V9.2219H14.9987V13.6663H10.5987V12.1849H13.532ZM1.7987 12.1849H4.73203V13.6663H0.332031V9.2219H1.7987V12.1849Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </>
            )}

            {submittedTask.external_url && (
              <a
                rel="noopener noreferrer"
                href={getUrl(submittedTask.external_url)}
                target="_blank"
              >
                <div className="icon-container download ml-2">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.21982 6.4785V9.76643C9.21982 10.0571 9.10435 10.3359 8.89882 10.5414C8.69328 10.7469 8.41452 10.8624 8.12385 10.8624H2.09598C1.80531 10.8624 1.52654 10.7469 1.321 10.5414C1.11547 10.3359 1 10.0571 1 9.76643V3.73855C1 3.44788 1.11547 3.16912 1.321 2.96358C1.52654 2.75805 1.80531 2.64258 2.09598 2.64258H5.38391"
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7.5752 1H10.8631V4.28793"
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M4.83496 7.02787L10.8628 1"
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </a>
            )}
          </div>
        </div>
      );
      break;
    default:
      return <></>;
      break;
  }
};
export default React.memo(SubmitFullView);
