import React, { useState } from "react";
import { Modal, Row } from "react-bootstrap";
import walletconnect from "../../assets/images/walletconnect.png";
import metamask from "../../assets/images/metamask.png";
import './style.scss';
import { Checkbox, useMediaQuery } from "@material-ui/core";
import { Link, useHistory } from 'react-router-dom';

function WalletSelectDialog(props) {
  const [show] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("metamask");
  const [agreeCheckbox, setAgreeCheckbox] = useState(false);
  const history = useHistory();
  const isMobile = useMediaQuery('(min-width:350px) and (max-width:1023px)');

  const walletItems = [
    {
      id: 1, 
      name: "Metamask",
      image: '/images/metamask-sm',
      value: 'metamask',
    },
    {
      id: 2,
      name: "Fortmatic",
      image: '/images/rotate-sm',
      value: 'fortmatic'
    },
    {
      id: 3,
      name: "WalletConnect",
      image: '/images/wallet-connect',
      value: 'walletConnect'
    }
  ]

  const handleSelectWallet = (name) => {
    if (name !== selectedWallet){     
      setSelectedWallet(name);
    }
  }

  return (
    <>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={!show}
        onHide={() => props.hideShow()}
        dialogClassName="dialog-container"
      >
        <Modal.Body>
          <Row>
            <div className="wallet-connect-container">
              <img src={'/images/bullzLogoBig.png'} alt="" className="logo-img" />
              <p className="subtitle">Connect Wallet</p>
              <p className="title">Please connect your wallet to continue</p>
              <div className="wallet-items-container">
                {
                  walletItems.map(item => (
                    <div key={item.name} onClick={()=> handleSelectWallet(item.value)} className={`wallet-item-wrapper ${item.value === selectedWallet ? "selected" : ""}`}>
                      <img src={`${item.image}${isMobile ? ".png" : ".svg"}`} alt="" className="wallet-item" />
                      <p className="wallet-name">{item.name}</p>                    
                    </div>
                  ))
                }
              </div>
              <div className="agreement-container">
                <div className="checkbox-container">
                  <Checkbox
                  checkedIcon={<svg className="checkbox-checked-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 0H2C0.89543 0 0 0.89543 0 2V16C0 17.1046 0.89543 18 2 18H16C17.1046 18 18 17.1046 18 16V2C18 0.89543 17.1046 0 16 0Z" fill="#3445FF" />
                  <path d="M5 10.2L7.07692 12L14 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                }
                    defaultChecked={false}
                    color="primary"
                    value={agreeCheckbox}
                    onChange={e => {setAgreeCheckbox(e.target.checked)}}
                  />
                </div>
                <div className="agreement">
                  {
                    isMobile ? <p>
                      I acknowledge that I have read <Link to="/terms-and-conditions" onClick={(e)=> {props.hideShow(); history.push("/terms-and-conditions")}}> THE Privacy Policy</Link>&nbsp;and agree to the <Link to="/terms-and-conditions" onClick={(e)=> {props.hideShow(); history.push("/terms-and-conditions")}}> Terms of Service.</Link>
                    </p> : <>
                      <p>I acknowledge that I have read <Link to="/terms-and-conditions" onClick={(e)=> {props.hideShow(); history.push("/terms-and-conditions")}}> THE Privacy Policy</Link> </p>
                      <p> and agree to the <Link to="/terms-and-conditions" onClick={(e)=> {props.hideShow(); history.push("/terms-and-conditions")}}> Terms of Service.</Link> </p>
                    </>
                  }
                  
                </div>
              </div>
              <button className={`btn-continue ${!agreeCheckbox ? "disable" : ""}`} disabled={!agreeCheckbox} onClick={() => {
                props.connectWithWallet(selectedWallet);
                }}>Connect Wallet</button>
                <button onClick={() => props.hideShow()} className="btn-cancel">CANCEL</button>
            </div>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default React.memo(WalletSelectDialog);
