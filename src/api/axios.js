import axios from 'axios'
//定义常量
const HOST = "http://127.0.0.1:8000"
// const HOST = "http://guanghedata.natapp1.cc"


const instance = axios.create({
    baseURL: HOST,
})

export default instance

// 接口
