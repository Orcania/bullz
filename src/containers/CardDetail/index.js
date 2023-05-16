import React, { useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ProfileCard from '../../components/Common/ProfileCard';

import './style.scss';

const CardDetail = () => {
  const [actionStatus, setActionStatus] = useState(true);
  const [actionSaleStatus, setActionSaleStatus] = useState(true);
  const links = [
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
    {
      name: 'Change Price',
      link: 'price',
    },
    {
      name: 'Remove from Sale',
      link: 'remove',
    },
  ];
  const history = useHistory();

  const { status } = useParams();

  const message = useMemo(() => (
    links.find((link) => link.link === status).name
  ), [links, status]);

  const goBack = () => {
    history.push('/profile');
  };

  const cardInfo = {
    name: 'Telephonic Rabbit',
    image: '1',
    ending: '58m : 34s',
    user: {
      image: 'avatar',
      name: '@madmaraca',
    },
    eth: '0.944 ETH 1 of 1',
    type: 'Bid Now',
    like: true,
    count: 321,
    multiple: false,
    owner: false,
  };

  return (
    <div className="card-detail-page">
      <div className="container">
        <div className="back-breadcrumb" onClick={goBack}>
          <KeyboardBackspaceIcon />
          <p className="back-lead">{message}</p>
        </div>
        {status === 'view' && (
          <div className="row view-row">
            <div className="col-12">
              <h3 className="status-title">View Hidden Message of NFT</h3>
            </div>
            <div className="col-md-6">
              <p className="detail-lead">
                Below you can find the hidden message of NFT that was attached by the NFT Creator
              </p>
              <div className="detail-card">
                <p className="detail-lead">
                  Lorem Ipsum dolor slt amet, consectetur adiplscing allt, sed do elusmod tempor
                  incididunt ut labore et dolore magna aliqua, Ut enim veniam, quis mostrud exercitation.
                  Lorem Ipsum dolor slt amet, consectetur adiplscing allt, sed do elusmod tempor
                  incididunt ut labore et dolore magna aliqua, Ut enim veniam, quis mostrud exercitation.
                </p>
                <p className="url-lead">https://twitter.com</p>
              </div>
              <button className="btn-continue">Save</button>
            </div>
            <div className="col-md-3" />
            <div className="col-md-3">
              <p className="preview-lead">Preview</p>
              <ProfileCard info={cardInfo} />
            </div>
          </div>
        )}
        {status === 'price' && (
          <div className="row price-row">
            <div className="col-12">
              <h3 className="status-title">Change NFT Selling Details</h3>
            </div>
            <div className="col-md-6">
              <p className="detail-lead mb-1">
                Adjust your sell method and pricing details
              </p>
              <div className="detail-card">
                <div className="detail-item">
                  <p className="detail-lead lead-wrapper">Put on Auction</p>
                  <div className="detail-action-wrapper">
                    <div
                      className={`custom-switch-2 ${actionStatus ? 'active' : ''}`}
                      onClick={() => setActionStatus(!actionStatus)}
                    >
                      <div className="d-flex justify-content-center flex-fill toggle-nav nav-left">No</div>
                      <div className="d-flex justify-content-center flex-fill toggle-nav nav-right">Yes</div>
                      <div className="toggle-bar" />
                    </div>
                  </div>
                </div>
                <div className="detail-item">
                  <p className="detail-sub-lead lead-wrapper">Select minimum sale price</p>
                  <div className="detail-action-wrapper">
                    <div className="form-wrapper">
                      <input type="text" className="detail-input text-center" value={50} />
                      <div className="wom-select">
                        <p>WOM</p>
                        <ExpandMoreIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="detail-card">
                <div className="detail-item">
                  <p className="detail-lead lead-wrapper">Instant Sale</p>
                  <div className="detail-action-wrapper">
                    <div
                      className={`custom-switch-2 ${actionSaleStatus ? 'active' : ''}`}
                      onClick={() => setActionSaleStatus(!actionSaleStatus)}
                    >
                      <div className="d-flex justify-content-center flex-fill toggle-nav nav-left">No</div>
                      <div className="d-flex justify-content-center flex-fill toggle-nav nav-right">Yes</div>
                      <div className="toggle-bar" />
                    </div>
                  </div>
                </div>
                <div className="detail-item">
                  <p className="detail-sub-lead lead-wrapper">
                    Enter the price for which the item will be instantly sold
                  </p>
                  <div className="detail-action-wrapper">
                    <div className="form-wrapper">
                      <input type="text" className="detail-input text-center" value={20} />
                      <div className="wom-select">
                        <p>WOM</p>
                        <ExpandMoreIcon />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="detail-item">
                  <p className="detail-sub-lead">
                    Service fee
                    {' '}
                    <span className="detail-lead">XX%</span>
                  </p>
                </div>
                <div className="detail-item">
                  <p className="detail-sub-lead">
                    You will receive
                    {' '}
                    <span className="detail-lead">XX WOM</span>
                    {' '}
                    $XX
                  </p>
                </div>
              </div>
              <p className="detail-lead mb-1">
                Time Details
              </p>
              <div className="detail-card">
                <p className="detail-lead">Time deadline</p>
                <div className="dead-line-item">
                  <p className="detail-sub-lead">Duration of Sales</p>
                  <div className="picker-group">
                    <div className="date-picker">
                      25 Jan 2021
                      <ExpandMoreIcon />
                    </div>
                    <p className="detail-sub-lead">To</p>
                    <div className="date-picker">
                      25 Jan 2021
                      <ExpandMoreIcon />
                    </div>
                  </div>
                </div>
              </div>
              <button className="btn-continue">Save</button>
            </div>
            <div className="col-md-3" />
            <div className="col-md-3">
              <p className="preview-lead">Preview</p>
              <ProfileCard info={cardInfo} />
            </div>
          </div>
        )}
        {status === 'remove' && (
          <div className="row">
            <div className="col-12">
              <h3 className="status-title">Remove from Sale</h3>
            </div>
            <div className="col-md-6">
              <p className="detail-lead mb-1">
              Please select an option below
              </p>
              <div className="detail-card">
                <div className="detail-item">
                  <p className="detail-lead lead-wrapper">Remove from Sale</p>
                  <div className="detail-action-wrapper">
                    <div
                      className={`custom-switch-2 ${actionStatus ? 'active' : ''}`}
                      onClick={() => setActionStatus(!actionStatus)}
                    >
                      <div className="d-flex justify-content-center flex-fill toggle-nav nav-left">No</div>
                      <div className="d-flex justify-content-center flex-fill toggle-nav nav-right">Yes</div>
                      <div className="toggle-bar" />
                    </div>
                  </div>
                </div>
                <div className="detail-item">
                  <p className="detail-sub-lead lead-wrapper">
                    When selecting YES, your NFT will not accept any offers and will be removed from sale.
                  </p>
                </div>
              </div>
              <button className="btn-continue">Save</button>
            </div>
            <div className="col-md-3" />
            <div className="col-md-3">
              <p className="preview-lead">Preview</p>
              <ProfileCard info={cardInfo} />
            </div>
          </div>
        )}
        {status === 'offers' && (
          <div className="row">
            <div className="col-12">
              <h3 className="status-title">Accept NFT Offers</h3>
            </div>
            <div className="col-md-6">
              <p className="detail-lead mb-1">
                Please select an option below
              </p>
              <div className="detail-card">
                <div className="detail-item">
                  <p className="detail-lead lead-wrapper">Accept NFT Offers</p>
                  <div className="detail-action-wrapper">
                    <div
                      className={`custom-switch-2 ${actionStatus ? 'active' : ''}`}
                      onClick={() => setActionStatus(!actionStatus)}
                    >
                      <div className="d-flex justify-content-center flex-fill toggle-nav nav-left">No</div>
                      <div className="d-flex justify-content-center flex-fill toggle-nav nav-right">Yes</div>
                      <div className="toggle-bar" />
                    </div>
                  </div>
                </div>
                <div className="detail-item">
                  <p className="detail-sub-lead">
                    When selecting YES, other users will be able to send offers for your NFT.
                  </p>
                </div>
              </div>
              <button className="btn-continue">Save</button>
            </div>
            <div className="col-md-3" />
            <div className="col-md-3">
              <p className="preview-lead">Preview</p>
              <ProfileCard info={cardInfo} />
            </div>
          </div>
        )}
        {status === 'transfer' && (
          <div className="row transfer-row">
            <div className="col-12">
              <h3 className="status-title">Transfer NFT Ownership</h3>
            </div>
            <div className="col-md-6">
              <p className="detail-lead mb-1">
                Please select to which owner the NFT should be transferred to :
              </p>
              <div className="detail-card">
                <div className="transfer-item">
                  <p className="detail-lead">Accept NFT Offers</p>
                  <input type="text" className="detail-input" value="0248121542sgerhsdv...0542" />
                  <p className="detail-sub-lead">
                    Copy and Paste the public BULLZ address of the BULLZ user you want to transfer ownership to.
                  </p>
                </div>
              </div>
              <button className="btn-continue">Transfer</button>
            </div>
            <div className="col-md-3" />
            <div className="col-md-3">
              <p className="preview-lead">Preview</p>
              <ProfileCard info={cardInfo} />
            </div>
          </div>
        )}
        {status === 'sell' && (
          <div className="row price-row">
            <div className="col-12">
              <h3 className="status-title">NFT Selling Details</h3>
            </div>
            <div className="col-md-6">
              <p className="detail-lead mb-1">
                Select your sell method and pricing details
              </p>
              <div className="detail-card">
                <div className="detail-item">
                  <p className="detail-lead lead-wrapper">Put on Auction</p>
                  <div className="detail-action-wrapper">
                    <div
                      className={`custom-switch-2 ${actionStatus ? 'active' : ''}`}
                      onClick={() => setActionStatus(!actionStatus)}
                    >
                      <div className="d-flex justify-content-center flex-fill toggle-nav nav-left">No</div>
                      <div className="d-flex justify-content-center flex-fill toggle-nav nav-right">Yes</div>
                      <div className="toggle-bar" />
                    </div>
                  </div>
                </div>
                <div className="detail-item">
                  <p className="detail-sub-lead lead-wrapper">Select minimum sale price</p>
                  <div className="detail-action-wrapper">
                    <div className="form-wrapper">
                      <input type="text" className="detail-input text-center" value={50} />
                      <div className="wom-select">
                        <p>WOM</p>
                        <ExpandMoreIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="detail-card">
                <div className="detail-item">
                  <p className="detail-lead lead-wrapper">Instant Sale</p>
                  <div className="detail-action-wrapper">
                    <div
                      className={`custom-switch-2 ${actionSaleStatus ? 'active' : ''}`}
                      onClick={() => setActionSaleStatus(!actionSaleStatus)}
                    >
                      <div className="d-flex justify-content-center flex-fill toggle-nav nav-left">No</div>
                      <div className="d-flex justify-content-center flex-fill toggle-nav nav-right">Yes</div>
                      <div className="toggle-bar" />
                    </div>
                  </div>
                </div>
                <div className="detail-item">
                  <p className="detail-sub-lead lead-wrapper">
                    Enter the price for which the item will be instantly sold
                  </p>
                  <div className="detail-action-wrapper">
                    <div className="form-wrapper">
                      <input type="text" className="detail-input text-center" value={20} />
                      <div className="wom-select">
                        <p>WOM</p>
                        <ExpandMoreIcon />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="detail-item">
                  <p className="detail-sub-lead">
                    Service fee
                    {' '}
                    <span className="detail-lead">XX%</span>
                  </p>
                </div>
                <div className="detail-item">
                  <p className="detail-sub-lead">
                    You will receive
                    {' '}
                    <span className="detail-lead">XX WOM</span>
                    {' '}
                    $XX
                  </p>
                </div>
              </div>
              <p className="detail-lead mb-1">
                Time Details
              </p>
              <div className="detail-card">
                <p className="detail-lead">Time deadline</p>
                <div className="dead-line-item">
                  <p className="detail-sub-lead">Duration of Sales</p>
                  <div className="picker-group">
                    <div className="date-picker">
                      25 Jan 2021
                      <ExpandMoreIcon />
                    </div>
                    <p className="detail-sub-lead">To</p>
                    <div className="date-picker">
                      25 Jan 2021
                      <ExpandMoreIcon />
                    </div>
                  </div>
                </div>
              </div>
              <button className="btn-continue">Save</button>
            </div>
            <div className="col-md-3" />
            <div className="col-md-3">
              <p className="preview-lead">Preview</p>
              <ProfileCard info={cardInfo} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDetail;
