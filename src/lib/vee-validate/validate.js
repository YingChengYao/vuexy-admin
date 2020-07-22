import Vue from "vue";
import VeeValidate, { Validator } from "vee-validate";

Vue.use(VeeValidate);

const formatFileSize = function(size) {
  let units = ["Byte", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let threshold = 1024;
  size = Number(size) * threshold;
  let i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(threshold));
  return (size / Math.pow(threshold, i)).toFixed(2) * 1 + " " + units[i];
};
const fieldName = "";

Validator.localize("zh_CN", {
  name: "zh_CN",
  attributes: {},
  messages: {
    _default: () => `${fieldName}无效`,
    after: (field, [target]) => `${fieldName}必须在${target}之后`,
    alpha_dash: () => `${fieldName}能够包含字母数字字符、破折号和下划线`,
    alpha_num: () => `${fieldName}只能包含字母数字字符`,
    alpha_spaces: () => `${fieldName}只能包含字母字符和空格`,
    alpha: () => `${fieldName}只能包含字母字符`,
    before: (field, [target]) => `${fieldName}必须在${target}之前`,
    between: (field, [min, max]) => `${fieldName}必须在${min}与${max}之间`,
    confirmed: (field, [confirmedField]) =>
      `${fieldName}不能和${confirmedField}匹配`,
    credit_card: () => `${fieldName}格式错误`,
    date_between: (field, [min, max]) => `${fieldName}必须在${min}和${max}之间`,
    date_format: (field, [format]) => `${fieldName}必须符合${format}格式`,
    decimal: (field, [decimals = "*"] = []) =>
      `${fieldName}必须是数字，且能够保留${
        decimals === "*" ? "" : decimals
      }位小数`,
    digits: (field, [length]) =>
      `${fieldName}必须是数字，且精确到${length}位数`,
    dimensions: (field, [width, height]) =>
      `${fieldName}必须在${width}像素与${height}像素之间`,
    email: () => `${fieldName}不是一个有效的邮箱`,
    ext: () => `${fieldName}不是一个有效的文件`,
    image: () => `${fieldName}不是一张有效的图片`,
    included: () => `${fieldName}不是一个有效值`,
    integer: () => `${fieldName}必须是整数`,
    ip: () => `${fieldName}不是一个有效的地址`,
    length: (field, [length, max]) => {
      if (max) {
        return `${fieldName}长度必须在${length}到${max}之间`;
      }
      return `${fieldName}长度必须为${length}`;
    },
    max: (field, [length]) => `${fieldName}不能超过${length}个字符`,
    max_value: (field, [max]) => `${fieldName}必须小于或等于${max}`,
    mimes: () => `${fieldName}不是一个有效的文件类型`,
    min: (field, [length]) => `${fieldName}必须至少有${length}个字符`,
    min_value: (field, [min]) => `${fieldName}必须大于或等于${min}`,
    excluded: () => `${fieldName}不是一个有效值`,
    numeric: () => `${fieldName}只能包含数字字符`,
    regex: () => `${fieldName}格式无效`,
    required: () => `${fieldName}不能为空`,
    size: (field, [size]) => `${fieldName}必须小于${formatFileSize(size)}`,
    url: () => `${fieldName}不是一个有效的url`
  }
});

// // 手机号码验证
// Validator.extend("mobile", {
//   getMessage: () => `请输入正确的手机号码`,
//   validate: value =>
//     value.length === 11 &&
//     /^(((13[0-9]{1})|(14[57]{1})|(15[012356789]{1})|(17[03678]{1})|(18[0-9]{1})|(19[89]{1})|(16[6]{1}))+\d{8})$/.test(
//       value
//     )
// });
// 0-100
Validator.extend("numsection", {
  getMessage: field => field + "只能是0-100",
  validate: value => /^100$|^(\d|[1-9]\d)(\.\d+)*$/.test(value)
});
//手机号码
Validator.extend("mobile", {
  getMessage: () => `请输入正确的手机号码`,
  validate: value => !!/^1[0-9]{10}$/.test(value)
});
//电话
Validator.extend("phone", {
  getMessage: () => `请输入正确的电话号码`,
  validate: value => !!/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(value)
});
//6位手机短信验证码
Validator.extend("msg_code", {
  getMessage: field => field + " 格式不正确",
  validate: value => !!/^[a-zA-Z0-9]{6}$/.test(value)
});
//昵称
Validator.extend("nick_name", {
  getMessage: field => field + " 只能包含字母、数字或中文",
  validate: value => !!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)
});
//身份证
Validator.extend("id_card_no", {
  getMessage: field => field + " 格式不正确",
  validate: value =>
    !!/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
      value
    )
});
