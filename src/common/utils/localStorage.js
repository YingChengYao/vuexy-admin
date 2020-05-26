//localStorage 存储数组对象的方法
export function saveObjArr(name, data) {
    sessionStorage.setItem(name, JSON.stringify(data))
}

//localStorage 获取数组对象的方法
export function getObjArr(name) {
    return JSON.parse(window.sessionStorage.getItem(name));
}