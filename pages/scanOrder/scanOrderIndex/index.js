// pages/scanOrder/scanOrderIndex/index.js
const app = getApp()
import {
  shopConfigListApi,
  categoryListApi,
  goodsListApi,
  goodsDelApi,
  categoryDelApi, // 删除商品
} from "./../../../api/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sortList: [],
    sorts: {
      sortName: '全部门店',
      id: '-1'
    },
    navHeight: 0,
    isChangeSorts: false,
    isPX: app.isPX,
    categoryList: [],
    categoryIndex: 0,
    categoryShopList: [],
    categoryTitle: {
      name: "",
      id: ""
    }, // 当前分类信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setHeight();
    let loginInfo = wx.getStorageSync('login');

    console.log(loginInfo.permissionJson)
    this.setData({
      permissionJson: loginInfo.permissionJson
    })
  },

  onShow() {
    // const pages = getCurrentPages()
    // const currPage = pages[pages.length - 1] // 当前页
    // if (currPage.data.shopChange) {
    //   let {sorts,categoryTitle} = this.data;
    //   if(categoryTitle.id) {
    //     this.getgoodsList(categoryTitle.id);
    //   } else {
    //     this.getcategoryList(sorts)
    //   }

    // }
    this.getMainShop();
  },

  // 获取核心门店
  /**
   * role 0 核心门店
   * role 2 headOfficeStaff = 2  核心员工
   */
  async getMainShop() {
    let sorts = {},
      isChangeSorts = false,
      loginInfo = wx.getStorageSync('login');

    if (loginInfo.role == 0 || (loginInfo.role == 2 && loginInfo.headOfficeStaff == 2)) {
      isChangeSorts = true
      let getShopList = await this.getShopList(loginInfo.appId, loginInfo.merchantCode);
      sorts = {
        sortName: getShopList[0].sortName,
        id: getShopList[0].id
      }
    } else {
      sorts = {
        sortName: loginInfo.merchantName,
        id: loginInfo.merchantCode
      }
    }
    this.setData({
      sorts,
      isChangeSorts,
    })
    console.log(sorts);
    this.getcategoryList(sorts);
  },

  async getShopList(appId, merchantCode) {
    let {
      sortList
    } = this.data;
    let params = {
      appId,
      merchantCode: ""
    }
    let res = await shopConfigListApi(params);
    if (res.code == "SUCCESS") {
      res.result.map(item => {
        sortList.push({
          sortName: item.merchantName,
          id: item.merchantCode
        })
      })
      this.setData({
        sortList
      })
      return sortList;
    }
  },

  // 获取分类列表
  async getcategoryList(sorts) {
    console.log(sorts);
    sorts = sorts ? sorts : this.data.sorts
    let params = {
      merchantCode: sorts.id
    }
    let res = await categoryListApi(params)
    console.log(res);
    if (res.code == "SUCCESS") {
      this.setData({
        categoryList: res.result
      })
      if (res.result.length <= 0) return;
      if (!this.data.categoryTitle.id) {
        this.setData({
          categoryTitle: {
            name: res.result[0].categoryName,
            id: res.result[0].categoryId
          }
        })
      }
      this.getgoodsList();
    }
  },

  // 获取对应商品列表
  async getgoodsList(categoryId) {
    // categoryId = categoryId?categoryId:categoryTitle.id
    let {
      sorts,
      categoryIndex,
      categoryTitle
    } = this.data;
    categoryId = categoryId ? categoryId : categoryTitle.id;

    let params = {
      categoryIds: categoryId,
      merchantCode: sorts.id,
    }
    let res = await goodsListApi(params)
    if (res.code == "SUCCESS") {
      this.setData({
        categoryShopList: res.result
      })
    }
  },

  // 更改分类商品
  changeCategory({
    currentTarget
  }) {
    let {
      index,
      categoryId
    } = currentTarget.dataset;
    let {
      categoryIndex,
      categoryList
    } = this.data;
    if (index == categoryIndex) return;

    this.setData({
      categoryTitle: {
        name: categoryList[index].categoryName,
        id: categoryId
      }
    })
    this.setData({
      categoryIndex: index,
      categoryShopList: [],
    })
    this.getgoodsList(categoryId);
  },

  // 商品对应排序

  //切换门店
  saleSort(e) {
    console.log(e);
    let {
      value
    } = e.detail;
    let {
      sorts,
      sortList
    } = this.data;
    sorts = sortList[value]
    this.setData({
      sorts: sortList[value]
    })
    console.log(sortList[value])
    this.getcategoryList(sorts)
  },

  setHeight() {
    const {
      windowHeight
    } = wx.getSystemInfoSync()
    let query = wx.createSelectorQuery();
    query.select(`#storeHead`).boundingClientRect((rect) => {
      this.setData({
        navHeight: windowHeight - (app.isPX ? 84 : 60) - rect.height,
        cardHeight: app.isPX ? 84 : 60
      })
    }).exec();
  },


  toSortList() {
    let {
      sorts,
      permissionJson
    } = this.data
    // if (permissionJson.goodsNewConfig == 1) {
    //   app.tip("您还没有权限");
    //   return;
    // }
    wx.navigateTo({
      url: `/pages/scanOrder/scanOrderList/index?id=${sorts.id}`,
    })
  },

  delShop({
    currentTarget
  }) {
    let {
      id,
      name,
      index
    } = currentTarget.dataset;
    if (!id) return;
    name = name ? name : '此商品';
    let {
      categoryShopList,
      sorts,
      permissionJson
    } = this.data;
    let params = {
      merchantCode: sorts.id,
      goodsId: id
    }
    // if (permissionJson.goodsDelConfig == 1) {
    //   app.tip("您还没有权限");
    //   return;
    // }
    wx.showModal({
      title: "确定删除",
      content: `您确定要删除${name}么？`,
      confirmText: "删除",
      confirmColor: `#00cc99`,
      success: (res) => {
        if (res.confirm) {
          goodsDelApi(params).then(resp => {
            if (resp.code == "SUCCESS") {
              app.tip(`删除成功`);
              categoryShopList.splice(index, 1)
              this.setData({
                categoryShopList
              })
            } else {
              app.tip(resp.msg);
            }
          })
        }
      }
    })
  },

  handleShop({
    currentTarget
  }) {
    let {
      id,
      index
    } = currentTarget.dataset;  
    let {
      sorts,
      categoryTitle,
      permissionJson
    } = this.data;
    let params = {
      merchantCode: sorts.id,
      categoryId: categoryTitle.id,
      goodsId: id
    }
    // if (permissionJson.goodsEditConfig == 1) {
    //   app.tip("您还没有权限");
    //   return;
    // }
    params = JSON.stringify(params);
    wx.navigateTo({
      url: `/pages/scanOrder/HandleShop/index?info=${params}`,
    })
  },

  addShop() {
    let {
      sorts,
      categoryTitle,
      permissionJson
    } = this.data;
    // if (permissionJson.goodsNewConfig == 1) {
    //   app.tip("您还没有权限");
    //   return;
    // }
    let params = {
      merchantCode: sorts.id,
      categoryId: categoryTitle.id,
    }
    params = JSON.stringify(params);
    wx.navigateTo({
      url: `/pages/scanOrder/HandleShop/index?info=${params}`,
    })
  }

})