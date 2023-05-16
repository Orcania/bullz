import React from 'react';
import './style.scss';
import CountDown from "../../components/AuctionTimmer/auctionTimmer";
import { useHistory } from 'react-router-dom';
import { YouTube } from '@material-ui/icons';

const ChallengeDetails = ({nft, challenge, showCreator, showSocialRequires, showDistribution, showChallengeSubmission}) => {
    const history = useHistory();

    const isTimePassed = (startTime) => {
        var launchDate = new Date(parseInt(startTime)).getTime();
        var currDate = new Date().getTime();
        return launchDate < currDate;
    }

    return (
        <div className="details-container">

            {showCreator && (
                <>
                    {nft?.nftType == 'nft_challenge' ? 
                            <div className="detail-item cursor-pointer" onClick={()=> challenge?.creator?.address ? history.push(`/profile/${challenge.creator.address}`) : undefined}>
                            <img src={challenge?.creator?.avatar_img ? challenge?.creator?.avatar_img : "/images/default-profile-cover.png"} alt="" />
                            <div className="content">
                                <p className="title">
                                    Challenge Creator
                                </p>
                                <p className="subtitle">
                                    @{challenge?.creator?.username}
                                </p>
                            </div>
                        </div>  :
                        <div className="detail-item cursor-pointer" onClick={()=> nft?.creatorData?.address? history.push(`/profile/${nft.creatorData.address}`) : undefined}>
                        <img src={nft?.creatorData?.avatar_img ? nft?.creatorData?.avatar_img : "/images/default-profile-cover.png"} alt="" />
                        <div className="content">
                            <p className="title">
                                NFT Creator
                            </p>
                            <p className="subtitle">
                                @{nft?.creatorData?.username}
                            </p>
                        </div>
                    </div>  
                            
            }
                                       
                </>
            )}
            <hr className="devider" />
            {showChallengeSubmission && !isTimePassed(challenge.expiresAt) && (
                <div className="detail-item">
                    <div className="styled-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 14C3.1339 14 0 10.8661 0 7C0 3.1339 3.1339 0 7 0C10.8661 0 14 3.1339 14 7C14 10.8661 10.8661 14 7 14ZM7 12.6C8.48521 12.6 9.90959 12.01 10.9598 10.9598C12.01 9.90959 12.6 8.48521 12.6 7C12.6 5.51479 12.01 4.09041 10.9598 3.0402C9.90959 1.99 8.48521 1.4 7 1.4C5.51479 1.4 4.09041 1.99 3.0402 3.0402C1.99 4.09041 1.4 5.51479 1.4 7C1.4 8.48521 1.99 9.90959 3.0402 10.9598C4.09041 12.01 5.51479 12.6 7 12.6V12.6ZM7.7 7H10.5V8.4H6.3V3.5H7.7V7Z" fill="white"/>
                    </svg>
                    </div>
                    {/* <img src="/images/default-profile-cover.png" alt="" /> */}
                    
                        <div className="content">
                        <p className="title">
                            Challenge Submission
                        </p>
                        <p className="subtitle">
                        {challenge && challenge.expiresAt ? (
                            <CountDown
                                auctionETime={parseInt(challenge.expiresAt)}
                            />
                            ) : (
                                "00d 00h 00m 00s "
                            )}
                            <span className="inner">Left</span>
                        </p>
                    </div>
                                
                </div>
            )} 
            {showSocialRequires && (challenge?.isTwitter || challenge?.isInstagram || challenge.isYoutube || challenge.isTwitch || challenge.isTiktok ) && (
                <>
                 <div className="detail-item">
                
                <div className="content ml-0">
                    <p className="title mb-2">
                        Related Social Media
                    </p>

                    <div className="d-flex">
                    {challenge?.isTwitter && (
                        <div style={{ display: 'flex', flexDirection:'row', alignItems:"center", marginBottom: 16}}>
                            {/* <img src="/images/twitter.png" alt=""  className='mr-2'/> */}
                            <div className="styled-icon mr-2">
                            <svg
                                width="17"
                                height="13"
                                viewBox="0 0 17 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <path
                                    d="M16.2492 1.54324C15.6406 1.80812 14.9952 1.98209 14.3343 2.05937C15.0309 1.64947 15.5522 1.00438 15.8012 0.244297C15.1475 0.627078 14.4308 0.895338 13.6838 1.04045C13.1821 0.512227 12.517 0.161908 11.7921 0.0439529C11.0671 -0.0740019 10.3228 0.047017 9.67496 0.388195C9.0271 0.729374 8.51195 1.2716 8.20959 1.93057C7.90724 2.58954 7.83462 3.32833 8.00303 4.0321C6.67738 3.96673 5.38053 3.62777 4.19666 3.03724C3.01279 2.4467 1.96837 1.6178 1.13122 0.604331C0.834893 1.10512 0.679173 1.67441 0.680006 2.2539C0.680006 3.39126 1.26834 4.39606 2.16279 4.98435C1.63346 4.96795 1.11578 4.8273 0.652902 4.57411V4.6149C0.653062 5.37238 0.919459 6.1065 1.40693 6.69279C1.89439 7.27907 2.57293 7.68144 3.32749 7.83167C2.83611 7.96269 2.32088 7.98201 1.82079 7.88815C2.03354 8.54016 2.44819 9.11038 3.00669 9.51897C3.56519 9.92757 4.23958 10.1541 4.93543 10.1668C4.24385 10.7012 3.45199 11.0963 2.60513 11.3294C1.75828 11.5625 0.873029 11.6291 0 11.5253C1.52399 12.4897 3.29807 13.0017 5.11001 13C11.2428 13 14.5966 8.0011 14.5966 3.66579C14.5966 3.5246 14.5926 3.38184 14.5863 3.24222C15.239 2.778 15.8025 2.20293 16.25 1.54403L16.2492 1.54324Z"
                                    fill="white"
                                />
                                </svg>
                            </div>
                            {/* <p className="subtitle">
                                Twitter Required
                            </p> */}
                        </div>
                     )} 
                    {challenge?.isInstagram && (
                        <div style={{ display: 'flex', flexDirection:'row', alignItems:"center", marginBottom: 16}}>
                        <div className="styled-icon mr-2">
                            <img src="/images/insta-inner.png" alt="" />
                        </div>
                            {/* <p className="subtitle">
                                Instagram Required
                            </p> */}
                        </div>
                    )}
                    {challenge?.isYoutube && (
                        <div style={{ display: 'flex', flexDirection:'row', alignItems:"center", marginBottom: 16}}>
                        <div className="styled-icon mr-2">
                            {/* <YouTube/> */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M20.9966 6.00125C21.2907 6.30452 21.4997 6.68004 21.6023 7.08989C21.8762 8.60869 22.0092 10.1496 21.9995 11.6928C22.005 13.213 21.872 14.7306 21.6023 16.2267C21.4997 16.6365 21.2907 17.0121 20.9966 17.3153C20.7024 17.6186 20.3334 17.8389 19.9269 17.9539C18.4415 18.3511 12.5 18.3511 12.5 18.3511C12.5 18.3511 6.55849 18.3511 5.07311 17.9539C4.67484 17.8449 4.31141 17.635 4.01793 17.3446C3.72445 17.0541 3.51084 16.6929 3.39775 16.2958C3.12379 14.777 2.9908 13.2361 3.00049 11.6928C2.99293 10.1611 3.1259 8.63188 3.39775 7.12443C3.50033 6.71458 3.70926 6.33906 4.00342 6.0358C4.29759 5.73253 4.66658 5.51227 5.07311 5.39725C6.55849 5 12.5 5 12.5 5C12.5 5 18.4415 5 19.9269 5.36271C20.3334 5.47773 20.7024 5.69799 20.9966 6.00125ZM15.5235 11.6922L10.5578 14.5161V8.86822L15.5235 11.6922Z" fill="white"/>
                            </svg>
                        </div>
                            {/* <p className="subtitle">
                                YouTube Required
                            </p> */}
                        </div>
                    )}

                    {challenge?.isTwitch && (
                        <div style={{ display: 'flex', flexDirection:'row', alignItems:"center", marginBottom: 16}}>
                        <div className="styled-icon mr-2">
                        {/* <img
                            src="/images/twitch_icon.png"
                            alt=""
                            className="mr-2"
                            /> */}
                            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.29995 3.2002L3.69995 6.4002V19.2002H7.69995V21.6002H10.9L13.3 19.2002H16.5L21.3 14.4002V3.2002H5.29995ZM6.89995 4.8002H19.7V13.6002L17.3 16.0002H12.5L10.1 18.4002V16.0002H6.89995V4.8002ZM10.9 7.2002V12.8002H12.5V7.2002H10.9ZM14.1 7.2002V12.8002H15.7V7.2002H14.1Z" fill="white"/>
                            </svg>
                        </div>
                            {/* <p className="subtitle">
                                Twitch Required
                            </p> */}
                        </div>
                    )}

                    {challenge?.isTiktok && (
                        <div style={{ display: 'flex', flexDirection:'row', alignItems:"center", marginBottom: 16}}>
                        <div className="styled-icon mr-2">
                            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.84918 1.17129C8.95906 1.06162 9.10797 1.00002 9.26322 1H11.6169C11.7618 1.00008 11.9016 1.05383 12.0092 1.15086C12.1168 1.2479 12.1846 1.38135 12.1997 1.52547C12.3914 3.35173 13.8607 4.78758 15.7039 4.91982C15.8517 4.93054 15.99 4.99684 16.0908 5.10538C16.1917 5.21391 16.2478 5.35663 16.2477 5.50482V8.24205C16.2477 8.38822 16.1931 8.52913 16.0947 8.63714C15.9962 8.74515 15.8609 8.81247 15.7154 8.82591C15.5697 8.83932 15.4175 8.8488 15.2574 8.8488C14.084 8.8488 13.0213 8.41683 12.1687 7.7349V13.0388C12.1687 16.1158 9.66125 18.6232 6.58437 18.6232C3.50741 18.6232 1 16.1158 1 13.0388C1 9.96183 3.50741 7.45443 6.58437 7.45443C6.69166 7.45443 6.78444 7.46119 6.86312 7.46693C6.88671 7.46865 6.90903 7.47027 6.9301 7.4716C7.07892 7.48093 7.21859 7.54662 7.32067 7.6553C7.42276 7.76399 7.4796 7.90749 7.47961 8.05659V10.5191C7.47971 10.602 7.4622 10.684 7.42826 10.7597C7.39432 10.8353 7.34472 10.9029 7.28272 10.958C7.22072 11.0131 7.14774 11.0544 7.0686 11.0792C6.98947 11.1039 6.90597 11.1117 6.82364 11.1018C6.78033 11.0966 6.74312 11.0918 6.71142 11.0876C6.64969 11.0796 6.60882 11.0743 6.58437 11.0743C5.49193 11.0743 4.61988 11.9464 4.61988 13.0388C4.61988 14.1312 5.49193 15.0044 6.58437 15.0044C7.68559 15.0044 8.65189 14.1349 8.65189 13.0709C8.65189 13.014 8.65302 12.3311 8.65533 11.2518C8.65643 10.7338 8.65787 10.1344 8.65941 9.49266C8.66108 8.79699 8.66287 8.05167 8.66449 7.30675C8.67064 4.44256 8.67708 1.585 8.67708 1.585C8.6774 1.42975 8.73929 1.28096 8.84918 1.17129ZM4.8688 9.01728C5.30167 8.8806 5.78024 8.79324 6.30733 8.76929V8.68281C5.79993 8.71579 5.31562 8.83164 4.8688 9.01728Z" fill="white"/>
                            </svg>
                        </div>
                        </div>
                    )}
                    </div>
                    
                    
                </div>
            </div>
            <hr className="devider" />
                </>
            )} 
           
            {showDistribution && (
                <div className="detail-item">
                <div className="styled-icon">
                    {/* <img src="/images/calender-icon.png" alt="" /> */}
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.8736 2.41016H2.3592C1.60853 2.41016 1 3.04749 1 3.83367V13.7983C1 14.5845 1.60853 15.2218 2.3592 15.2218H11.8736C12.6242 15.2218 13.2328 14.5845 13.2328 13.7983V3.83367C13.2328 3.04749 12.6242 2.41016 11.8736 2.41016Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9.83594 1V3.84703" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M4.40137 1V3.84703" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M1 6.69922H13.2328" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M5.07617 10.276L6.43537 11.6995L9.00887 9.29688" stroke="white" stroke-linecap="round"/>
                    </svg>
                </div>                
                <div className="content">
                    <p className="title">
                        Airdrop Distribution
                    </p>
                    <p className="subtitle">
                        {new Date(parseInt(challenge?.airdropStartAt)).toDateString()} <span className="inner">to</span> {new Date(parseInt(challenge?.airdropEndAt)).toDateString()}
                    </p>
                </div>
            </div>
            )}
        </div>
    );
};

export default ChallengeDetails;