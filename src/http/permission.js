import request from "./request";

export function getMenus() {
  return request({
    url: "/permission/getMenus",
    method: "get",
  });
}
