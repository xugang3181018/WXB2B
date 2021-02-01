// pages/scanOrder/orderMaterial/index.js
const app = getApp()
import {
  materialListApi
} from '../../../api/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsMaterials:[],
    materials: [],
    isPX: app.isPX,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = JSON.parse(options.info);
    console.log(info)
    if(!info.goodsMaterials) {
      this.setData({
        goodsMaterials: []
      })
    } else {
      let materials = [];
      info.goodsMaterials.map((item) => {
        materials.push(item.materialId)
      })
      this.setData({
        materials
      })
    }
    this.setData({
      ...info
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.materialList()
  },

  async materialList() {
    let {merchantCode,goods} = this.data;
    let params = {
      merchantCode
    }
    let res = await materialListApi(params);
    console.log(res);
    if(res.code == 'SUCCESS') {
      this.setData({
        list: res.result
      })
    } else {
      app.tip(`${res.msg}`);
    }
  },

  addAttr({currentTarget}) {
    let {list, merchantCode, goodsMaterials, materials} = this.data;
    let {index, titles} = currentTarget.dataset;
    let materialId = list[index].materialId;
    let idx = materials.indexOf(materialId);
    console.log(idx);
    if( idx != -1) {
      materials.splice(idx,1);
      goodsMaterials.splice(idx,1)
    } else {
      materials.push(materialId)
      goodsMaterials.push(list[index])
    }
    console.log(materials)
    console.log(goodsMaterials)
    this.setData({
      materials,
      goodsMaterials
    })
  },

  sureAttr() {
    let {goodsMaterials} = this.data;
    const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        prevPage.setData({
          goodsMaterials: JSON.stringify(goodsMaterials)
        })
        wx.navigateBack({
            delta: 1
        })
  }

})