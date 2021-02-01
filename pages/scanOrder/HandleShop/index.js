// pages/scanOrder/HandleShop/index.js
const app = getApp()
import {
  goodsGetApi, //查询商品
  categoryListApi,
  categoryCreateApi, // 创建分类
  goodsDelApi, // 删除商品
  goodsBatchOnShelfApi,
  goodsBatchOffShelfApi,
  goodsUpdatetApi,
  uploadImageApi,
  goodsCreateApi,
} from "./../../../api/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: ['是', "否"],
    foodType: ["单品"],
    goods: {
      goodsStatus: 0
    },
    shopImg: [],
    goodsRequired: 1, // 必选
    categoryList: [], // 分类
    goodsId: "",
    isPX: app.isPX,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    // {info: "{"merchantCode":"EW_N5494949338","categoryId":510,"goodsId":685}"}
    let info = options.info ? JSON.parse(options.info) : {};
    this.setData({
      ...info,
      info
    })
    if (info.goodsId) {
      this.getGoods(info);
    }
    if(info.merchantCode) {
      this.getcategoryList(info.merchantCode)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.handlePageInfo();
  },

  // 查询商品
  async getGoods(info) {
    let params = info
    let res = await goodsGetApi(params);
    if (res.code == "SUCCESS") {
      if(res.result[0].goodsStatus != 0 && res.result[0].goodsStatus != 1) {
        res.result[0].goodsStatus = 0
      }
      this.setData({
        goods: res.result[0],
        shopImg: [`${res.result[0].goodsImgs[0]}`],
        goodsRequired: res.result[0].goodsRequired || res.result[0].goodsRequired == 0? res.result[0].goodsRequired: 1,
        buyLimitNum: res.result[0].buyLimitNum || res.result[0].buyMinNum,
        goodsDesc: res.result[0].goodsDesc
      })
    }
  },

  // 查询分类
  async getcategoryList(id) {
    id = id ? id : this.data.merchantCode
    let params = {
      merchantCode: id
    }
    let res = await categoryListApi(params)
    if (res.code == "SUCCESS") {
      this.setData({
        categoryList: res.result
      })
    }
  },

  // 修改名字
  changeGoodsName(e) {
    let value = e.detail.value;
    let {goods} = this.data;
    goods.goodsName = value;
    this.setData({
      goods
    })
  },

  // 选择分类
  changeCategory({
    currentTarget
  }) {
    let {
      categoryId
    } = currentTarget.dataset;
    if (!categoryId) return;
    this.setData({
      categoryId
    })
  },

  // 上传图片  尚未调用上传接口
  chooseImage() {
    let {merchantCode} = this.data;
    wx.chooseImage({
      count: 1,
      success: (res) => {
        // this.setData({
        //   shopImg: res.tempFilePaths
        // })
        console.log(res.tempFilePaths)
        let params = {
          path: res.tempFilePaths.join(","),
          merchantCode
        }
        uploadImageApi(params).then(resp => {
          resp = JSON.parse(resp);
          if(resp.code == 0) {
            this.setData({
              shopImg: resp.result
            })
          }
        })
      }
    })
  },

  //  删除图片
  delShopImg() {
    this.setData({
      shopImg: []
    })
  },

  // 添加小料
  materials() {
    let {merchantCode,goods} = this.data;
    let info = {
      merchantCode,
      goodsMaterials: goods.goodsMaterials
    }
    wx.navigateTo({
      url: `/pages/scanOrder/orderMaterial/index?info=${JSON.stringify(info)}`,
    })
  },

  // 最小购买量
  buyNum(e) {
    this.setData({
      buyLimitNum: e.detail.value
    })
  },

  // 必选商品
  changeStatus(e) {
    let value = e.detail.value;
    this.setData({
      goodsRequired: value
    })
  },

  // 商品描述
  shopDesc(e) {
    this.setData({
      goodsDesc: e.detail.value
    })
  },

  handlePageInfo() {
    const pages = getCurrentPages()
    const currPage = pages[pages.length - 1] // 当前页
    let {
      goods
    } = this.data;
    console.log(currPage.data)
    if (currPage.data.goodsSpec) {
      goods.goodsSpec = JSON.parse(currPage.data.goodsSpec);
    }
    if (currPage.data.attributes) {
      goods.attributes = JSON.parse(currPage.data.attributes);
    }
    if (currPage.data.goodsMaterials) {
      goods.goodsMaterials = JSON.parse(currPage.data.goodsMaterials);
    }
    this.setData({
      goods
    })
  },

  // 去规格页
  toShopSpec() {
    let {
      goods
    } = this.data;
    if(!goods.goodsSpec) {
      goods.goodsSpec = []
    }
    wx.navigateTo({
      url: `/pages/scanOrder/shopSpec/index?goodsSpec=${JSON.stringify(goods.goodsSpec)}`,
    })
  },

  // 去属性页
  toShopAttr() {
    let {
      goods
    } = this.data;
    if(!goods.attributes) {
      goods.attributes = []
    }
    wx.navigateTo({
      url: `/pages/scanOrder/shopAttr/index?attributes=${JSON.stringify(goods.attributes)}`,
    })
  },

  // 添加标签
  addSortList() {
    this.selectComponent('#remarkPanel').togglePanel()
  },

  getRemarkVal(e) {
    this.data.remarkVal = e.detail.value
  },

  toggleRemark() {
    let {
      categoryList,
      remarkVal,
      merchantCode
    } = this.data;
    if (!remarkVal || categoryList.indexOf(remarkVal) != -1) {
      this.setData({
        remarkVal: ""
      })
      this.selectComponent('#remarkPanel').togglePanel()
      return;
    }
    let params = {
      merchantCode: merchantCode,
      categoryName: remarkVal
    }
    categoryCreateApi(params).then(res => {
      if (res.code == "SUCCESS") {
        app.tip(`创建成功`);
        this.setData({
          categoryText: "",
          isAddCategroy: false
        })
        this.getcategoryList()
      }
    })
    this.selectComponent('#remarkPanel').togglePanel()
  },

  // 保存商品
  async saveShop() {
    let {goods,goodsId,merchantCode,categoryId,shopImg,goodsDesc,buyLimitNum, goodsRequired} = this.data;
    let params = {}, res;
    // if(!goods.attributes || goods.attributes.length<=0) {
    //   app.tip(`请添加商品属性`)
    //   return;
    // }
    if(!goods.goodsName) {
      app.tip(`请添加商品名称`)
      return;
    }
    if(!goods.goodsSpec || goods.goodsSpec.length<=0) {
      app.tip(`请添加商品规格`)
      return;
    }
    let goodsMaterial=[]
    if(goods.goodsMaterials && goods.goodsMaterials.length > 0) {
      goods.goodsMaterials.map((item) => {
        goodsMaterial.push({
          materialId:item.materialId,
          materialName:item.materialName
        })
      })
    }

    let attributes = [];
    if(goods.attributes && goods.attributes.length > 0) {
      goods.attributes.map((item) => {
        attributes.push({
          name:item.name,
          details:item.details
        })
      })
    }
    if(goodsId) {
      // 编辑商品
      params = {
        merchantCode,
        categoryId,
        goodsId,
        goodsName: goods.goodsName,
        goodsStatus: goods.goodsStatus,
        goodsSpec: JSON.stringify(goods.goodsSpec),
        goodsImgs: shopImg,
        goodsDesc,
        attributes: JSON.stringify(attributes),
        buyMinNum: buyLimitNum,
        goodsRequired,
        goodsMaterial: JSON.stringify(goodsMaterial)
      }
      res = await goodsUpdatetApi(params);
    } else {
      // 添加商品
      params = {
        merchantCode,
        categoryId,
        goodsName: goods.goodsName,
        goodsStatus: goods.goodsStatus,
        goodsSpec: JSON.stringify(goods.goodsSpec),
        goodsImgs: shopImg,
        goodsDesc,
        attributes: JSON.stringify(attributes),
        buyMinNum: buyLimitNum || 1,
        goodsRequired,
        goodsMaterial: JSON.stringify(goodsMaterial)
      }
      res = await goodsCreateApi(params);
    }
    if(res.code=="SUCCESS") {
      app.tip("商品创建成功");
      const pages = getCurrentPages()
      const prevPage = pages[pages.length - 2]
      prevPage.setData({
          shopChange: 1
      })
      wx.navigateBack({
        delta: 1
      })
    } else {
      app.tip(res.msg)
    }
  },

  // 下架商品
  async invalidShop({
    currentTarget
  }) {
    // goodsBatchOffShelfApi // 下架
    // goodsBatchOnShelfApi // 上架
    let {
      status
    } = currentTarget.dataset;
    let {
      goodsId,
      merchantCode
    } = this.data;

    let res;
    let params = {
      merchantCode,
      goodsIds: goodsId
    }
    if (status == 0) {
      res = await goodsBatchOffShelfApi(params);
      if (res.code == 'SUCCESS') {
        app.tip("下架成功");
      }
    } else {
      res = await goodsBatchOnShelfApi(params);
      if (res.code == 'SUCCESS') {
        app.tip("上架成功");
      }
    }
    this.getGoods(this.data.info);
  },

  // 删除商品

  async delShop() {
    let {
      goodsId,
      merchantCode
    } = this.data;
    let params = {
      merchantCode,
      goodsId: goodsId
    }
    let res = await goodsDelApi(params);
    if (res.code == 'SUCCESS') {
      app.tip("删除成功");
      const pages = getCurrentPages()
      const prevPage = pages[pages.length - 2]
      prevPage.setData({
          shopChange: 1
      })
      wx.navigateBack({
        delta: 1
      })
    }
  }

})