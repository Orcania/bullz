import React from 'react';
import './style.scss';
import { useHistory } from "react-router-dom";

const Error = (props) => {
    const history = useHistory();
    return (
        <div className="error-page">
            <div className="error-page-wrapper">
                <div className="error-page-img">
                    <img src="/images/error_page_logo.png" alt="error-page" />
                </div>
                <div className="error-page-content">

                    <p className="error-page-subtitle">
                        Sorry, <br />
                        We couldn’t find the page you’re looking for.
                    </p>
                    <div className="d-flex justify-content-center align-items-center">
                        <button className="btn-continue" onClick={() => {history.push('/')}}>Go Back</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Error;