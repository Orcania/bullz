import React from 'react';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import './style.scss';
import { useHistory } from 'react-router-dom';

const ManageWallet = () => {
    const history = useHistory();
    const walletItem = [
        {
            id: 1,
            name: 'Ethereum',
            network: 'Etherscan',
            address: '0xdCF2B389359a59E18233B127482660459E37820a',
            image: '/images/balance-ether.png',
        },
        {
            id: 2,
            name: 'Polygon',
            network: 'Polygon Explorer',
            address: '0xdCF2B389359a59E18233B127482660459E37820a',
            image: '/images/balance-ether.png',
        }
    ]
    return (
        <div className="manage-wallet-wrapper">
            <div className="header" onClick={()=> history.goBack()}>
                <KeyboardBackspaceIcon /> Back
            </div>

            <p className="page-title">Manage Wallets</p>
            <p className="page-subtitle">
                Add one or more wallets to showcase your NFTs in one place
            </p>
            {
                walletItem.map(item => (
                    <div className="wallet-item">
                        <img src={item.image ? item.image : "/images/default-profile-cover.png"} alt="" className="logo-img" />
                        <div className="account-info">
                            <p className="account-title">{item.name}</p>
                            <div className="address">
                                <p className="view-on">View on {item.network}</p>
                                <p className="address-text">
                                    {item.address.slice(0, 27)}...
                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.59091 0C0.712274 0 0 0.712274 0 1.59091V8.40909C0 9.28773 0.712276 10 1.59091 10H3.5V10.75C3.5 11.8546 4.39543 12.75 5.5 12.75H10.8333C11.9379 12.75 12.8333 11.8546 12.8333 10.75V4.5C12.8333 3.39543 11.9379 2.5 10.8333 2.5H9V1.59091C9 0.712274 8.28773 0 7.40909 0H1.59091ZM8 2.5V1.59091C8 1.26456 7.73544 1 7.40909 1H1.59091C1.26456 1 1 1.26456 1 1.59091V8.40909C1 8.73544 1.26456 9 1.59091 9H3.5V4.5C3.5 3.39543 4.39543 2.5 5.5 2.5H8ZM4.5 4.5C4.5 3.94772 4.94772 3.5 5.5 3.5H10.8333C11.3856 3.5 11.8333 3.94772 11.8333 4.5V10.75C11.8333 11.3023 11.3856 11.75 10.8333 11.75H5.5C4.94772 11.75 4.5 11.3023 4.5 10.75V4.5Z" />
                                    </svg>

                                </p>
                            </div>
                        </div>
                    </div>
                ))
            }

            <div className="actions">
                <button className="btn-continue">Link Wallet</button>
                <button className="btn-continue cancel">Cancel</button>
            </div>

        </div>
    );
};

export default ManageWallet;