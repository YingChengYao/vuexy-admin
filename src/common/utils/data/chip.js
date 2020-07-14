// 对vs-chip的扩展，将状态值改为对应的颜色

//婚姻状态
export function getMarriageColor(status) {
  if (status === 0) return "success";
  if (status === 1) return "warning";
  if (status === 2) return "danger";
  return "success";
}
//性别
export function getGenderColor(status) {
  if (status === 0) return "success";
  if (status === 1) return "warning";
  if (status === 2) return "danger";
  return "success";
}
//婚姻状态(个人)
export function getMarriageForUserColor(status) {
  if (status === 1) return "primary";
  if (status === 2) return "success";
  if (status === 3) return "danger";
  if (status === 4) return "warning";
  return "primary";
}
//性别(个人)
export function getGenderForUserColor(status) {
  if (status === 0) return "primary";
  if (status === 1) return "success";
  return "primary";
}
