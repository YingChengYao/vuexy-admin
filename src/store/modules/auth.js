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
      requestLogin(payload.userDetails)
        .then(res => {
          debugger;
          // If there's user data in response
          if (res && res.resultType == 0) {
            const data = JSON.parse(res.message);

            // Set accessToken
            //localStorage.setItem("accessToken", response.data.accessToken);

            // const {
            //   userData,
            //   accessToken,
            //   accessExpiration,
            //   refreshExpiration,
            //   buttons
            // } = res;
            // userData.mecID = "6467685114320248832";
            // userData.companyID = "6750305733891072000";
            const userData = {
              userId: data.UserID,
              userNickName: data.UserNickName,
              userName: data.UserName,
              unitId: data.UnitID,
              accessToken: data.Token,
              //unitId: "6467685114320248832"
            };

            // const token = res.accessToken;
            // const accessTime = res.accessExpiration;
            // const refreshTime = res.refreshExpiration;
            //setUserToken(accessToken, accessExpiration, refreshExpiration);
            setUserToken(userData.accessToken);
            commit("UPDATE_USER_INFO", userData, { root: true });

            //设置按钮权限
            //commit("SET_BUTTONS", buttons);

            // Navigate User to homepage
            router.push(router.currentRoute.query.to || "/");
          } else {
          }
          resolve(res);
        })
        .catch(error => {
          console.log("error:", error);
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
