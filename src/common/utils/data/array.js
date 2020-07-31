// 将数组转换成tree结构数组
export function composeTree(list = [], field, parentField) {
  const data = JSON.parse(JSON.stringify(list)); // 浅拷贝不改变源数据
  const result = [];
  if (!Array.isArray(data)) {
    return result;
  }
  data.forEach(item => {
    delete item.children;
  });
  const map = {};
  data.forEach(item => {
    map[item[field]] = item;
  });
  data.forEach(item => {
    const parent = map[item[parentField]];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}
