export default function authHeader() {
    const access_token = sessionStorage.getItem(process.env.REACT_APP_USER_CHAT_TOKEN_KEY);
  
    if (access_token) {
      return { Authorization: 'Bearer ' + access_token };
    } else {
      return {};
    }
  }