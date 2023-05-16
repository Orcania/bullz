import React from 'react';

const CopyIcon = ({onClick}) => {
    return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.97521 6C7.33205 6 6 7.34075 6 8.99465V21.8289C6 23.4828 7.33205 24.8235 8.97521 24.8235H12.5455V26.2353C12.5455 28.3145 14.22 30 16.2857 30H26.2597C28.3254 30 30 28.3145 30 26.2353V14.4706C30 12.3914 28.3254 10.7059 26.2597 10.7059H22.8312V8.99465C22.8312 7.34075 21.4991 6 19.856 6H8.97521ZM20.961 10.7059V8.99465C20.961 8.38035 20.4663 7.88235 19.856 7.88235H8.97521C8.36489 7.88235 7.87013 8.38035 7.87013 8.99465V21.8289C7.87013 22.4432 8.36489 22.9412 8.97521 22.9412H12.5455V14.4706C12.5455 12.3914 14.22 10.7059 16.2857 10.7059H20.961ZM14.4156 14.4706C14.4156 13.431 15.2529 12.5882 16.2857 12.5882H26.2597C27.2926 12.5882 28.1299 13.431 28.1299 14.4706V26.2353C28.1299 27.2749 27.2926 28.1176 26.2597 28.1176H16.2857C15.2529 28.1176 14.4156 27.2749 14.4156 26.2353V14.4706Z" fill="white" />
        </svg>
    );
};

export default CopyIcon;