import axios from 'axios';

//const baseURL = ""

export function request(config){
    //创建axios实例
    const instance=axios.create({
        baseURL:"http://123.207.32.32:8000",
        timeout:20000
    })

    //请求前拦截
    instance.interceptors.request.use(config=>{
        return config
    },err=>{
        console.log(err)
    })

    return instance(config)
}