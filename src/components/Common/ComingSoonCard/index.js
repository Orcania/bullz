import React from 'react';

import './style.scss';

const ComingSoonCard = ({ item }) => (
  <div className="coming-card">
    <div className="coming-content">
      <img src={item.cover} alt="" />
      <div className="top-left-content">
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.51222 3.54446C5.18222 3.54446 4.91333 3.27557 4.91333 2.94557C4.91333 2.61557 5.18222 2.34668 5.51222 2.34668C5.84222 2.34668 6.11111 2.61557 6.11111 2.94557C6.11111 3.27557 5.84222 3.54446 5.51222 3.54446V3.54446ZM6.11114 8.05383C6.11114 8.38395 5.83003 8.65284 5.50003 8.65284C5.17003 8.65284 4.88892 8.38395 4.88892 8.05383V4.92506C4.88892 4.59506 5.17003 4.32617 5.50003 4.32617C5.83003 4.32617 6.11114 4.59506 6.11114 4.92506V8.05383ZM5.5 0C2.45667 0 0 2.45667 0 5.5C0 8.54321 2.45667 11 5.5 11C8.54333 11 11 8.54321 11 5.5C11 2.45667 8.54333 0 5.5 0V0Z" fill="white"/>
      </svg>

        <p className="left-text">Coming Soon</p>
      </div>
    </div>
    <div className="overlay-card">
      <p></p>
      <div className="btn-continue">Coming Soon</div>
      <p className="title">Coming Soon</p>
    </div>
  </div>
);

export default ComingSoonCard;
