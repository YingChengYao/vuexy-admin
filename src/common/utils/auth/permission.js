import store from "@/store/store.js";

// 用来控制按钮的显示
export function hasBtnPermission(permission) {
  debugger

  const myBtns = store.getters.btnPermission;
  return myBtns.indexOf(permission) > -1;
}
