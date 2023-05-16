import React, { useState } from "react";
import { Modal, Row } from "react-bootstrap";
import './style.scss';

function WalletConnectingDialog(props) {
  const [show] = useState(false);

  return (
    <>
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        show={!show}
        onHide={() => {}}
        dialogClassName="disconnect-switch-network-modal"
        fullScreen={true}
        animation={false}
        backdrop={true}
        centered
      >
        <Modal.Body>
            <div className="">
              <div className="inner">
                <img src={'/images/bullzLogoBig.png'} alt="" className="logo-img" />
                <p className="subtitle">Communicating with wallet. Switch network within your wallet.</p>
                <button className={`btn-continue`}  onClick={() => {
                  props.hideShow();
                  }}>Disconnect</button>
              </div>
            </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default React.memo(WalletConnectingDialog);
