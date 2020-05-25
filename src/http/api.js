import { request } from "./request";

export function getName() {
  return request({
    url: "/decision/getName",
    method: "get"
  });
}

export function getRoutes() {
  return request({
    url: "/route/getRoutes",
    method: "get",
  });
}
