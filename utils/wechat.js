import {wechatSession,userInfo,initUser, wxSession, wechatUserInfo} from '../service/index'
const { globalData } = getApp()
const { appId } = globalData
const {merchantCode} = wx.getExtConfigSync() || {}
const app = getApp()

// 微信登录
export const wxLogin = async (detail) => {
  const  {encryptedData, iv} = detail
  const params = {encryptedData, iv, appId}
  const checkStatus = await checkSession()
  // 解密参数获取
  return checkStatus ? {...params,code:wx.getStorageSync('jsCode'),sessionKey:wx.getStorageSync('sessionKey')} : loginSession(params)
}

// 微信登陆获取sessionKey
export const loginSession = async (params) => {
  const {code} = await wx.login()
  const session = await wxSession({jsCode:code,appId})
  if(session.code === 0) {
    const {session_key,unionid:unionId,openid:openId} = session.result
    wx.setStorageSync('session',  session.result)
    wx.setStorageSync('sessionKey', session_key)
    wx.setStorageSync('jsCode', code)
    wx.setStorageSync('session', session.result)
    unionId && syncUserInfo({openId,unionId})
    return {...params,code,sessionKey:session_key}
  }
}

// 检测sessionKey是否过期
export const checkSession = async () => {
  return (wx.getStorageSync('sessionKey') && wx.getStorageSync('jsCode')) ? await wx.checkSession() : false
}

// 解密微信用户信息(userInfo、phoneNumber)
export const getPhoneNumber = async (detail) =>{
  const params = await wxLogin(detail)
  try{
    const res = await wechatUserInfo(params)
    if(res.result){
      const {phoneNumber:tel,countryCode} = res.result
      wx.setStorageSync('phone', tel)
      tel && syncUserInfo({tel,countryCode})
    }
    if(res.code == 'FAILED') app.tip(res.msg)
    return res.result ? res.result : res
  } catch {
    return false
  }
}

// 用户已授权微信用户信息
export const wxUserInfo = async () => {
  try{
    const info = await wx.userInfo()
    return info.userInfo
  } catch (err) {
    console.warn(err)
    return false
  }
}

// 用户初始化 同步用户信息数据
export const syncUserInfo = async (params) =>{
  // memberId,openId,unionId,tel 必填其中一项
  const {memberId,openId,unionId,tel} = params
  let userData = {}
  if(memberId || openId || unionId || tel){
    // merchatCode ,status	,headImgUrl	,name	,nickName,tel	,country	,province	,city	,memberId	,openId	,unionId	,sex, countryCode
    try{
      const {userInfo} = await wx.getUserInfo({lang: 'zh_CN'})
      const {nickName,avatarUrl:headImgUrl,gender:sex,province,city,country} = userInfo
      userData = {...params,headImgUrl,sex,province,city,country,countryCode,nickName}
      const res = await initUser({merchantCode,...userData,status:0})
      return res
    }catch{
      
    }
  }
}

// 查询用户信息
export const getUserInfo = async (data) => {
  const res = await userInfo(data)
  return res
}