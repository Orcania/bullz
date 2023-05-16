import React, { useState } from 'react';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { Menu, MenuItem, Tooltip } from '@material-ui/core';

import './style.scss';
import { useHistory } from 'react-router';
import CustomTooltip from '../Tooltip/CustomTooltip';
import { capitalize } from 'common/utils';

const ProfileCard = ({ info }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (link) => {
    history.push(`/profile/details/${link}`);
  };

  const ownerMenus = [
    {
      name: 'View Hidden Message',
      link: 'view',
    },
    {
      name: 'Sell NFT',
      link: 'sell',
    },
    {
      name: 'Accept Offers',
      link: 'offers',
    },
    {
      name: 'Transfer NFT',
      link: 'transfer',
    },
  ];

  const notOwnerMenus = [
    {
      name: 'View Hidden Message',
      link: 'view',
    },
    {
      name: 'Change Price',
      link: 'price',
    },
    {
      name: 'Transfer NFT',
      link: 'transfer',
    },
    {
      name: 'Remove from Sale',
      link: 'remove',
    },
  ];

  return (
    <div className={`profile-card ${info.multiple ? 'multiple-card' : ''}`}>
      <div className="card-image">
        <img src={`/images/items/${info.image}.png`} alt="Item" className="card-content-image" />
        {info.ending && (
          <div className="card-summary">
            <div className="summary-wrapper">
              <p className="ending">Ending In</p>
              <p className="time">{info.ending}</p>
            </div>
          </div>
        )}
        <div className="card-more">
          <img
            src="/images/card-more.png"
            alt="Card More"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
          />
          {info.owner && (
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {
                ownerMenus.map((menu, index) => (
                  <MenuItem onClick={() => handleMenuItemClick(menu.link)} key={index}>{menu.name}</MenuItem>
                ))
              }
            </Menu>
          )}
          {!info.owner && (
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {
                notOwnerMenus.map((menu, index) => (
                  <MenuItem onClick={() => handleMenuItemClick(menu.link)} key={index}>{menu.name}</MenuItem>
                ))
              }
            </Menu>
          )}
        </div>
      </div>
      <div className="card-content">
        <CustomTooltip 
          title={`${capitalize(info.name)}`}
          placement={"top"}
        >
          <p className="item-title">{info.name}</p>
        </CustomTooltip>

        <div className="card-icon-wrapper">

          <div className="card-icon">
            <img src={`/images/${info.user.image}.png`} alt="Avatar"/>
            <p className="avatar-name">@{info.user.name}</p>

            <div className="tip">
              Creator : {info.user.name}
            </div>
          </div>

          <div className="collection-wrapper">
            <img src="/images/card_yiki.png" alt="" />
            <div className="tip-right">
                Collection : {info.collectionType.name}
            </div>
          </div>          
          
        </div>
        <div className="card-footer">
          <div className="d-flex justify-content-between">
            <p className="card-lead">{info.eth}</p>
            <p className="card-footer-lead">{info.type}</p>
          </div>
          <div className={`like-wrapper ${info.like ? '' : 'dislike'}`}>
            {info.like && <FavoriteIcon />}
            {!info.like && <FavoriteBorderIcon />}
            <p className="card-lead mb-0">{info.count}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
