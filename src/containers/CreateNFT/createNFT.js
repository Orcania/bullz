import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { FormGroup, useMediaQuery } from "@material-ui/core";
import { Dialog, IconButton, DialogContent, FormControlLabel, Checkbox } from '@material-ui/core';
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from '@material-ui/icons/Close';

import React, { useEffect, useRef, useState } from "react";

import Dropzone from "react-dropzone";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import "react-datepicker/dist/react-datepicker.css";

import Loader from "../../components/Loader/loader";
import Calender from "../../components/Common/Calender/Calender";

import PreviewNFT from "./previewNFT";
import "./style.scss";
import moment from "moment";
import { scrollToTop } from 'common/utils';
import CustomTooltip from "components/Common/Tooltip/CustomTooltip";
import { Spinner } from "react-bootstrap";
import CustomLoader from "components/CustomLoader/CustomLoader";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import { createTasks } from './../../data/createTasks';
import CustomAccordion from "components/CustomAccordion";
import TaskBody from "./taskBody";
import CustomAlert from "components/CustomAlert";


export const renderIcon = (name) => {
  switch (name.toLowerCase()){
    case 'twitter':
      return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.9388 6.00729C19.245 6.49666 18.4768 6.87096 17.6639 7.11575C17.2275 6.61405 16.6476 6.25846 16.0026 6.09707C15.3576 5.93568 14.6786 5.97627 14.0574 6.21337C13.4362 6.45046 12.9028 6.87262 12.5294 7.42273C12.156 7.97285 11.9605 8.62438 11.9694 9.28922V10.0137C10.6962 10.0467 9.43459 9.76435 8.29695 9.19174C7.15931 8.61913 6.18094 7.77405 5.44898 6.73177C5.44898 6.73177 2.55102 13.2522 9.07142 16.1501C7.57936 17.1629 5.80192 17.6708 4 17.5991C10.5204 21.2216 18.4898 17.5991 18.4898 9.26749C18.4891 9.06568 18.4697 8.86438 18.4318 8.66616C19.1712 7.93696 19.693 7.01629 19.9388 6.00729V6.00729Z" fill="white"/>
      </svg>        
    case 'instagram':
      return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.2525 5H8.4175C6.53007 5 5 6.53007 5 8.4175V15.2525C5 17.1399 6.53007 18.67 8.4175 18.67H15.2525C17.1399 18.67 18.67 17.1399 18.67 15.2525V8.4175C18.67 6.53007 17.1399 5 15.2525 5ZM12.205 9.49475C11.7194 9.42274 11.2234 9.50568 10.7877 9.73179C10.3519 9.9579 9.99853 10.3156 9.77781 10.7542C9.5571 11.1927 9.48027 11.6896 9.55827 12.1743C9.63626 12.659 9.8651 13.1068 10.2122 13.4539C10.5594 13.801 11.0071 14.0299 11.4918 14.1079C11.9765 14.1859 12.4735 14.109 12.912 13.8883C13.3505 13.6676 13.7082 13.3142 13.9343 12.8785C14.1604 12.4427 14.2434 11.9468 14.1714 11.4611C14.0979 10.9658 13.8671 10.5072 13.513 10.1531C13.1589 9.79902 12.7003 9.5682 12.205 9.49475ZM10.4192 9.02169C11.0043 8.71809 11.6703 8.60671 12.3223 8.7034C12.9875 8.80203 13.6032 9.11197 14.0787 9.58743C14.5542 10.0629 14.8641 10.6787 14.9627 11.3438C15.0594 11.9959 14.948 12.6618 14.6444 13.2469C14.3408 13.832 13.8605 14.3065 13.2716 14.6029C12.6828 14.8993 12.0155 15.0024 11.3647 14.8977C10.7139 14.793 10.1127 14.4857 9.64655 14.0196C9.18043 13.5535 8.87315 12.9522 8.76843 12.3014C8.6637 11.6506 8.76686 10.9833 9.06323 10.3945C9.35959 9.80567 9.83408 9.3253 10.4192 9.02169ZM15.5899 7.57033C15.3138 7.57033 15.0899 7.79418 15.0899 8.07033C15.0899 8.34647 15.3138 8.57033 15.5899 8.57033H15.596C15.8721 8.57033 16.096 8.34647 16.096 8.07033C16.096 7.79418 15.8721 7.57033 15.596 7.57033H15.5899Z" fill="white"/>
      </svg>        
    case 'tiktok':
      return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.8492 3.17129C11.9591 3.06162 12.108 3.00002 12.2632 3H14.6169C14.7618 3.00008 14.9016 3.05383 15.0092 3.15086C15.1168 3.2479 15.1846 3.38135 15.1997 3.52547C15.3914 5.35173 16.8607 6.78758 18.7039 6.91982C18.8517 6.93054 18.99 6.99684 19.0908 7.10538C19.1917 7.21391 19.2478 7.35663 19.2477 7.50482V10.2421C19.2477 10.3882 19.1931 10.5291 19.0947 10.6371C18.9962 10.7452 18.8609 10.8125 18.7154 10.8259C18.5697 10.8393 18.4175 10.8488 18.2574 10.8488C17.084 10.8488 16.0213 10.4168 15.1687 9.7349V15.0388C15.1687 18.1158 12.6613 20.6232 9.58437 20.6232C6.50741 20.6232 4 18.1158 4 15.0388C4 11.9618 6.50741 9.45443 9.58437 9.45443C9.69166 9.45443 9.78444 9.46119 9.86312 9.46693C9.88671 9.46865 9.90903 9.47027 9.9301 9.4716C10.0789 9.48093 10.2186 9.54662 10.3207 9.6553C10.4228 9.76399 10.4796 9.90749 10.4796 10.0566V12.5191C10.4797 12.602 10.4622 12.684 10.4283 12.7597C10.3943 12.8353 10.3447 12.9029 10.2827 12.958C10.2207 13.0131 10.1477 13.0544 10.0686 13.0792C9.98947 13.1039 9.90597 13.1117 9.82364 13.1018C9.78033 13.0966 9.74312 13.0918 9.71142 13.0876C9.64969 13.0796 9.60882 13.0743 9.58437 13.0743C8.49193 13.0743 7.61988 13.9464 7.61988 15.0388C7.61988 16.1312 8.49193 17.0044 9.58437 17.0044C10.6856 17.0044 11.6519 16.1349 11.6519 15.0709C11.6519 15.014 11.653 14.3311 11.6553 13.2518C11.6564 12.7338 11.6579 12.1344 11.6594 11.4927C11.6611 10.797 11.6629 10.0517 11.6645 9.30675C11.6706 6.44256 11.6771 3.585 11.6771 3.585C11.6774 3.42975 11.7393 3.28096 11.8492 3.17129ZM7.8688 11.0173C8.30167 10.8806 8.78024 10.7932 9.30733 10.7693V10.6828C8.79993 10.7158 8.31562 10.8316 7.8688 11.0173Z" fill="white"/>
      <path d="M12.2632 3V2.85H12.2632L12.2632 3ZM11.8492 3.17129L11.9551 3.27746L11.9551 3.27746L11.8492 3.17129ZM14.6169 3L14.617 2.85H14.6169V3ZM15.0092 3.15086L14.9087 3.26226L15.0092 3.15086ZM15.1997 3.52547L15.0505 3.54101L15.0505 3.54113L15.1997 3.52547ZM18.7039 6.91982L18.7148 6.77022L18.7146 6.77021L18.7039 6.91982ZM19.0908 7.10538L18.981 7.2075H18.981L19.0908 7.10538ZM19.2477 7.50482L19.0977 7.50473V7.50482H19.2477ZM19.2477 10.2421H19.0977V10.2421L19.2477 10.2421ZM18.7154 10.8259L18.7291 10.9753L18.7291 10.9753L18.7154 10.8259ZM15.1687 9.7349L15.2624 9.61776L15.0187 9.42286V9.7349H15.1687ZM9.58437 20.6232V20.4732V20.6232ZM9.86312 9.46693L9.85221 9.61653L9.85222 9.61653L9.86312 9.46693ZM9.9301 9.4716L9.92069 9.6213L9.92071 9.6213L9.9301 9.4716ZM10.3207 9.6553L10.2113 9.758L10.3207 9.6553ZM10.4796 10.0566H10.6296V10.0566L10.4796 10.0566ZM10.4796 12.5191H10.3296V12.5192L10.4796 12.5191ZM10.2827 12.958L10.1831 12.8459L10.1831 12.8459L10.2827 12.958ZM10.0686 13.0792L10.1134 13.2223H10.1134L10.0686 13.0792ZM9.82364 13.1018L9.80577 13.2507L9.80578 13.2507L9.82364 13.1018ZM9.71142 13.0876L9.73075 12.9389H9.73075L9.71142 13.0876ZM11.6553 13.2518L11.5053 13.2514V13.2514L11.6553 13.2518ZM11.6594 11.4927L11.5094 11.4923L11.6594 11.4927ZM11.6645 9.30675L11.8145 9.30707V9.30707L11.6645 9.30675ZM11.6771 3.585L11.8271 3.58533V3.5853L11.6771 3.585ZM9.30733 10.7693L9.31414 10.9191L9.45733 10.9126V10.7693H9.30733ZM7.8688 11.0173L7.81125 10.8788L7.91396 11.1603L7.8688 11.0173ZM9.30733 10.6828H9.45733V10.5227L9.29759 10.5331L9.30733 10.6828ZM12.2632 2.85C12.0682 2.85002 11.8812 2.92738 11.7432 3.06512L11.9551 3.27746C12.0369 3.19585 12.1477 3.15001 12.2632 3.15L12.2632 2.85ZM14.6169 2.85H12.2632V3.15H14.6169V2.85ZM15.1096 3.03947C14.9745 2.9176 14.799 2.85011 14.617 2.85L14.6169 3.15C14.7247 3.15006 14.8287 3.19005 14.9087 3.26226L15.1096 3.03947ZM15.3488 3.50993C15.33 3.32893 15.2448 3.16133 15.1096 3.03947L14.9087 3.26226C14.9888 3.33447 15.0393 3.43377 15.0505 3.54101L15.3488 3.50993ZM18.7146 6.77021C16.9444 6.6432 15.533 5.26425 15.3488 3.50981L15.0505 3.54113C15.2497 5.4392 16.777 6.93196 18.6932 7.06944L18.7146 6.77021ZM19.2007 7.00325C19.074 6.86694 18.9004 6.78368 18.7148 6.77022L18.693 7.06943C18.803 7.07741 18.9059 7.12674 18.981 7.2075L19.2007 7.00325ZM19.3977 7.5049C19.3978 7.3188 19.3274 7.13956 19.2007 7.00325L18.981 7.2075C19.056 7.28827 19.0977 7.39447 19.0977 7.50473L19.3977 7.5049ZM19.3977 10.2421V7.50482H19.0977V10.2421H19.3977ZM19.2055 10.7382C19.3292 10.6026 19.3977 10.4256 19.3977 10.242L19.0977 10.2421C19.0977 10.3509 19.0571 10.4557 18.9838 10.5361L19.2055 10.7382ZM18.7291 10.9753C18.9119 10.9584 19.0818 10.8739 19.2055 10.7382L18.9838 10.5361C18.9105 10.6165 18.8099 10.6665 18.7016 10.6765L18.7291 10.9753ZM18.2574 10.9988C18.4234 10.9988 18.5804 10.989 18.7291 10.9753L18.7016 10.6765C18.559 10.6897 18.4116 10.6988 18.2574 10.6988V10.9988ZM15.075 9.85205C15.951 10.5526 17.046 10.9988 18.2574 10.9988V10.6988C17.122 10.6988 16.0917 10.281 15.2624 9.61776L15.075 9.85205ZM15.3187 15.0388V9.7349H15.0187V15.0388H15.3187ZM9.58437 20.7732C12.7441 20.7732 15.3187 18.1986 15.3187 15.0388H15.0187C15.0187 18.0329 12.5784 20.4732 9.58437 20.4732V20.7732ZM3.85 15.0388C3.85 18.1986 6.42456 20.7732 9.58437 20.7732V20.4732C6.59025 20.4732 4.15 18.0329 4.15 15.0388H3.85ZM9.58437 9.30443C6.42456 9.30443 3.85 11.879 3.85 15.0388H4.15C4.15 12.0447 6.59025 9.60443 9.58437 9.60443V9.30443ZM9.87403 9.31732C9.79544 9.31159 9.69773 9.30443 9.58437 9.30443V9.60443C9.68559 9.60443 9.77343 9.61079 9.85221 9.61653L9.87403 9.31732ZM9.93952 9.32189C9.91933 9.32062 9.89778 9.31905 9.87402 9.31732L9.85222 9.61653C9.87564 9.61824 9.89874 9.61992 9.92069 9.6213L9.93952 9.32189ZM10.43 9.55261C10.3018 9.41612 10.1264 9.33361 9.93949 9.32189L9.92071 9.6213C10.0314 9.62825 10.1354 9.67713 10.2113 9.758L10.43 9.55261ZM10.6296 10.0566C10.6296 9.86932 10.5582 9.6891 10.43 9.55261L10.2113 9.758C10.2873 9.83887 10.3296 9.94565 10.3296 10.0566L10.6296 10.0566ZM10.6296 12.5191V10.0566H10.3296V12.5191H10.6296ZM10.5651 12.8211C10.6078 12.726 10.6297 12.623 10.6296 12.5189L10.3296 12.5192C10.3297 12.581 10.3167 12.642 10.2914 12.6983L10.5651 12.8211ZM10.3823 13.0702C10.4602 13.001 10.5225 12.9161 10.5651 12.8211L10.2914 12.6983C10.2661 12.7546 10.2292 12.8049 10.1831 12.8459L10.3823 13.0702ZM10.1134 13.2223C10.2128 13.1912 10.3045 13.1393 10.3823 13.0702L10.1831 12.8459C10.137 12.8868 10.0827 12.9176 10.0238 12.936L10.1134 13.2223ZM9.80578 13.2507C9.90919 13.2631 10.014 13.2534 10.1134 13.2223L10.0238 12.936C9.96489 12.9545 9.90276 12.9602 9.84149 12.9528L9.80578 13.2507ZM9.6921 13.2364C9.72379 13.2405 9.76165 13.2454 9.80577 13.2507L9.8415 12.9529C9.799 12.9478 9.76245 12.943 9.73075 12.9389L9.6921 13.2364ZM9.58437 13.2243C9.59643 13.2243 9.6244 13.2276 9.6921 13.2364L9.73075 12.9389C9.67497 12.9316 9.62122 12.9243 9.58437 12.9243V13.2243ZM7.76988 15.0388C7.76988 14.0292 8.57477 13.2243 9.58437 13.2243V12.9243C8.40908 12.9243 7.46988 13.8635 7.46988 15.0388H7.76988ZM9.58437 16.8544C8.57488 16.8544 7.76988 16.0485 7.76988 15.0388H7.46988C7.46988 16.214 8.40897 17.1544 9.58437 17.1544V16.8544ZM11.5019 15.0709C11.5019 16.0411 10.6141 16.8544 9.58437 16.8544V17.1544C10.757 17.1544 11.8019 16.2286 11.8019 15.0709H11.5019ZM11.5053 13.2514C11.503 14.3307 11.5019 15.0138 11.5019 15.0709H11.8019C11.8019 15.0143 11.803 14.3315 11.8053 13.2521L11.5053 13.2514ZM11.5094 11.4923C11.5079 12.134 11.5064 12.7335 11.5053 13.2514L11.8053 13.2521C11.8064 12.7342 11.8079 12.1347 11.8094 11.493L11.5094 11.4923ZM11.5145 9.30642C11.5129 10.0513 11.5111 10.7966 11.5094 11.4923L11.8094 11.493C11.8111 10.7974 11.8129 10.052 11.8145 9.30707L11.5145 9.30642ZM11.6771 3.585C11.5271 3.58466 11.5271 3.58467 11.5271 3.58469C11.5271 3.58471 11.5271 3.58475 11.5271 3.58479C11.5271 3.58488 11.5271 3.58501 11.5271 3.58518C11.5271 3.58553 11.5271 3.58605 11.5271 3.58674C11.5271 3.58813 11.5271 3.5902 11.5271 3.59294C11.527 3.59844 11.527 3.60664 11.527 3.61745C11.527 3.63908 11.5269 3.67117 11.5268 3.71304C11.5266 3.79677 11.5263 3.91958 11.526 4.07591C11.5253 4.38856 11.5243 4.83526 11.5231 5.37147C11.5207 6.44389 11.5176 7.87433 11.5145 9.30642L11.8145 9.30707C11.8176 7.87498 11.8207 6.44455 11.8231 5.37214C11.8243 4.83593 11.8253 4.38923 11.826 4.07658C11.8263 3.92026 11.8266 3.79744 11.8268 3.71371C11.8269 3.67185 11.827 3.63975 11.827 3.61813C11.827 3.60731 11.827 3.59911 11.8271 3.59362C11.8271 3.59087 11.8271 3.5888 11.8271 3.58742C11.8271 3.58672 11.8271 3.5862 11.8271 3.58586C11.8271 3.58568 11.8271 3.58555 11.8271 3.58547C11.8271 3.58542 11.8271 3.58539 11.8271 3.58537C11.8271 3.58535 11.8271 3.58533 11.6771 3.585ZM11.7432 3.06512C11.6052 3.20285 11.5275 3.38971 11.5271 3.58469L11.8271 3.5853C11.8273 3.46978 11.8734 3.35907 11.9551 3.27746L11.7432 3.06512ZM9.30052 10.6194C8.7609 10.644 8.2694 10.7335 7.82363 10.8742L7.91396 11.1603C8.33393 11.0277 8.79957 10.9425 9.31414 10.9191L9.30052 10.6194ZM9.15733 10.6828V10.7693H9.45733V10.6828H9.15733ZM7.92634 11.1558C8.35808 10.9764 8.82625 10.8644 9.31706 10.8325L9.29759 10.5331C8.77361 10.5672 8.27316 10.6869 7.81125 10.8788L7.92634 11.1558Z" fill="white"/>
      </svg>        
    case 'discord':
      return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.0947 6.17273C17.8649 5.62451 16.5497 5.22677 15.1745 5C15.0053 5.29036 14.8086 5.68174 14.672 5.99258C13.2107 5.78347 11.7627 5.78347 10.3281 5.99258C10.1922 5.68174 9.99037 5.29036 9.82041 5C8.44366 5.22677 7.12704 5.62593 5.89725 6.17556C3.41688 9.74391 2.74447 13.2232 3.08068 16.6538C4.72609 17.8237 6.32029 18.5337 7.88851 18.9986C8.27593 18.4913 8.62104 17.9523 8.91792 17.3843C8.35163 17.1794 7.8091 16.9265 7.29625 16.6333C7.43207 16.5373 7.56492 16.4369 7.69406 16.3338C10.8201 17.7255 14.2171 17.7255 17.306 16.3338C17.4359 16.4369 17.5688 16.5373 17.7038 16.6333C17.1895 16.9279 16.6455 17.1809 16.0792 17.3857C16.3768 17.9523 16.7204 18.4928 17.1086 19C18.6776 18.5351 20.274 17.8244 21.9194 16.6538C22.3135 12.6771 21.2448 9.2296 19.0947 6.17273ZM9.34318 14.5436C8.40507 14.5436 7.63543 13.71 7.63543 12.6941C7.63543 11.6782 8.38874 10.8432 9.34318 10.8432C10.2984 10.8432 11.068 11.6768 11.0509 12.6941C11.0532 13.71 10.2984 14.5436 9.34318 14.5436ZM15.6562 14.5436C14.718 14.5436 13.9484 13.71 13.9484 12.6941C13.9484 11.6782 14.7017 10.8432 15.6562 10.8432C16.6113 10.8432 17.381 11.6768 17.3639 12.6941C17.3639 13.71 16.6106 14.5436 15.6562 14.5436Z" fill="white"/>
      </svg>
    case 'telegram':
      return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.20388 13.207L4.57032 12.0274C3.78485 11.7776 3.78048 11.2143 4.74633 10.81L18.9038 5.1167C19.7257 4.76843 20.1911 5.20906 19.9249 6.3129L17.5147 18.1538C17.346 18.9972 16.8587 19.1986 16.1823 18.8095L12.4716 15.9507L10.7421 17.689C10.5647 17.8676 10.4207 18.0206 10.1472 18.0584C9.8752 18.0978 9.65119 18.013 9.48682 17.5436L8.22133 13.1964L8.20388 13.207Z" fill="white"/>
      </svg>
    case 'youtube': 
      return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M20.9966 6.00125C21.2907 6.30452 21.4997 6.68004 21.6023 7.08989C21.8762 8.60869 22.0092 10.1496 21.9995 11.6928C22.005 13.213 21.872 14.7306 21.6023 16.2267C21.4997 16.6365 21.2907 17.0121 20.9966 17.3153C20.7024 17.6186 20.3334 17.8389 19.9269 17.9539C18.4415 18.3511 12.5 18.3511 12.5 18.3511C12.5 18.3511 6.55849 18.3511 5.07311 17.9539C4.67484 17.8449 4.31141 17.635 4.01793 17.3446C3.72445 17.0541 3.51084 16.6929 3.39775 16.2958C3.12379 14.777 2.9908 13.2361 3.00049 11.6928C2.99293 10.1611 3.1259 8.63188 3.39775 7.12443C3.50033 6.71458 3.70926 6.33906 4.00342 6.0358C4.29759 5.73253 4.66658 5.51227 5.07311 5.39725C6.55849 5 12.5 5 12.5 5C12.5 5 18.4415 5 19.9269 5.36271C20.3334 5.47773 20.7024 5.69799 20.9966 6.00125ZM15.5235 11.6922L10.5578 14.5161V8.86822L15.5235 11.6922Z" fill="white"/>
      </svg>
    case 'visit website':
      return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.5002 13.3324V18.3325C17.5002 18.7746 17.3246 19.1985 17.012 19.511C16.6995 19.8236 16.2755 19.9992 15.8335 19.9992H6.66669C6.22466 19.9992 5.80073 19.8236 5.48816 19.511C5.1756 19.1985 5 18.7746 5 18.3325V9.16571C5 8.72368 5.1756 8.29975 5.48816 7.98719C5.80073 7.67462 6.22466 7.49902 6.66669 7.49902H11.6668" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 5H20.0001V10.0001" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10.832 14.1668L19.9988 5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    case 'question & answer':
      return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9707 21 21 16.9707 21 12C21 7.0293 16.9707 3 12 3C7.0293 3 3 7.0293 3 12C3 16.9707 7.0293 21 12 21ZM11.0226 13.1484C10.947 13.6524 11.3754 14.0682 11.8848 14.0682H12.3078C12.428 14.0682 12.5436 14.0224 12.6313 13.9402C12.7189 13.8579 12.7718 13.7453 12.7794 13.6254C12.8307 13.152 13.0341 12.738 13.3878 12.3843L13.9548 11.8263C14.3976 11.3808 14.7072 10.9767 14.8845 10.614C15.0618 10.2459 15.15 9.8562 15.15 9.4449C15.15 8.5404 14.8773 7.8411 14.3319 7.3479C13.7865 6.8493 13.0197 6.6 12.0315 6.6C11.0523 6.6 10.2792 6.861 9.7095 7.3839C9.37228 7.69669 9.12572 8.09468 8.9958 8.5359C8.8302 9.0795 9.3198 9.5538 9.8868 9.5538C10.3674 9.5538 10.7265 9.1623 11.0604 8.7978C11.1072 8.7465 11.1531 8.6952 11.199 8.6466C11.4096 8.4243 11.6868 8.3136 12.0315 8.3136C12.7587 8.3136 13.1223 8.7222 13.1223 9.5394C13.1223 9.8103 13.0521 10.0695 12.9126 10.3161C12.7731 10.5582 12.4905 10.875 12.0666 11.2665C11.6472 11.6535 11.3583 12.0486 11.199 12.45C11.1207 12.6489 11.0622 12.882 11.0226 13.1484ZM11.0739 15.4983C10.8642 15.7062 10.7589 15.9726 10.7589 16.2966C10.7589 16.6161 10.8615 16.8798 11.0667 17.0886C11.2764 17.2956 11.5518 17.4 11.892 17.4C12.2322 17.4 12.504 17.2956 12.7101 17.0877C12.9198 16.8798 13.0251 16.6161 13.0251 16.2966C13.0251 15.9726 12.9171 15.7062 12.7029 15.4983C12.4932 15.285 12.2223 15.1788 11.892 15.1788C11.5608 15.1788 11.289 15.285 11.0739 15.4983Z" fill="white"/>
      </svg>
    case 'expand':
      return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M18.4762 10.4762H13.5238V5.52381C13.5238 4.68571 12.8381 4 12 4C11.1619 4 10.4762 4.68571 10.4762 5.52381V10.4762H5.52381C4.68571 10.4762 4 11.1619 4 12C4 12.8381 4.68571 13.5238 5.52381 13.5238H10.4762V18.4762C10.4762 19.3143 11.1619 20 12 20C12.8381 20 13.5238 19.3143 13.5238 18.4762V13.5238H18.4762C19.3143 13.5238 20 12.8381 20 12C20 11.1619 19.3143 10.4762 18.4762 10.4762Z" fill="white"/>
      </svg>
    case 'collapse':
      return         
  }
}

