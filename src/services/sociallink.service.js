// import axios from "axios";
// const URL_CREATE_USER_TOKEN = "/v1/sdk-tokens";
// const URL_CREATE_USER = "/v1/users";
// const URL_USER_PROFILE = "/v1/profiles"

// const getAxiosInstance = () => {
//   const api = axios.create({
//     baseURL: process.env.REACT_APP_PHYLLO_BASE_URL,
//     auth: {
//       username: process.env.REACT_APP_PHYLLO_CLIENT_ID,
//       password: process.env.REACT_APP_PHYLLO_SECRET_ID,
//     },
//   });
//   return api;
// };

// export async function createUser(name, externalId) {
//   try {

//     // const userId = localStorage.getItem("PHYLLO_USERID", '');

//     // if (userId) {
//     //   return userId;
//     // }
//     const api = getAxiosInstance();
//     let response = await api.post(URL_CREATE_USER, {
//       name: name,
//       external_id: externalId,
//     }); 
    
//     // localStorage.setItem("PHYLLO_USERID", response.data.id);
//     return response.data.id;
//   } catch (err) {
//     console.error(`Error ${err} occurred while generating user token`);
//     return err.body;
//   }
// };

// export async function createUserToken(userId) {
//   if (!userId) {
//     let err = new Error("User id cannot be blank or null");
//     throw err;
//   }
//   try {
//     const api = getAxiosInstance();
//     let response = await api.post(URL_CREATE_USER_TOKEN, {
//       user_id: userId,
//       products: ["IDENTITY"],
//     });
//     return response.data.sdk_token;
//   } catch (err) {
//     console.error(`Error ${err} occurred while generating user token`);
//     return err.body;
//   }
// };

// export async function getUserProfile(accountId) {
//   try {
//     const api = getAxiosInstance();
//     let response = await api.get(`${URL_USER_PROFILE}?account_id=${accountId}`); 
    
//     return response.data?.data;
//   } catch (err) {
//     console.error(`Error ${err} occurred while generating user token`);
//     return err.body;
//   }
// }
