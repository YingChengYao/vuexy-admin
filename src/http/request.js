import axios from "axios";
import router from "@/router/router";
import { getToken } from "@/common/utils/auth/token";

const request = axios.create({
  baseURL: "http://manage.qrtj.cn",
  //baseURL: "http://localhost:8081",
  timeout: 20000
});

//http request 拦截器
request.interceptors.request.use(
  config => {
    debugger;
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
      //跳转到登录页 TODO this无$router
      router.push({
        path: "/pages/login",
        //query: { redirect: router.currentRoute.fullPath }
      });
    } else if (token && curTime < accesstime && curTime < refreshtime) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = "Bearer " + token;
    }

    // config.data = JSON.stringify(config.data);
    // config.headers = {
    //     'Content-Type': 'application/json',
    // }
    return config;
  },
  error => {
    // this.$vs.loading.close();
    // this.$vs.notify({
    //   title: "Error",
    //   text: error.message,
    //   iconPack: "feather",
    //   icon: "icon-alert-circle",
    //   color: "danger",
    // });
    return Promise.reject(error);
  }
);

//http response 拦截器
request.interceptors.response.use(
  response => {
    debugger
    //this.$vs.loading.close();
    const data= response.data;
    let message="";
    if(!data.resultType && data.resultType!=0){
      return data
    }
    if(data.resultType!=0){
      return null;
    }
    
    message=JSON.parse(data.message)
    return message
    //TODO 401处理
    // if (response.data.code == 0 || response.headers.success === "true") {
    //   return response.data;
    // } else {
    //   Message({
    //     showClose: true,
    //     message: response.data.msg || decodeURI(response.headers.msg),
    //     type: "error",
    //   });
    //   if (response.data.data && response.data.data.reload) {
    //     store.commit("user/LoginOut");
    //   }
    //   return Promise.reject(response.data.msg);
    // }
  },
  error => {
    // this.$vs.loading.close();
    // this.$vs.notify({
    //   title: "Error",
    //   text: error.message,
    //   iconPack: "feather",
    //   icon: "icon-alert-circle",
    //   color: "danger",
    // });
    //TODO 401处理
    return Promise.reject(error);
  }
);

export default request;