const CreateNFT = ({
  collectibleType,
  setStep,
  addMultiple,
  collectible,
  handleChange,
  onAddFile,
  form,
  file,
  coverFile,
  dFile,
  step,
  goPreviousStep,
  showNotification,
  needThumbnail,
  setNeedThumbnail,
  removeFile,
  selectedNft, 
  assetType,
  defaultTasks,
  selectedTasks,
  setSelectedTasks,
  setInvalidUrl,
  ...props
}) => {

  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [dateSelectionFor, setDateSelectionFor] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const isMobile = useMediaQuery('(min-width:350px) and (max-width:1023px)');
  const descriptionRef = useRef(null);
  const [socialItems, setSocialItems] = useState([]);
  const [selectedSocialItem, setSelectedSocialItem] = useState('twitter');
  const [filteredTask, setFilteredTask] = useState([]);  
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    handleChange("eventMode", "venue");
    scrollToTop();
    
  }, []);

  
  useEffect(() => {
    if (defaultTasks.length) {
      setSocialItems([...new Set(defaultTasks.map(item=> item.social_name))]);
      if (filteredTask.length == 0) {
        setFilteredTask(defaultTasks.filter(item => item.social_name.toLocaleLowerCase() === 'twitter'));
      }
    }

  }, [defaultTasks]);

  const handleAddCoverFile = (value) => {
    if (
      value[0] &&
      (value[0].type === "image/png" ||
        value[0].type === "image/jpeg" ||
        value[0].type === "image/jpg" ||
        value[0].type === "image/webp" ||
        value[0].type === "image/gif")
    ) {
      if (value[0].size <= 31457280) {
        getDropzoneImageRatio(value[0], (ratio) => {
          if (ratio >= .5 && ratio <= 2) {
            onAddFile(value, "coverFile");
          } else {
            showNotification("Image ratio should be between .5 and 2")
          }
        })
      } else {
        showNotification("File size can be max 30MB.")
      }
    } else {
      showNotification("File type not valid.")
    }
  };

  const handleAddNFTFile = (value) => {
    if (
      value[0] &&
      (value[0].type === "image/png" ||
        value[0].type === "image/jpeg" ||
        value[0].type === "image/jpg" ||
        value[0].type === "image/gif" ||
        value[0].type === "image/webp" ||
        value[0].type === "video/mp4" ||
        value[0].type === "audio/mp3" ||
        value[0].type === "audio/mpeg" ||
        value[0].type === "video/mov")
    ) {
      if (value[0].size <= 104857600) {
        if (value[0].type === "image/png" ||
          value[0].type === "image/jpeg" ||
          value[0].type === "image/jpg" ||
          value[0].type === "image/webp") {
          getDropzoneImageRatio(value[0], (ratio) => {
            if (ratio >= .5 && ratio <= 2) {
              onAddFile(value, "nftFile");
            } else {
              showNotification("Image ratio should be between .5 and 2")
            }
          })
        } else {
          onAddFile(value, "nftFile");
        }
      } else {
        showNotification("File size can be max 100MB.")
      }
    } else {
      showNotification("File type not valid.")
    }
  };

  const getDropzoneImageRatio = (file, callback = () => { }) => {
    const i = new Image()
    i.src = file.preview;

    i.onload = () => {
      const ratio = i.width / i.height;
      callback(ratio)
    };
  }

  if (document.getElementById("inputField1")) {
    document.getElementById("inputField1").style.color = "white";
    document.getElementById("inputField1").style.textDecoration = "none";
  }

  if (document.getElementById("inputField2")) {
    document.getElementById("inputField2").style.color = "white";
    document.getElementById("inputField2").style.textDecoration = "none";
  }

  const handleConfirmDate = (date) => {
    if (date.getTime() <= new Date().getTime()) {
      showNotification("Date should be greater than current date.")
      return;
    }
    if (date) {
      if (dateSelectionFor === "eventStartTime") {
        handleChange("eventStartTime", date);
        setDateSelectionFor("");
      } else if (dateSelectionFor === "eventEndTime") {
        handleChange("eventEndTime", date);
        setDateSelectionFor("");
      }
      setIsDateDialogOpen(false);
    }
  };

  const handleEventDateChange = (type, event) => {
    setDateSelectionFor(type);
    setIsDateDialogOpen(true);
  };


  const checkboxHandleChange = (event) => {
    handleChange([event.target.name], event.target.checked);
  };

  const handleDescriptionHeight = (e) => {
    const currentHeight = e.target.scrollHeight;
    if (currentHeight > 60) {
      descriptionRef.current.style.height = currentHeight + "px";
    }
    if (e.target.value === "") {
      descriptionRef.current.style.height = "60px";
    }
  }

  const handleSocialItemClick = (name) => {
    setSelectedSocialItem(name.toLowerCase());
    const filteredItems = defaultTasks.filter(item => item.social_name.toLocaleLowerCase() === name.toLocaleLowerCase());
    setFilteredTask(filteredItems);
  }

  const handleTaskSelect = (item) => {   
    if(!selectedTasks.includes(item)){
      if (selectedTasks.length == 5) {
        setModalTitle('Task Limit Reached');
        setModalMessage('To ensure challenge success we limit the number of tasks that can be given to a challenge. A maximum of 5 tasks can be added.')
        setShowModal(true);
      } else {
        setSelectedTasks(prev => [...prev, item])
      }      
    } else {
      setModalTitle('Task Duplicacy occurred');
      setModalMessage('You have already added this task into the list, try another one.')
      setShowModal(true);
    }
  }

  const handleTaskRemove = (item) => {
    if(selectedTasks.includes(item)){
      setSelectedTasks(prev => prev.filter(innerItem => innerItem.id !== item.id))
    }
  }

  const addTask = (taskValue) => {
    setSelectedTasks(prev => prev.map(innerItem => {
      if (innerItem.id == taskValue.id) {
        innerItem.taskValue = taskValue;
      }
      return innerItem;
    }))
  }

  return (
    <div className="create-step3">
      <div className="d-flex align-items-center mb-4">
        <KeyboardBackspaceIcon
          onClick={goPreviousStep}
          style={{ color: "#FFFFFF", cursor: "pointer" }}
        />
        <span className="step-lead">
          Step {step-2} of {assetType.creationStep}
        </span>        
      </div>
      <p className="collectible-title">
        {(collectibleType && assetType.value === 1) ? collectibleType.name : `Token Challenge`} Details
      </p>
      <div className="upload-section mt-2">
        <div className="detail-panel">

          {/* {(assetType.value == 2 || (collectible && collectible.key != 'existing')) && 
          <div className="upload-group">
            <label>
                Challenge Cover
                <CustomTooltip title={"Please add an image or video to your challenge page. This can be any visual that fits to your challenge, such as an explainer, logo, etc."} placement="top-start">
                  <svg style={{ marginLeft: 8 }} width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.5 12C9.53757 12 12 9.53757 12 6.5C12 3.46243 9.53757 1 6.5 1C3.46243 1 1 3.46243 1 6.5C1 9.53757 3.46243 12 6.5 12Z" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6.5 8.7V6.5" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6.5 4.30078H6.5055" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </CustomTooltip>
              </label>
            <div className="upload-item">
              <Dropzone
                name="file"
                className="drop-zone"
                multiple={false}
                onDrop={handleAddNFTFile}
              >

                {file === null ? (
                  !props.fileLoading["nftFile"] ? (
                    <div className="dropify-message" style={{ width: '100%' }}>
                      <img className="icon" src="/images/upload-icon.svg" alt="" />
                      <p className="title">
                        Upload File
                      </p>
                      <p className="subtitle">
                        PNG, GIF, WEBP, MP4 or MP3,<br></br> Max 100MB
                      </p>
                    </div>
                  ) : (
                    <div className="dropify-message" style={{ width: '100%' }}>
                      <CustomLoader size={20} />
                      <p className="title">
                        Uploading...
                      </p>
                      <p className="subtitle">
                        Please wait.  File is being uploaded
                      </p>
                    </div>
                  )
                ) : <>
                  <img className="upload-icon" src="/images/upload-green.png" alt="" />
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="delete-icon" onClick={(e) => {
                    e.stopPropagation();
                    removeFile('nftFile');
                  }}>
                    <circle cx="19.5556" cy="19.5556" r="19.5556" fill="#FF4343" />
                    <path d="M11 13.8008H12.9H28.1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M26.2004 13.8V27.1C26.2004 27.6039 26.0002 28.0872 25.6439 28.4435C25.2876 28.7998 24.8043 29 24.3004 29H14.8004C14.2965 29 13.8132 28.7998 13.4569 28.4435C13.1006 28.0872 12.9004 27.6039 12.9004 27.1V13.8M15.7504 13.8V11.9C15.7504 11.3961 15.9506 10.9128 16.3069 10.5565C16.6632 10.2002 17.1465 10 17.6504 10H21.4504C21.9543 10 22.4376 10.2002 22.7939 10.5565C23.1502 10.9128 23.3504 11.3961 23.3504 11.9V13.8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M17.6504 18.5508V24.2508" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M21.4502 18.5508V24.2508" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </>}
                {file !== null &&
                  (file.type === "image/png" ||
                    file.type === "image/gif" ||
                    file.type === "image/jpeg" ||
                    file.type === "image/jpg" ||
                    file.type === "image/webp") && (
                    <div className="d-flex justify-content-center">
                      <img
                        src={file.preview}
                        className="file-img"
                        alt="File"
                      />
                    </div>
                  )}
                {file !== null &&
                  (file.type === "video/mp4" ||
                    file.type === "audio/mp3" ||
                    file.type === "audio/mpeg" ||
                    file.type === "video/mov") && (
                    <div
                      className="d-flex justify-content-center align-items-center h-100"
                      style={{ padding: 30 }}
                    >
                      <p className="m-0 text-white">{file.name}</p>
                    </div>
                  )}
              </Dropzone>
            </div>
            {needThumbnail && <div className="upload-item">
              <Dropzone
                name="file"
                className="drop-zone"
                multiple={false}
                onDrop={handleAddCoverFile}
              >

                {coverFile === null ? (
                  !props.fileLoading["coverFile"] ? (
                    <div className="dropify-message" style={{ width: '100%' }}>
                      <img className="icon" src="/images/upload-icon.svg" alt="" />
                      <p className="title">
                        Choose Thumbnail
                      </p>
                      <p className="subtitle">
                        JPEG, PNG or GIF Max 30MB
                      </p>
                    </div>
                  ) : (
                    <div className="dropify-message" style={{ width: '100%' }}>
                      <CustomLoader size={20} />
                      <p className="title">
                        Uploading...
                      </p>
                      <p className="subtitle">
                        Please wait.  File is being uploaded
                      </p>
                    </div>
                  )
                ) : <>
                  <img className="upload-icon" src="/images/upload-green.png" alt="" />
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="delete-icon" onClick={(e) => {
                    e.stopPropagation();
                    removeFile('coverFile');
                  }}>
                    <circle cx="19.5556" cy="19.5556" r="19.5556" fill="#FF4343" />
                    <path d="M11 13.8008H12.9H28.1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M26.2004 13.8V27.1C26.2004 27.6039 26.0002 28.0872 25.6439 28.4435C25.2876 28.7998 24.8043 29 24.3004 29H14.8004C14.2965 29 13.8132 28.7998 13.4569 28.4435C13.1006 28.0872 12.9004 27.6039 12.9004 27.1V13.8M15.7504 13.8V11.9C15.7504 11.3961 15.9506 10.9128 16.3069 10.5565C16.6632 10.2002 17.1465 10 17.6504 10H21.4504C21.9543 10 22.4376 10.2002 22.7939 10.5565C23.1502 10.9128 23.3504 11.3961 23.3504 11.9V13.8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M17.6504 18.5508V24.2508" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M21.4502 18.5508V24.2508" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </>}
                {coverFile !== null &&
                  (coverFile.type === "image/png" ||
                    coverFile.type === "image/jpeg" ||
                    coverFile.type === "image/jpg" ||
                    coverFile.type === "image/gif" ||
                    coverFile.type === "image/webp") && (
                    <div className="d-flex justify-content-center">
                      <img
                        src={coverFile.preview}
                        className="file-img"
                        alt="File"
                      />
                    </div>
                  )}
              </Dropzone>
            </div>
            }

          </div>
          } */}
          

          <div className="detail-form">
            <div className="form-group">
              <label>
                Name of Challenge
                <CustomTooltip title={"Please give your challenge a main name."} placement="top-start">
                  <svg style={{ marginLeft: 8 }} width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.5 12C9.53757 12 12 9.53757 12 6.5C12 3.46243 9.53757 1 6.5 1C3.46243 1 1 3.46243 1 6.5C1 9.53757 3.46243 12 6.5 12Z" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6.5 8.7V6.5" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6.5 4.30078H6.5055" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </CustomTooltip>
              </label>
              <input
                type="text"
                className="form-control"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder={`eg “Win my ${assetType.value === 1 ? "NFT" : "Token"}”`}
              />
            </div>
            <div className="form-group">
              <label>
                Description
                <CustomTooltip title={"Please describe what people should do to submit to your challenge."} placement="top-start">
                  <svg style={{ marginLeft: 8 }} width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.5 12C9.53757 12 12 9.53757 12 6.5C12 3.46243 9.53757 1 6.5 1C3.46243 1 1 3.46243 1 6.5C1 9.53757 3.46243 12 6.5 12Z" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6.5 8.7V6.5" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6.5 4.30078H6.5055" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </CustomTooltip>
              </label>              
                    <div className="ck-content" style={{ position: 'relative'}}>
                    <CKEditor
                        editor={ ClassicEditor }
                        config={ {
                            // plugins: [ Underline, Bold ],
                            toolbar: [ 'bold', 'italic', 'link', 'bulletedList' ],
                            placeholder: `eg ”Create a tweet on Twitter about my ${assetType.value === 1 ? "NFT" : "Token"}.”`,
                        } }
                        data={ form.description }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            handleChange("description", data);
                        } }
                    />
                    </div>
            </div>

            <div className="task-container">
              <label>
                Add specific tasks
                <CustomTooltip title={"Please describe what people should do to submit to your challenge."} placement="top-start">
                  <svg style={{ marginLeft: 8 }} width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.5 12C9.53757 12 12 9.53757 12 6.5C12 3.46243 9.53757 1 6.5 1C3.46243 1 1 3.46243 1 6.5C1 9.53757 3.46243 12 6.5 12Z" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6.5 8.7V6.5" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6.5 4.30078H6.5055" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </CustomTooltip>
              </label>
              <div className="social-name-container">
                {
                  socialItems.map(item=> (
                    <button className={`social-item-btn ${selectedSocialItem === item.toLowerCase() ? 'selected' : ''}`} onClick={()=> handleSocialItemClick(item)}>
                      {renderIcon(item)}
                      <span>{item}</span>
                    </button>
                  ))
                }
              </div>
              <div className="task-accordion-container">
                {
                  filteredTask?.map(item => (
                    <CustomAccordion addTask={()=>handleTaskSelect(item)} expanded={false} beforeIcon={renderIcon(item.social_name)} title={item.task_name} endIcon={renderIcon('expand')} key={item.id}>
                      
                    </CustomAccordion>
                  ))
                }
              </div>
              {selectedTasks?.length > 0 && 
                <>
                  <label>
                    Selected Tasks
                    <CustomTooltip title={"Please describe what people should do to submit to your challenge."} placement="top-start">
                      <svg style={{ marginLeft: 8 }} width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.5 12C9.53757 12 12 9.53757 12 6.5C12 3.46243 9.53757 1 6.5 1C3.46243 1 1 3.46243 1 6.5C1 9.53757 3.46243 12 6.5 12Z" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M6.5 8.7V6.5" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M6.5 4.30078H6.5055" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </CustomTooltip>
                  </label>
                  <div className="task-details-container">
                    {
                      selectedTasks.map(item=> (
                        <CustomAccordion removeTask={()=>handleTaskRemove(item)} expanded={true} beforeIcon={renderIcon(item.social_name)} title={item.task_name} endIcon={renderIcon('expand')} key={item.id}>
                          <TaskBody 
                            task={item} 
                            addTask={addTask} 
                            showNotification={showNotification}
                            canGoStep4={setInvalidUrl}
                          />
                        </CustomAccordion>
                      ))
                    }
                  </div>
                </>
              }
            </div>

            {/* {collectibleType && collectibleType.type === "nft_challenge" && (
              <div>
                <div className="form-group">
                  <label>
                    Website URL
                    <CustomTooltip title={"You can add a link here. This will be displayed on your challenge page for users to see."} placement="top-start">
                      <svg style={{ marginLeft: 8 }} width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.5 12C9.53757 12 12 9.53757 12 6.5C12 3.46243 9.53757 1 6.5 1C3.46243 1 1 3.46243 1 6.5C1 9.53757 3.46243 12 6.5 12Z" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M6.5 8.7V6.5" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M6.5 4.30078H6.5055" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </CustomTooltip>

                  </label>
                  <input
                    type="text"
                    value={form.url}
                    onChange={(e) => handleChange("url", e.target.value)}
                    placeholder="e.g. www.website.com"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Social Media Types related to this challenge
                    <CustomTooltip title={"If you select any of the socials, it will make verification mandatory for people to submit to your challenge."} placement="top-start">
                      <svg style={{ marginLeft: 8 }} width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.5 12C9.53757 12 12 9.53757 12 6.5C12 3.46243 9.53757 1 6.5 1C3.46243 1 1 3.46243 1 6.5C1 9.53757 3.46243 12 6.5 12Z" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M6.5 8.7V6.5" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M6.5 4.30078H6.5055" stroke="#959595" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </CustomTooltip>
                  </label>
                  <div className="social-checkbox">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checkedIcon={<svg className="checkbox-checked-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z" fill="#3445FF" />
                            <path d="M5 10.2L7.07692 12L14 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          }
                          checked={form.isInstagram} onChange={checkboxHandleChange} name="isInstagram" />
                      }
                      label="Instagram"
                    />
                  </div>
                  <div className="social-checkbox">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checkedIcon={<svg className="checkbox-checked-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z" fill="#3445FF" />
                            <path d="M5 10.2L7.07692 12L14 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          }
                          checked={form.isTwitter} onChange={checkboxHandleChange} name="isTwitter" />
                      }
                      label="Twitter"
                    />
                  </div>
                  <div className="social-checkbox">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checkedIcon={<svg className="checkbox-checked-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z" fill="#3445FF" />
                            <path d="M5 10.2L7.07692 12L14 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          }
                          checked={form.isYoutube} onChange={checkboxHandleChange} name="isYoutube" />
                      }
                      label="YouTube"
                    />
                  </div>
                  <div className="social-checkbox">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checkedIcon={<svg className="checkbox-checked-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z" fill="#3445FF" />
                            <path d="M5 10.2L7.07692 12L14 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          }
                          checked={form.isTwitch} onChange={checkboxHandleChange} name="isTwitch" />
                      }
                      label="Twitch"
                    />
                  </div>
                  <div className="social-checkbox">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checkedIcon={<svg className="checkbox-checked-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z" fill="#3445FF" />
                            <path d="M5 10.2L7.07692 12L14 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          }
                          checked={form.isTiktok} onChange={checkboxHandleChange} name="isTiktok" />
                      }
                      label="TikTok"
                    />
                  </div>
                </div>
              </div>
            )} */}
            {
              isMobile
                ? <div className="d-flex flex-column align-items-center justify-content-center">
                  {/* <button
                      className={`btn-continue mt-2 ${setCanGoStep4() ? "" : "disable"}`}
                      onClick={handleStep4}
                      style={{marginBottom: 16}}
                    >
                      Continue
                    </button> */}

                  {/* <button
                    className={`btn-preview ${setCanGoStep4() ? "" : "disable"}`}
                    onClick={() => {
                      setIsPreviewOpen(true)
                    }}
                  >
                    Preview
                  </button> */}
                </div>
                : (
                  // <button
                  //   className={`btn-continue mt-2 ${
                  //     setCanGoStep4() ? "" : "disable"
                  //   }`}
                  //   onClick={handleStep4}
                  // >
                  //   Continue
                  // </button>
                  <></>
                )}
          </div>
        </div>

        {/* {!isMobile && (
          <PreviewNFT
            file={file}
            coverFile={coverFile}
            form={form}
            collectibleType={collectibleType}
            addMultiple={
              collectible && collectible.name === "Multiple" ? true : false
            }
            collectible={collectible}
            selectedNft={selectedNft}
          />
        )} */}
        {/* {!isMobile && ( */}
        {(assetType.value == 2 || (collectible && collectible.key != 'existing')) ?
          <div className="preview-panel">
              <p className="drop-title text-center text-white">Upload Cover</p>
            <div className="upload-modal">
              <div className="profile-card">
              <Dropzone
                  name="file"
                  className="drop-zone"
                  multiple={false}
                  onDrop={handleAddNFTFile}
                >

                  {file === null ? (
                    !props.fileLoading["nftFile"] ? (
                      <div className="dropify-message" style={{ width: '100%' }}>
                        <img className="icon" src="/images/upload-icon.svg" alt="" />
                        <p className="title">
                          Upload File
                        </p>
                        <p className="subtitle">
                          PNG, GIF, WEBP, MP4 or MP3,<br></br> Max 100MB
                        </p>
                      </div>
                    ) : (
                      <div className="dropify-message" style={{ width: '100%' }}>
                        <CustomLoader size={20} />
                        <p className="title">
                          Uploading...
                        </p>
                        <p className="subtitle">
                          Please wait.  File is being uploaded
                        </p>
                      </div>
                    )
                  ) : <>
                    <img className="upload-icon" src="/images/upload-green.png" alt="" />
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="delete-icon" onClick={(e) => {
                      e.stopPropagation();
                      removeFile('nftFile');
                    }}>
                      <circle cx="19.5556" cy="19.5556" r="19.5556" fill="#FF4343" />
                      <path d="M11 13.8008H12.9H28.1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M26.2004 13.8V27.1C26.2004 27.6039 26.0002 28.0872 25.6439 28.4435C25.2876 28.7998 24.8043 29 24.3004 29H14.8004C14.2965 29 13.8132 28.7998 13.4569 28.4435C13.1006 28.0872 12.9004 27.6039 12.9004 27.1V13.8M15.7504 13.8V11.9C15.7504 11.3961 15.9506 10.9128 16.3069 10.5565C16.6632 10.2002 17.1465 10 17.6504 10H21.4504C21.9543 10 22.4376 10.2002 22.7939 10.5565C23.1502 10.9128 23.3504 11.3961 23.3504 11.9V13.8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M17.6504 18.5508V24.2508" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M21.4502 18.5508V24.2508" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </>}
                  {file !== null &&
                    (file.type === "image/png" ||
                      file.type === "image/gif" ||
                      file.type === "image/jpeg" ||
                      file.type === "image/jpg" ||
                      file.type === "image/webp") && (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                        <img
                          src={file.preview}
                          className="file-img"
                          alt="File"
                        />
                      </div>
                    )}
                  {file !== null &&
                    (file.type === "video/mp4" ||
                      file.type === "audio/mp3" ||
                      file.type === "audio/mpeg" ||
                      file.type === "video/mov") && (
                      <div
                        className="w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{ padding: 30 }}
                      >
                        <p className="m-0 text-white text-center" style={{lineBreak: 'anywhere'}}>{file.name}</p>
                      </div>
                    )}
                </Dropzone>
              </div>
              
            </div>
            {
              needThumbnail && (
                <>
                  <p className="drop-title text-center text-white mt-4">Choose Thumbnail</p>
                  <div className="upload-modal">
              <div className="profile-card">
              <Dropzone
                name="file"
                className="drop-zone"
                multiple={false}
                onDrop={handleAddCoverFile}
              >

                {coverFile === null ? (
                  !props.fileLoading["coverFile"] ? (
                    <div className="dropify-message" style={{ width: '100%' }}>
                      <img className="icon" src="/images/upload-icon.svg" alt="" />
                      <p className="title">
                        Choose Thumbnail
                      </p>
                      <p className="subtitle">
                        JPEG, PNG or GIF Max 30MB
                      </p>
                    </div>
                  ) : (
                    <div className="dropify-message" style={{ width: '100%' }}>
                      <CustomLoader size={20} />
                      <p className="title">
                        Uploading...
                      </p>
                      <p className="subtitle">
                        Please wait.  File is being uploaded
                      </p>
                    </div>
                  )
                ) : <>
                  <img className="upload-icon" src="/images/upload-green.png" alt="" />
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="delete-icon" onClick={(e) => {
                    e.stopPropagation();
                    removeFile('coverFile');
                  }}>
                    <circle cx="19.5556" cy="19.5556" r="19.5556" fill="#FF4343" />
                    <path d="M11 13.8008H12.9H28.1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M26.2004 13.8V27.1C26.2004 27.6039 26.0002 28.0872 25.6439 28.4435C25.2876 28.7998 24.8043 29 24.3004 29H14.8004C14.2965 29 13.8132 28.7998 13.4569 28.4435C13.1006 28.0872 12.9004 27.6039 12.9004 27.1V13.8M15.7504 13.8V11.9C15.7504 11.3961 15.9506 10.9128 16.3069 10.5565C16.6632 10.2002 17.1465 10 17.6504 10H21.4504C21.9543 10 22.4376 10.2002 22.7939 10.5565C23.1502 10.9128 23.3504 11.3961 23.3504 11.9V13.8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M17.6504 18.5508V24.2508" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M21.4502 18.5508V24.2508" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </>}
                {coverFile !== null &&
                  (coverFile.type === "image/png" ||
                    coverFile.type === "image/jpeg" ||
                    coverFile.type === "image/jpg" ||
                    coverFile.type === "image/gif" ||
                    coverFile.type === "image/webp") && (
                    <div className="d-flex justify-content-center align-items-center h-100">
                      <img
                        src={coverFile.preview}
                        className="file-img"
                        alt="File"
                      />
                    </div>
                  )}
              </Dropzone>
              </div>
              
            </div>
                </>
              )
            }
          </div> : <PreviewNFT
            file={file}
            coverFile={coverFile}
            form={form}
            collectibleType={collectibleType}
            addMultiple={
              collectible && collectible.name === "Multiple" ? true : false
            }
            collectible={collectible}
            selectedNft={selectedNft}
          />}
        {/* )} */}



        {isDateDialogOpen && (
          <Calender
            open={isDateDialogOpen}
            onHide={setIsDateDialogOpen}
            onConfirm={handleConfirmDate}
          />
        )}


        {/* Preview modal for mobile views */}
        {
          isMobile && <Dialog
            open={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            className="preview-modal"
          >
            <MuiDialogTitle className="share-modal-header">


              <IconButton
                aria-label="close"
                onClick={() => setIsPreviewOpen(false)}
                className="close_button"
              >
                <CloseIcon />
              </IconButton>
            </MuiDialogTitle>
            <DialogContent>
              <PreviewNFT
                file={file}
                coverFile={coverFile}
                form={form}
                collectibleType={collectibleType}
                addMultiple={
                  collectible && collectible.name === "Multiple" ? true : false
                }
                collectible={collectible}
                selectedNft={selectedNft}                
              />
            </DialogContent>

          </Dialog>
        }


      </div>
      <CustomAlert
          type="" 
          width={514} 
          isDialogOpen={showModal} 
          title={modalTitle}
          message={modalMessage}
          btnText="OK, got it!" 
          customDialogAlertClose={() => setShowModal(false)} 
          showCloseIcon={true}
          // doSomething={handleConnectWallet}
        />
    </div>
  );
};

export default React.memo(CreateNFT);
