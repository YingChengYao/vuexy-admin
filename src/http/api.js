import request from "./request";

export function getRoutes() {
  return request({
    url: "/route/getRoutes",
    method: "get",
  });
}
