import { memberGet, getUser, operateMemberCrowd, merchantCouponList, timesCardList, sendPrize } from '../../../api/index.js'
const app = getApp()
Page({
  data: {
    memberCrowd:[],
    crowd:[]
  },

  onLoad (options) {
    this.setData({
      ...options
    })
    this.tagList({
      type: 3,
      memberId: options.id
    })
    .then(res=>{
      let memberCrowd= [], crowd = []
      if(res.memberCrowd.length){
        res.memberCrowd.map(item=>{
          if(item.crowdType == 1){
            crowd.push({...item,checked:true})
          }else{
            memberCrowd.push(item)
          }
        })
      }
      this.setData({
        memberCrowd,
        crowd
      })
      wx.nextTick(()=>{
        this.tagList({
          type: 4
        })
        .then(res=>{
          let { crowd } = this.data
          console.log(crowd)
          let list =[]
          if(crowd.length > 0){
            res.memberCrowd.map(item=>{
              item.checked = crowd.some(itm=>itm.crowdId == item.crowdId)
              return item
            })
          }else{
            list = res.memberCrowd.map(item=> {
              item.checked = false
              return item
            })
          }
          this.setData({
            crowd: res.memberCrowd,
            loading:false
          })
        })
      })
    })
  },
  
  tagList(arg={}){
    return operateMemberCrowd({
      ...arg,
      merchantCode: app.commonParams('appId')  
    })
  },

  saveMark(checked, crowdId){
    // 1、给会员添加手动标签，2、删除会员的手动标签
    return operateMemberCrowd({
      memberId:this.data.id,
      merchantCode: app.commonParams('appId'),
      type: checked ? 1 :2,
      crowdId
    }).then(res => {
      console.log(res)
    })
  },

  markOk(){
    const currpage = app.currPage(2)
    currpage.operateMemberCrowd(this.data.id).then(res=>{
      currpage.setData({
        ...res
      })
    })
    wx.navigateBack()
  },

  toggleTag({target}){
    console.log(target)
    const {index,id} = target.dataset
    const checked = !this.data.crowd[index].checked
    this.setData({
      [`crowd[${index}].checked`]: checked
    })
    this.saveMark(checked,id)
  }
})