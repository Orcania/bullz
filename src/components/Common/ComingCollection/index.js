import React from 'react';

import './style.scss';

const ComingCollection = ({ info }) => (
  <div className="coming_soon_card">
    <div className="card-image">
      <img src={`/images/items/1.png`} className="bg-img" alt="Coming Soon" />
    </div>
    <div className="card-info">
      <p className="card-title">Coming Soon</p>
      <div className="d-flex align-items-center">
        <img src={`/images/black_yiki.png`} alt="" />
        <p className="card-txt">Only on BULLZ</p>
      </div>
    </div>
  </div>
);

export default ComingCollection;
