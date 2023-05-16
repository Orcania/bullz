export const S3Config = {
  bucketName: process.env.REACT_APP_BUCKET_NAME,
  region: process.env.REACT_APP_REGION,
  accessKeyId:process.env.REACT_APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY_ID,
};

export const shares = {
  art: 1,
  tiktok_duet: 2,
  tiktok_collab: 3,
  merchandise: 4,
  event_tickets: 5,
  music_promo: 6,
  exclusive_content: 7,
  nft_challenge: 8,
};
export const nft_url_contract_type=[
  'tiktok_duet', 
  'tiktok_collab',
  'music_promo'
]