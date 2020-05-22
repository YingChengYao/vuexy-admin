import { request } from "./request";

export function getName() {
  return request({
    url: "/decision/getName",
    method: "get"
  });
}
