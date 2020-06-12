import request from "./request";

export const requestLogin = (name, pwd) => {
  return request("/auth/login", {
    username: name,
    password: pwd,
  });
};
