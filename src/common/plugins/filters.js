import { formatTimeToStr } from "@/common/utils/data/date";

/**
 * 时间格式转换
 * @param time  转换的字符串对象
 * @param formatStr 要转换的时间格式，默认yyyy-MM-dd hh:mm:ss
 * @return {String}
 */
const formatDate = function(time, formatStr) {
  if (time != null && time != "") {
    var date = new Date(time);
    return formatTimeToStr(date, formatStr);
  } else {
    return "";
  }
};

export { formatDate };
