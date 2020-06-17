import validate, { Validator } from "vee-validate";

const zh = {
  after: (field, [target]) => ` ${field}必须在${target}之后`,
  alpha_dash: field => ` ${field}能够包含字母数字字符，包括破折号、下划线`,
  alpha_num: field => `${field} 只能包含字母数字字符.`,
  alpha_spaces: field => ` ${field} 只能包含字母字符，包括空格.`,
  alpha: field => ` ${field} 只能包含字母字符.`,
  before: (field, [target]) => ` ${field} 必须在${target} 之前.`,
  between: (field, [min, max]) => ` ${field} 必须在${min} ${max}之间.`,
  confirmed: (field, [confirmedField]) =>
    ` ${field} 不能和${confirmedField}匹配.`,
  date_between: (field, [min, max]) => ` ${field}必须在${min}和${max}之间.`,
  date_format: (field, [format]) => ` ${field}必须在在${format}格式中.`,
  decimal: (field, [decimals] = ["*"]) =>
    ` ${field} 必须是数字的而且能够包含${
      decimals === "*" ? "" : decimals
    } 小数点.`,
  digits: (field, [length]) => ` ${field} 必须是数字，且精确到 ${length}数`,
  dimensions: (field, [width, height]) =>
    ` ${field}必须是 ${width} 像素到 ${height} 像素.`,
  email: field => ` ${field} 必须是有效的邮箱.`,
  ext: field => ` ${field} 必须是有效的文件.`,
  image: field => ` ${field} 必须是图片.`,
  in: field => ` ${field} 必须是一个有效值.`,
  ip: field => ` ${field} 必须是一个有效的地址.`,
  max: (field, [length]) => ` ${field} 不能大于${length}字符.`,
  mimes: field => ` ${field} 必须是有效的文件类型.`,
  min: (field, [length]) => ` ${field} 必须至少有 ${length} 字符.`,
  not_in: field => ` ${field}必须是一个有效值.`,
  numeric: field => ` ${field} 只能包含数字字符.`,
  regex: field => ` ${field} 格式无效.`,
  required: field => `${field} 是必须的.`,
  size: (field, [size]) => ` ${field} 必须小于 ${size} KB.`,
  url: field => ` ${field}不是有效的url.`
};
// 0-100
Validator.extend("numsection", {
  getMessage: field => field + "只能是0-100",
  validate: value => /^100$|^(\d|[1-9]\d)(\.\d+)*$/.test(value)
});
//手机号码
Validator.extend("phone", {
  getMessage: field => field + " 格式不正确",
  validate: value =>
    !!/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(
      value
    )
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
  validate: value => !!/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)
});

const config = {
  errorBagName: "errors", // change if property conflicts
  fieldsBagName: "fieldsBag",
  locale: "zh_CN",
  dictionary: {
    zh_CN: {
      messages: zh
    }
  }
};
export { config };
export default validate;
