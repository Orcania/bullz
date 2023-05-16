export default function mainAuthHeader() {
    const access_token = sessionStorage.getItem('main_access_token');
  
    if (access_token) {
      return { Authorization: 'Bearer ' + access_token };
    } else {
      return {};
    }
  }