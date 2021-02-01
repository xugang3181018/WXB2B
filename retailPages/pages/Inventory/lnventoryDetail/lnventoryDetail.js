// pages/Inventory/lnventoryDetail/lnventoryDetail.js
let {
  selectInventoryCheckList,
  shopGoodsInventoryRecordDetail,
  saveInventoryRecord,
  updateInventoryRecord,
  inventoryRecordDetailsDel,
  getInventoryCheckOrder,
  getInventoryDetailsGoodsList
} = require('../../../../api/index')
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    cpmBtn:false,
    max: 200,
    taskList: [],
    checkNoList: [],
    checkStatus: ["盘点中", "已审核", "已完成", "已作废"],
    items: [{
        value: '1',
        name: '当前营业已结束',
        checked: false
      },
      {
        value: '2',
        name: '门店数据以上传',
        checked: false
      },
    ],
    checked: false,
    navbarInitTop: 0, //导航栏初始化距顶部的距离
    isFixedTop: false, //是否固定顶部
    just: 0,
    lose: 0,
    wait: 0,
    pitchIndex:-1,
    isPX:app.systemInfo.isPX
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let checkGoods = wx.getStorageSync('checkGoods') || ""
    // let checkMessage = wx.getStorageSync('checkMessage')
    // if(checkMessage && !checkMessage.remark && checkGoods){
    //   console.log(checkMessage)
    //   checkGoods.remark = checkMessage.remark
    // }
    // let checkDetail = wx.getStorageSync('checkDetail')
    // let role = wx.getStorageSync("login").role
    // // let {from,merchantCode,checkNo} = options
    // let {from,merchantCode,checkNo,goods} = app
    // console.log()
    // // app.merchantCode
    // // app.checkNo
    // // app.goods
    // // app.from
    // this.setData({
    //   id:app.newCheck,
    //   merchantCode,
    //   checkNo,
    //   from,
    //   checkDetail,
    //   checkGoods,
    //   role,
    //   isPX:app.isPX,
    //   remark:checkMessage.remark,
    //   checkArea:checkMessage.checkArea
    // })
    // wx.removeStorageSync('checkGoods')
    // if (app.newCheck == 1 && goods != "goods") {
    //   wx.removeStorageSync('checkList')
    //   this.setData({
    //     checkList: [],
    //     checked: true
    //   })
    // }
    // if (app.newCheck == 1) {
    //   wx.setNavigationBarTitle({
    //     title: '新建盘点单'
    //   })
    //   if (role == 0) {
    //     this.getSelectInventoryCheckList()
    //   } else {
    //     this.getSelectInventoryCheckList({
    //       merchantCode: wx.getStorageSync("login").merchantCode
    //     })
    //     this.getInventoryCheckOrder({
    //       merchantCode: wx.getStorageSync("login").merchantCode
    //     })
    //   }
    // }
    // if (checkGoods) return
    // if (checkDetail && app.newCheck != 1) {
    //   if (checkDetail.status == 0) {
    //     wx.setNavigationBarTitle({
    //       title: '编辑盘点单'
    //     })
    //   } else {
    //     wx.setNavigationBarTitle({
    //       title: '盘点详情'
    //     })
    //   }
    //   this.shopGoodsInventoryRecordDetail()
    // }
    let checkInfo = wx.getStorageSync('checkInfo')
    if(checkInfo){
      this.setData({
        nameIndex:checkInfo.nameIndex,
        checkNo:checkInfo.checkNo,
      })
    }
  },

  //弹窗提示组件
  checkboxChange(e) {
    console.log(e)
    if (e.detail.value.length == 2) {
      this.setData({
        affirm: true
      })
    } else {
      this.setData({
        affirm: false
      })
    }
  },

  //弹窗取消按钮
  deselectBtn() {
    this.setData({
      checked: false
    })
    wx.navigateBack()
  },

  //弹窗确定按钮 
  affirmBtn() {
    let {
      affirm
    } = this.data
    if (affirm) {
      this.setData({
        checked: false
      })
    } else {
      wx.showToast({
        title: '请选择以上内容',
        icon: "none"
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //切换盘点单的状态
  toggleTab({
    target
  }) {
    this.setData({
      current: target.id
    })
    console.log(target.id)
    let {
      checkList
    } = this.data, index = target.id, list = [];
    checkList.map(item => {
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
    this.setData({
      list,
    })
  },

  //提交盘点单
  onSubmit() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定要提交盘点单',
      success(res) {
        if (res.confirm) {
          // 0生成盘点单1删除盘点单里的商品
          that.saveInventoryRecord(that.data.checkList, 0)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    // this.saveInventoryRecord(this.data.checkList, 0)
  },

  //作废按钮
  abolish() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定要作废此单',
      success(res) {
        if (res.confirm) {
          that.inventoryRecordDetailsDel()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    // this.inventoryRecordDetailsDel()
  },

  // 获取盘点区域名称
  onBlur(e) {
    console.log(e, "获取盘点区域名称 checkArea")
    app.checkArea = e.detail.value
    this.setData({
      checkArea: e.detail.value
    })
  },

  // 生成实物盘点单
  saveInventoryRecord(checkList, status) {
    wx.showLoading({
      title: '加载中',
    })
    let {
      id,
      // merchantCode,
      code,
      checkNo,
      checkDetail,
      checkArea,
      remark
    } = this.data
    console.log(checkArea,remark,"区域备注")
    if (!checkList.length) {
      wx.showToast({
        title: '暂无提交的盘点单',
        icon: "none"
      })
      return
    }
    let string = app.base.jointString(checkList, status)
    console.log(string)
    if (id == 1) {
      saveInventoryRecord({
        merchantCode: code || wx.getStorageSync("login").merchantCode,
        checkNo: checkNo || app.checkNo,
        checkArea: checkArea || app.checkArea || "",
        remark:remark || app.remark || "",
        operatorId: wx.getStorageSync("login").operatorId,
        inventoryRecordGoodsData: string
      }).then(res => {
        console.log(res, "生成实物盘点单")
        if (res.code == "FAILED") {
          wx.showToast({
            title: res.msg,
            icon: "none"
          })
        } else {
          app.newCheck = ""
          wx.removeStorageSync('checkList')
          wx.removeStorageSync('checkInfo')
        }

      })
    } else {
      updateInventoryRecord({
        recordNo: checkDetail.recordNo,
        operatorId: wx.getStorageSync("login").operatorId,
        inventoryRecordGoodsData: string
      }).then(res => {
        console.log(res, "编辑实物盘点单")
      })
    }
    if (status == 1) return
    setTimeout(function(){
      wx.hideLoading()
      wx.navigateBack()
    },1000)
    // wx.redirectTo({
    //   url: '/pages/retail/Inventory/trueCheck/trueCheck',
    // })
  },

  //实物盘点订单作废接口
  inventoryRecordDetailsDel() {
    let {
      checkDetail
    } = this.data
    inventoryRecordDetailsDel({
      recordNo: checkDetail.recordNo,
      operatorId: wx.getStorageSync("login").operatorId,
    }).then(res => {
      console.log(res, "实物盘点订单作废")
    })
    wx.navigateBack()
  },

  //添加盘点商品
  onAdd() {
    let {
      remark,
      checkArea,
      id
    } = this.data
    if (id == 1) {
      wx.setStorageSync('checkMessage', {
        remark,
        checkArea
      })
    }
    this.setData({
      cpmBtn: true
    })
  },

  //删除盘点商品
  delete(e) {
    console.log(e)
    let index = Number(e.target.id)
    let {
      checkList,
      id
    } = this.data, list = [];
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定删除该商品吗？',
      success(res) {
        if (res.confirm) {
          list.push(checkList[index])
          checkList.splice(index, 1)
          that.setData({
            checkList,
          })
          if (id != 1) {
            that.saveInventoryRecord(list, 1)
          }
          wx.setStorageSync('checkList', checkList)
        } else if (res.cancel) {
          return
        }
      }
    })
  },

  //扫码添加盘点商品
  onScan() {
    //根据条码获取商品信息
    this.setData({
      pitchIndex:0,
      goodsBarcode:"",
      value:{}
    })
    let {
      taskList,
      checkNoList,
      nameIndex,
      checkNoIndex,
      id,
      checkDetail,
      role,
      checkNo,
      merchantCode
    } = this.data,
      code = "",that = this;
    // checkNo1 = "";
    if (id == 1) {
      if (role == 0) {
        if (checkNoList.length == 1 || nameIndex === 0 || nameIndex && (checkNoIndex === 0 || checkNoIndex)) {
          code = taskList[nameIndex].merchantCode
          checkNo = checkNoList.length == 1 ? checkNoList[0].checkNo : checkNoList[checkNoIndex].checkNo
          that.setData({
            checkNo,
            code,
          })
        } else {
          that.setData({
            cpmBtn: false
          })
          wx.showToast({
            title: '请选择机构和关联任务单号',
            icon: "none"
          })
          return
        }
      } else {
        if (checkNoList.length == 1 || checkNoIndex === 0 || checkNoIndex) {
          code = taskList[0].merchantCode
          checkNo = checkNoList.length == 1 ? checkNoList[0].checkNo : checkNoList[checkNoIndex].checkNo
          // app.checkNo = checkNo
          that.setData({
            checkNo,
            code
          })
        } else if (checkNo) {
          // code = taskList[0].merchantCode
        } else {
          that.setData({
            cpmBtn: false
          })
          wx.showToast({
            title: '请选择关联任务单号',
            icon: "none"
          })
          return
        }
      }
    }
    wx.scanCode({
      success(res) {
        console.log(res,checkNo)
        if (res.result) {
          that.setData({
            goodsBarcode: res.result,
            from: 1,
            cpmBtn: true,
            ursor:false
          })
          that.getInventoryDetailsGoodsList({barCode:res.result,checkNo})
          // wx.navigateTo({
          //   url: `/pages/retail/Inventory/lnventoryGoods/lnventoryGoods?checkNo=${id==1?checkNo:checkDetail.checkNo}&code=${id==1?code || merchantCode:checkDetail.merchantCode}&goodsBarcode=${res.result}&from=1`,
          // })
        } else {
          wx.showToast({
            title: '条码获取失败',
            icon: "none"
          })
          setTimeout(function () {
            that.onScan()
          }, 1000);
        }
      }
    })
    // this.setData({
    //   cpmBtn: false
    // })
  },
  //手动选择盘点商品
  onManual() {
    this.setData({
      from:0,
      pitchIndex:1,
      ursor:true,
      goodsBarcode:"" ,
      value:{}
    })
    let {
      taskList,
      checkNoList,
      nameIndex,
      checkNoIndex,
      id,
      checkDetail,
      role,
      code,
      checkNo
    } = this.data
    // checkNo = "";
    if (id == 1) {
      if (role == 0) {
        if (checkNoList.length == 1 || checkNoIndex === 0 || checkNoIndex) {
          code = taskList[0].merchantCode
          checkNo = checkNoList.length == 1 ? checkNoList[0].checkNo : checkNoList[checkNoIndex].checkNo
          this.setData({
            checkNo,
            code,
          })
        } else {
          this.setData({
            cpmBtn: false,
          })
          wx.showToast({
            title: '请选择机构和关联任务单号',
            icon: "none"
          })
          return
        }
      } else if (checkNo) {
        code = taskList[0].merchantCode
      } else {
        if (checkNoList.length == 1 || checkNoIndex === 0 || checkNoIndex) {
          code = taskList[0].merchantCode
          checkNo = checkNoList.length == 1 ? checkNoList[0].checkNo : checkNoList[checkNoIndex].checkNo
          this.setData({
            checkNo,
            code
          })
        } else {
          this.setData({
            cpmBtn: false,
          })
          wx.showToast({
            title: '请选择关联任务单号',
            icon: "none"
          })
          return
        }
      }
    }
    // wx.navigateTo({
    //   url: `/pages/retail/Inventory/manualSelect/manualSelect?checkNo=${id==1?checkNo:checkDetail.checkNo}&code=${id==1?code:checkDetail.merchantCode}`,
    // })
    this.setData({
      cpmBtn: true
    })
  },

  /**
   *手动输入商品的条码
   */
  onGetGoodsBarcode({detail}){
    console.log(detail)
    let {checkNo} = this.data
    this.setData({
      goodsBarcode:detail.value
    })
    this.getInventoryDetailsGoodsList({barCode:detail.value,checkNo})
  },

  //取消
  onDeselect() {
    this.setData({
      cpmBtn: false
    })
  },


  //限制文本输入框的字数
  limit: function (e) {
    var value = e.detail.value;
    var length = parseInt(value.length);
    if (length > this.data.noteMaxLen) {
      return;
    }
    app.remark = value
    this.setData({
      textLength: length,
      remarkStatus: true,
      remark: value
    });
  },

  //盘点任务列表查询
  getSelectInventoryCheckList(params) {
    params.pageSize = 2000
    selectInventoryCheckList(params).then(res => {
      console.log(res)
      if (res.code == "SUCCESS") {
        this.setData({
          taskList: res.result.items
        })
      }
    })
  },

  //查询盘点任务单
  getInventoryCheckOrder(params) {
    getInventoryCheckOrder(params).then(res => {
      console.log(res.result.items,"盘点任务单号")
      this.setData({
        checkNoList: res.result.items
      })
    })
  },

  //选择的盘点机构
  changeMerchant(e) {
    let {
      taskList
    } = this.data
    let nameIndex = Number(e.detail.value)
    this.setData({
      nameIndex
    })
    this.getInventoryCheckOrder({
      merchantCode: taskList[nameIndex].merchantCode
    })
  },


  //选择关联单号
  changeCheckNo(e) {
    console.log(e)
    let {
      nameIndex,
      role,
      checkNoList
    } = this.data
    let checkNoIndex = Number(e.detail.value)
    if (role == 0) {
      if (nameIndex == 0 || nameIndex) {
        this.setData({
          checkNoIndex,
          checkNo:checkNoList.length == 1 ? checkNoList[0].checkNo : checkNoList[checkNoIndex].checkNo
        })
      } else {
        wx.showToast({
          title: '请先选择盘点机构',
          icon: "none"
        })
        return
      }
    } else {
      this.setData({
        checkNoIndex,
        checkNo:checkNoList.length == 1 ? checkNoList[0].checkNo : checkNoList[checkNoIndex].checkNo
      })
    }

  },

  // 获取实物盘点详情
  shopGoodsInventoryRecordDetail() {
    let {
      checkDetail,
      checkGoods,
      checkList
    } = this.data
    console.log(checkDetail.recordNo)
    shopGoodsInventoryRecordDetail({
      recordNo: checkDetail.recordNo
    }).then(res => {
      console.log(res)
      if (res.code == "SUCCESS") {
        if (!(checkList.length > 0)) {
          checkList = res.result.shopGoodsInventoryDetailsResponseList
          this.setData({
            checkNo:res.result.checkNo,
            checkList,
          })
        }
        if (!checkGoods) {
          this.statusGoodsNum(checkList)
        }
        wx.setStorageSync('checkList', checkList)
      }
    })
  },

  //添加商品列表
  addGoodsList() {
    // console.log("添加商品列表")
    let {
      checkList,
      checkNo,
      code,
      value,
      from,
      checkGoods
    } = this.data,that = this;
    // if(from != 1){
    //   checkGoods = item
    // }
    checkGoods.checkNo = checkNo || ""
    checkGoods.merchantCode = code || ""
    checkGoods.inventoryStock = Number(value.number) || 0
    checkGoods.profitStock = (value.number || 0) - checkGoods.stock
    checkGoods.profitType = ((value.number || 0) - checkGoods.stock) > 0 ? 0 : ((value.number || 0) - checkGoods.stock) < 0 ? 1 : 2
    let data = checkList.find(item => {
      return item.goodsId == checkGoods.goodsId
    })
    if (data) {
      data.inventoryStock = data.inventoryStock + checkGoods.inventoryStock
      data.profitStock = Math.abs(data.stock - data.inventoryStock)
      data.profitType = (data.inventoryStock + checkGoods.inventoryStock) - data.stock > 0 ? 0 : (data.inventoryStock + checkGoods.inventoryStock) - data.stock < 0 ? 1 : 2
    } else {
      checkList.push(checkGoods)
    }
    app.tip("添加成功")
    if(from == 1){
      that.setData({
        checkList,
        checkGoods:''
      },()=>{
        setTimeout(function(){
          that.onScan()
        },1000)
      })
    }else{
      that.setData({
      checkList,
      checkGoods: ''
    },()=>{
      setTimeout(function(){
        that.setData({
          cpmBtn:true,
          value:{},
          goodsBarcode:""
        })
      },1000)
    })}
    this.statusGoodsNum(checkList)
    wx.setStorageSync('checkList', checkList)
    this.statusGoodsNum(checkList)
  },

  //盘点状态的商品数
  statusGoodsNum(list) {
    let justList = [],
      loseList = [],
      waitList = [];
    list.map(item => {
      if (item.profitType == 0) {
        justList.push(item)
      } else if (item.profitType == 1) {
        loseList.push(item)
      } else if (item.profitType == 2) {
        waitList.push(item)
      }
    })
    this.setData({
      just: justList.length,
      lose: loseList.length,
      wait: waitList.length
    })
    console.log(justList.length, loseList.length, waitList.length)
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    // app.sliderightshow (this, 'slide_up1',0, 1)
    // let checkGoods = wx.getStorageSync('checkGoods') || ""
    let checkMessage = wx.getStorageSync('checkMessage')
    // if (checkMessage && !checkMessage.remark && checkGoods) {
    //   console.log(checkMessage)
    //   checkGoods.remark = checkMessage.remark
    // }
    let checkDetail = wx.getStorageSync('checkDetail')
    let role = wx.getStorageSync("login").role
    // let {
    //   from,
    //   // merchantCode,
    //   checkNo,
    //   goods
    // } = app
    this.setData({
      id: app.newCheck,
      // merchantCode,
      // checkNo,
      // from,
      checkDetail,
      // checkGoods,
      role,
      isPX: app.isPX,
      remark: checkMessage.remark,
      checkArea: checkMessage.checkArea,
      checkList: wx.getStorageSync('checkList') || [],
    })
    // wx.removeStorageSync('checkGoods')
    // if (app.newCheck == 1 && goods != "goods") {
    //   wx.removeStorageSync('checkList')
    //   this.setData({
    //     checkList: [],
    //     checked: true
    //   })
    // }
    if (app.newCheck == 1) {
      wx.setNavigationBarTitle({
        title: '新建盘点单'
      })
      if (role == 0) {
        this.getSelectInventoryCheckList()
      } else {
        this.getSelectInventoryCheckList({
          merchantCode: wx.getStorageSync("login").merchantCode
        })
        this.getInventoryCheckOrder({
          merchantCode: wx.getStorageSync("login").merchantCode
        })
      }
    }
    // if (checkGoods) return
    if (checkDetail && app.newCheck != 1) {
      if (checkDetail.status == 0) {
        wx.setNavigationBarTitle({
          title: '编辑盘点单'
        })
      } else {
        wx.setNavigationBarTitle({
          title: '盘点详情'
        })
      }
      this.shopGoodsInventoryRecordDetail()
    }

    let that = this
    // if (checkGoods) {
    //   this.addGoodsList()
    //   if (from == 1) {
    //     console.log(from)
    //     setTimeout(function () {
    //       that.onScan()
    //     }, 1000);
    //   }
    // }

    if (that.data.navbarInitTop == 0) {

      //获取节点距离顶部的距离
      wx.createSelectorQuery().select('#navbar').boundingClientRect(function (rect) {
        if (rect && rect.top > 0) {
          var navbarInitTop = parseInt(rect.top);
          that.setData({
            navbarInitTop: navbarInitTop
          });
        }
      }).exec();

    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide(){
    let {from,nameIndex,checkNo} = this.data
    if(from == 1){
      wx.setStorageSync('checkInfo',{nameIndex,checkNo})
    }
  },

  /**
   * 监听页面滑动事件
   */
  onPageScroll: function (e) {
    var that = this;
    var scrollTop = parseInt(e.scrollTop); //滚动条距离顶部高度

    //判断'滚动条'滚动的距离 和 '元素在初始时'距顶部的距离进行判断
    var isSatisfy = scrollTop >= that.data.navbarInitTop ? true : false;
    //为了防止不停的setData, 这儿做了一个等式判断。 只有处于吸顶的临界值才会不相等
    if (that.data.isFixedTop === isSatisfy) {
      return false;
    }

    that.setData({
      isFixedTop: isSatisfy
    });
  },

  /**
   *盘点提交
   */
  formSubmit({
    detail
  }) {
    let value = detail.value,{from} = this.data;
    if (!(from ==1 || value.barCode)) {
      app.tip("请输入商品条码")
      return
    }
    if (!(value.number === 0 || value.number)) {
      app.tip("请输入盘点库存")
      return
    }
    this.setData({
      value
    })
    this.addGoodsList()
    // if(from == 1){
    //   this.addGoodsList()
    // }else{
    //   this.getInventoryDetailsGoodsList(value)
    // }
    // this.getInventoryDetailsGoodsList(value)
    
  },

  /**
   * 盘点取消
   */
  formReset(e) {
    this.setData({
      cpmBtn: false
    })
  },

  // 根据条码按照盘点任务规则查询商品
  getInventoryDetailsGoodsList(value) {
    let {
      checkNo,
      goodsBarcode,
      from
    } = this.data
    let that = this
    console.log(goodsBarcode,app.checkNo,from,checkNo)
    getInventoryDetailsGoodsList({
      checkNo: checkNo || value.checkNo,
      goodsBarcode: goodsBarcode || value.barCode
    }).then(res => {
      console.log(res, "根据条码按照盘点任务规则查询商品")
      if (res.code == "SUCCESS") {
        this.setData({
          checkGoods: res.result[0]
        })
        // that.setData({
        //   cpmBtn:false
        // })
        // if(from != 1){
        //   that.addGoodsList(res.result[0])
        // }
        // that.addGoodsList(res.result[0])
      } else {
        wx.showToast({
          title: '没有找到该商品',
          icon: "none",
        })
        setTimeout(function () {
          that.setData({
            goodsBarcode:"",
            value:{}
          })
          if(from == 1){
            that.onScan()
          }
          // }else{
          //   return
          // }
        }, 1000)
      }
    })
  },

})