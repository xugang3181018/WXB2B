// pages/retail/fastCheck/fastCheckInfo/fastCheckInfo.js
import {
  selectFastRecordDetailsAll,
  saveFastRecord,
  updateFastRecord,
  delFastRecord,
  getByBarcode
} from "../../../../api/index"
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fsatCheckStatus: ["待提交", "待审核", "已完成"],
    cpmBtn: false,
    alter: false,
    remark:"",
    current: 0,
    just:0,
    lose:0,
    wait:0,
    isPX:app.systemInfo.isPX,
    deleteList : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.recordNo,app)
    let recordNo = options.recordNo
    this.setData({
      recordNo,
    })
    if (recordNo) {
      this.getSelectFastRecordDetailsAll(recordNo)
    }else{
      this.setTitle("新建快速盘点单")
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let fastCheckGoods = wx.getStorageSync('fastCheckList') || []
    let loginInfo = wx.getStorageSync('login')
    this.setData({
      fastCheckGoods,
      list:fastCheckGoods,
      ...loginInfo,
    })
    this.statusGoodsNum(fastCheckGoods)
    this.getSumData()
  },

    // 动态修改标题
    setTitle(tltle) {
      wx.setNavigationBarTitle({
        title: tltle,
      })
    },

  // 获取盘点单的详情
  getSelectFastRecordDetailsAll(recordNo) {
    let params = {
      recordNo,
      operationType: 1
    }
    selectFastRecordDetailsAll(params).then(res => {
      console.log(res, "快速盘点单详情")
      if (res.code == "SUCCESS") {
        let data = res.result
        this.setData({
          fastCheckDetail: data,
          fastCheckGoods: data.shopGoodsInventoryDetailsResponseList,
          list:data.shopGoodsInventoryDetailsResponseList
        })
        this.statusGoodsNum(data.shopGoodsInventoryDetailsResponseList)
        this.getSumData()
        wx.setStorageSync('fastCheckList', data.shopGoodsInventoryDetailsResponseList)
      }
    })
  },

  //切换盘点单的状态
  toggleTab(e) {
    console.log(this.data.current)
    let index = this.data.current
    if(e){
      this.setData({
        current: e.target.id
      })
      index = e.target.id
    }
    let {
      fastCheckGoods
    } = this.data,  list = [];
    fastCheckGoods.map(item => {
      if (index == 0) {
        list.push(item)
      } else if (index == 1 && item.profitType == 0) {
        list.push(item)
      } else if (index == 2 && item.profitType == 1) {
        list.push(item)
      } else if (index == 3 && item.profitType == 2) {
        list.push(item)
      }
    })
    if (index != 0 && !list.length) {
      wx.showToast({
        title: '暂无数据',
        icon: "none"
      })
    }
    console.log(list)
    this.setData({
      list,
    })
  },

    //盘点状态的商品数
    statusGoodsNum(list){
      let  justList=[],
      loseList=[],
      waitList=[];
      list.map(item=>{
        if(item.profitType == 0){
          justList.push(item)
        }else if(item.profitType == 1){
          loseList.push(item)
        }else if(item.profitType == 2){
          waitList.push(item)
        }
      })
      this.setData({
        just:justList.length,
        lose:loseList.length,
        wait:waitList.length
      })
    },

  //添加盘点商品
  onAdd() {
    this.setData({
      cpmBtn: true
    })
  },

  //扫码出库
  onScan() {
    let {
      recordNo
    } = this.data,that = this;
    // this.setData({
    //   cpmBtn: false,
    //   alter: recordNo ? true : false
    // })
    wx.scanCode({
      success(res) {
        console.log(res)
        if (res.result) {
          // app.pageType = 3
          that.getByBarcode(res.result)
          // wx.navigateTo({
          //   url: `/pages/retail/Inventory/lnventoryGoods/lnventoryGoods?goodsBarcode=${res.result}`,
          // })
        }
      }
    })
  },

    //根据条码获取商品
    getByBarcode(goodsBarcode) {
      let {
        recordNo
      } = this.data
      let {
        merchantCode
      } = wx.getStorageSync('login')
      getByBarcode({
        merchantCode,
        goodsBarcode
      }).then(res => {
        if (res.code == "SUCCESS") {
          this.setData({
            cpmBtn: false,
            alter: recordNo ? true : false
          })
          app.pageType = 3
          let goods = JSON.stringify(res.result)
          wx.navigateTo({
            url: `/retailPages/pages/Inventory/lnventoryGoods/lnventoryGoods?goodsDetail=${goods}&goodsBarcode=${goodsBarcode}`,
          })
        } else {
          app.tip(res.msg)
        }
        console.log(res, "根据条码获取商品")
      })
    },

  // 手动选择
  onManual() {
    let {
      recordNo
    } = this.data
    this.setData({
      cpmBtn: false,
      alter: recordNo ? true : false
    })
    app.pageType = 3
    wx.navigateTo({
      url: `/retailPages/pages/stock/selectStockGoods/selectStockGoods`,
    })
  },

  //取消
  onDeselect() {
    this.setData({
      cpmBtn: false,
      alter: false
    })
  },

  //计算总盈亏数和盘点商品量
  getSumData() {
    let {
      fastCheckGoods
    } = this.data, profitStock = 0, profitMoney = 0;
    if (fastCheckGoods.length) {
      fastCheckGoods.map(item => {
        console.log(item)
        profitStock += item.profitStock
        profitMoney += Number((item.goodsCostPrice || 0)*item.profitStock)
      })
    }
    this.setData({
      profitStock,
      profitMoney: profitMoney.toFixed(2)
    })
  },

  //删除某个商品
  delete({
    target
  }) {
    console.log(target)
    let goodsId = Number(target.id),
      {
        recordNo,
        fastCheckGoods,
        list,
        deleteList
      } = this.data,that = this,idx = target.dataset.index;
      let index = fastCheckGoods.findIndex(item=>(item.goodsId === goodsId))
      if(index < 0 ){
        return 
      }
      console.log(goodsId,index)
      wx.showModal({
        title: '提示',
        content: '确定要删除吗？',
        success(res) {
          if (res.confirm) {
            if(recordNo){
              deleteList.push(fastCheckGoods[index])
            }
            console.log(deleteList)
            fastCheckGoods.splice(index, 1)
            that.setData({
              fastCheckGoods,
              deleteList,
              alter:true
            })
            wx.setStorageSync('fastCheckList', fastCheckGoods)
            that.getSumData()
            that.toggleTab()
            that.statusGoodsNum(fastCheckGoods)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    // if (recordNo) {
    //   this.getUpdateFastRecord(1, index)
    // } else {
      // fastCheckGoods.splice(index, 1)
      // this.setData({
      //   fastCheckGoods,
      //   alter:true
      // })
      // wx.setStorageSync('fastCheckList', fastCheckGoods)
    // }

  },

  //删除快速盘点单
  deleteStock() {
    let {
      recordNo
    } = this.data,that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          delFastRecord({
            recordNo
          }).then(res => {
            if (res.code == "SUCCESS") {
              wx.navigateBack()
            }
            console.log(res, "删除快速盘点单")
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  
  },
  

  //跳转商品详情页
  redactGoods({
    currentTarget
  }) {
    let that = this
    let {fastCheckDetail,recordNo,deleteList} = this.data
    if(recordNo && fastCheckDetail.status == 2)return
    if(deleteList && deleteList.length){
      app.tip("请先修改删除信息")
      return
    }
    wx.showModal({
      title: '提示',
      content: '确定要修改吗',
      success(res) {
        if (res.confirm) {
          let item = currentTarget.dataset.item
          that.getByBarcode(item.goodsBarcode)
          // console.log(item)
          // app.pageType = 3
          // that.setData({
          //   alter: true
          // })
          // wx.setStorageSync('goodsDetail', item)
          // wx.navigateTo({
          //   url: `/pages/retail/Inventory/lnventoryGoods/lnventoryGoods`,
          // })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  // 获取备注内容(失焦事件)
  getRemark({
    detail
  }) {
    console.log(detail,detail.value, "备注内容")
    this.setData({
      remark: detail.value,
    })
  },

  // 生成快速盘点单
  newSaveFastRecord() {
    let {
      merchantCode,
      operatorId,
      remark
    } = this.data
    console.log(remark)
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定要提交吗',
      success(res) {
        if (res.confirm) {
          let params = {
            merchantCode,
            operatorId,
            status:1,
            remark: remark || "",
            inventoryRecordGoodsData: app.base.fastCheckGoods(that.data.fastCheckGoods, 0)
          }
          saveFastRecord(params).then(res => {
            console.log(res, "生成快速盘点单")
            if (res.code = "SUCCESS") {
              that.setData({
                recordNo: res.result,
                alter:false
              })
              that.getSelectFastRecordDetailsAll(res.result)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  //修改快速盘点单
  getUpdateFastRecord(status, index, type) {
    let {
      recordNo,
      operatorId,
      merchantCode,
      fastCheckGoods,
      fastCheckDetail,
      remark,
      deleteList
    } = this.data, item = "", that = this;
    wx.showModal({
      title: '提示',
      content: type ? "确定要审核吗？" : "确定要修改吗？",
      success(res) {
        if (res.confirm) {
          // if (status) {
          //   item = [fastCheckGoods[index]]
          // } else {
          //   item = fastCheckGoods
          // }
          let params = {
            merchantCode,
            operatorId,
            recordNo,
            status: type || fastCheckDetail.status,
            inventoryRecordGoodsData: app.base.fastCheckGoods(status?deleteList:fastCheckGoods, status || 0),
            remark: fastCheckDetail.remark || remark || ""
          }
          updateFastRecord(params).then(res => {
            console.log(res, "修改快速盘点单")
            if (res.code == "SUCCESS") {
              // if (index == 0 || index) {
              //   fastCheckGoods.splice(index, 1)
              //   that.setData({
              //     fastCheckGoods
              //   }, () => {
              //     that.getSumData()
              //   })
              // } else {
              //   console.log("执行没")
              //   that.setData({
              //     alter: false
              //   })
              // }
              that.setData({
                alter: false,
                deleteList:[]
              })
              that.getSelectFastRecordDetailsAll(recordNo)
            }else{
              app.tip(res.msg)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //提交快速盘点单
  save() {
    let {
      alter,recordNo,deleteList
    } = this.data
    if (alter && recordNo) {
      if(deleteList && deleteList.length){
        this.getUpdateFastRecord(1)
      }else{
        this.getUpdateFastRecord()
      }
    } else {
      this.newSaveFastRecord()
    }
  },

  // 审核快速盘点单
  onSubmit() {
    this.getUpdateFastRecord("", "", 2)
  }
})