import { requestLogin } from "@/http/auth";
import router from "@/router/router";
import { setUserToken, isAuthenticated } from "@/common/utils/auth/token";

const state = {
  isUserLoggedIn: () => {
    return localStorage.getItem("userInfo") && isAuthenticated();
  },
};

const mutations = {};

const actions = {
  login({ commit }, payload) {
    return new Promise((resolve, reject) => {
      requestLogin(payload.userDetails.username, payload.userDetails.password)
        .then((response) => {
          // If there's user data in response
          if (response.userData) {
            // Set accessToken
            //localStorage.setItem("accessToken", response.data.accessToken);
            const token = response.accessToken;
            const accessTime = response.accessExpiration;
            const refreshTime = response.refreshExpiration;
            setUserToken(token, accessTime, refreshTime);

            // Navigate User to homepage
            router.push(router.currentRoute.query.to || "/");

            // Update user details
            commit("UPDATE_USER_INFO", response.userData, { root: true });

            resolve(response);
          } else {
            reject({ message: "Wrong Email or Password" });
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
