import request from "./request";

export const requestLogin = (name, pwd) => {
  debugger;
  return request("/auth/login", {
    username: name,
    password: pwd,
  });
};
