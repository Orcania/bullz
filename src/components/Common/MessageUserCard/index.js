import React from 'react';

import './style.scss';

const CreatorCard = ({ room, currentRoomId }) => {
  return(
  <div className={room?.id === currentRoomId?'user-card is-active':'user-card'}>
    <div className="d-flex">
      <img src={room?.currentRightUser?.avatar_img ?
      room?.currentRightUser?.avatar_img:
      'images/avatar.png'
    } alt="Avatar" className="card-avatar" />
      <div className="card-info">
        <p className="card-name">@{room?.currentRightUser?.username}</p>
        { room.nft_uuid == 'direct-chat' ? 
          <p className="card-eth">
            direct chat
          </p> : room.challenge?.id ? 
          <p className="card-eth">
            <img className="nft-avatar" alt="nft-avatar" src={room?.challenge?.cover ? room?.challenge?.cover : '/images/card_yiki.png'} style={{maxWidth:30}} />
            {room?.challenge?.name}
          </p> :
          <p className="card-eth">
            <img className="nft-avatar" alt="nft-avatar" src={room?.nft?.cover ? room?.nft?.cover : '/images/card_yiki.png'} style={{maxWidth:30}} />
            {room?.nft?.name}
          </p>
        }
      </div>
    </div>
    {
      room.unseen > 0 && (
        <div className="unseen">
          <p>
            {room.unseen}
          </p>
        </div>
      )
    }
    
   
  </div>
  )};

export default CreatorCard;
