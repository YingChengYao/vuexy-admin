import axios from "axios";
import router from "@/router/router";
import { getToken } from "@/common/utils/auth/token";
import vue from "@/main.js";
import '@/common/global'

const request = axios.create({
  //baseURL: "http://manage.qrtj.cn",
  //baseURL: "http://localhost:5000",
  //baseURL: "http://managea.tijian.cn",
  baseURL: global.baseURL,
  timeout: 20000
});

//#region http request 拦截器
request.interceptors.request.use(
  config => {
    //this.$vs.loading();
    let curTime = new Date();
    let accessExpiration = window.localStorage.getItem("AccessExpiration");
    let refreshExpiration = window.localStorage.getItem("RefreshExpiration");

    let accesstime = new Date(Date.parse(accessExpiration));
    let refreshtime = new Date(Date.parse(refreshExpiration));

    const token = getToken();
    if (token && curTime > accesstime && curTime < refreshtime) {
      //重新请求token  TODO
    } else if (token && curTime > accesstime && curTime > refreshtime) {
      //跳转到登录页 TODO
      router.push({
        path: "/pages/login"
        //query: { redirect: router.currentRoute.fullPath }
      });
    } else if (token && curTime < accesstime && curTime < refreshtime) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = "Bearer " + token;
    }

    return config;
  },
  error => {
    vue.$vs.notify({
      title: "Error",
      text: error.message,
      iconPack: "feather",
      icon: "icon-alert-circle",
      color: "danger"
    });
    return Promise.reject(error);
  }
);
//#endregion

//#region http response 拦截器
request.interceptors.response.use(
  response => {
    const data = response.data;
    if (!data.resultType && data.resultType != 0) {
      return data; //TODO 路由MOCK使用，后期拿掉
    }
    if (data.resultType != 0) {
      vue.$vs.notify({
        title: "Error",
        text: data.message,
        iconPack: "feather",
        icon: "icon-alert-circle",
        color: "danger"
      });
    }

    return data;
    //TODO 401处理
  },
  error => {
    debugger;
    console.log("err:", error.message);
    // this.$vs.loading.close();
    vue.$vs.notify({
      title: "Error",
      text: error.message,
      iconPack: "feather",
      icon: "icon-alert-circle",
      color: "danger"
    });
    //TODO 401处理
    return Promise.reject(error);
  }
);
//#endregion
export default request;
