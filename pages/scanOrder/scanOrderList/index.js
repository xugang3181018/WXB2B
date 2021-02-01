// pages/scanOrder/scanOrderList/index.js
const app = getApp()
import {
  categoryListApi, // 获取分类
  categoryCreateApi, // 创建分类
  categoryDelApi, // 分类删除
  categoryUpdateApi, // 分类编辑
  categorySortApi, // 分类排序
} from "./../../../api/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    categoryList: [],
    isAddCategroy: false,
    categoryText: "",
    editIndex: 99999,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    this.getcategoryList(options.id)
  },

  // 获取分类列表
  async getcategoryList(id) {
    id = id ? id : this.data.id
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

  // 删除分类列表
  delCategroy({
    currentTarget
  }) {
    let {
      index,
      categoryId
    } = currentTarget.dataset;
    if (!categoryId) return;
    let {
      categoryList,
      id
    } = this.data;
    let name = categoryList[index].categoryName;
    let params = {
      categoryId,
      merchantCode: id
    }
    wx.showModal({
      content: `您确定要删除${name}分类么？`,
      confirmText: "删除",
      confirmColor: `#00cc99`,
      success: (res) => {
        if (res.confirm) {
          categoryDelApi(params).then(resp => {
            if (resp.code == "SUCCESS") {
              app.tip(`删除成功`);
              categoryList.splice(index, 1)
              this.setData({
                categoryList
              })
            } else {
              app.tip(resp.msg)
            }
          })
        }
      }
    })
  },

  // 编辑分类名称
  editCategroy({
    currentTarget
  }) {
    let {
      index,
      categoryId
    } = currentTarget.dataset;
    if (!categoryId) return;
    this.setData({
      editIndex: index
    })
  },

  setCategroyName(e) {
    console.log(e);
    this.setData({
      categoryNameText: e.detail.value
    })
  },

  async sureCateName({
    currentTarget
  }) {
    let {
      index,
      categoryId
    } = currentTarget.dataset;
    let {
      categoryNameText,
      id,
      categoryList
    } = this.data;
    categoryNameText = categoryNameText? categoryNameText: categoryList[index].categoryName
    let params = {
      categoryId,
      merchantCode: id,
      categoryName: categoryNameText
    }
    let res = await categoryUpdateApi(params);
    if (res.code == "SUCCESS") {
      app.tip(`修改分类名成功`);
      categoryList[index].categoryName = categoryNameText;
      this.setData({
        categoryList,
        editIndex: 999999
      })
    } else {
      app.tip(res.msg);
    }
  },

  // 添加分类
  addCategroy() {
    this.setData({
      isAddCategroy: true
    })
  },

  // 输入文字 && 保存
  getCategroyText(e) {
    this.setData({
      categoryText: e.detail.value
    })
  },

  async sure() {
    let {
      id,
      categoryText
    } = this.data;
    let params = {
      merchantCode: id,
      categoryName: categoryText
    }
    let res = await categoryCreateApi(params);
    if (res.code == "SUCCESS") {
      app.tip(`创建成功`);
      this.setData({
        categoryText: "",
        isAddCategroy: false
      })
      this.getcategoryList()
    } else {
      app.tip(res.msg)
    }
  },

})