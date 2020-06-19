import { requestLogin } from "@/http/auth";
import router from "@/router/router";
import { clone } from "@/common/utils/data/clone";
import { setUserToken, isAuthenticated } from "@/common/utils/auth/token";

const state = {
  isUserLoggedIn: () => {
    return localStorage.getItem("userInfo") && isAuthenticated();
  },
  btnPermission: []
};

const mutations = {
  SET_BUTTONS: (state, btns) => {
    //return localStorage.getItem("userInfo") && isAuthenticated();
    state.btnPermission = clone(btns);
  }
};

const actions = {
  login({ commit }, payload) {
    return new Promise((resolve, reject) => {
      requestLogin(payload.userDetails.username, payload.userDetails.password)
        .then(res => {
          debugger;
          // If there's user data in response
          if (res) {
            // Set accessToken
            //localStorage.setItem("accessToken", response.data.accessToken);
            debugger;
            const {
              userData,
              accessToken,
              accessExpiration,
              refreshExpiration,
              buttons
            } = res;
            userData.mecID = "6467685114320248832";
            // const token = res.accessToken;
            // const accessTime = res.accessExpiration;
            // const refreshTime = res.refreshExpiration;
            setUserToken(accessToken, accessExpiration, refreshExpiration);
            //setUserToken(token, accessTime, refreshTime);
            commit("UPDATE_USER_INFO", userData, { root: true });

            commit("SET_BUTTONS", buttons);

            // Navigate User to homepage
            router.push(router.currentRoute.query.to || "/");

            // Update user details

            resolve(res);
          } else {
            reject({ message: "Wrong Email or Password" });
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
