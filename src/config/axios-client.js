import axios from 'axios'
import store from '../store'
import qs from 'qs'
import * as types from '../store/mutation-types'
import router from '../router/client'
import loading from "../components/loading/index.js"
let vm = loading()
const server = axios.create({
    // baseURL:document.location.origin,
    // baseURL:"http://testclubshop.liantuobank.com",
     timeout:60000,
     withCredentials:false
 })
 
 
 server.interceptors.request.use((config)=>{
     if(config.method.toUpperCase() == "GET"){
        // config.params = {...config.data}
     }else if(config.method.toUpperCase() == "POST"){
        //  console.log("请求拦截器")
         config.headers["content-type"] = "application/x-www-form-urlencoded";
         config.data = qs.stringify(config.data)
     }
     
     vm.handlemount();
 
     return config;
 },(err)=>{
     Promise.reject(err);
 })
 
 
 server.interceptors.response.use((res)=>{
    //  console.log(res,"响应拦截器")
     if(res.status == 200){
        vm.handleDestory();
        
         return res.data
     }
 
 },(err)=>{
     Promise.reject(err);
 })
 
 export default (method,url,data={})=>{
     if(method.toUpperCase() == "GET"){
        
         return server.get(url,{
             params:data
         })
     }else if(method.toUpperCase() == "POST"){
        //  console.log(data,"post请求")
         return server.post(url,data);
     }
 }