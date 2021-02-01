// pages/scanOrder/shopAttr/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        attributes: [],
        title: [], // 上层title标签
        titleName: ['温度', '甜度', '辣度'],
        isPX: app.isPX,
        creatCategroy: {
            seat: "", // header 顶部，list 内容区
            index: "", // 内容区第几个
            textareaText: "", // 标签内容
        },
        categoryTitleName:[['热','常温','冰'],['半塘','正常糖','微糖'],['不辣','微辣','中辣','变态辣']]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let attributes = JSON.parse(options.attributes) || [];
        let title = [];
        if (attributes.length > 0) {
            attributes.map((item, index) => {
                item.categoryList = JSON.parse(JSON.stringify(item.details));
                title.push(item.name);
            })
            this.setData({
                attributes,
                title
            })
        }
    },

    // 修改名称
    alterTitle({
        currentTarget
    }) {
        let {
            index
        } = currentTarget.dataset;
        let {
            attributes
        } = this.data;
        attributes[index].alter = 1;
        this.setData({
            attributes
        })
    },

    getCategroyText(e) {
        let {
            index,
        } = e.currentTarget.dataset;
        let value = e.detail.value;
        let {
            attributes
        } = this.data;
        attributes[index].name = value;
        this.setData({
            attributes
        })
    },

    sure({
        currentTarget
    }) {
        let {
            index
        } = currentTarget.dataset;
        let {
            attributes
        } = this.data;
        let title = [];
        attributes[index].alter = 0;
        attributes.map((item, index) => {
            title.push(item.name);
        })
        this.setData({
            attributes,
            title
        })
    },

    // 更改选中的选项
    alterDetail({
        currentTarget
    }) {
        let {
            index,
            detailName
        } = currentTarget.dataset;
        let {
            attributes
        } = this.data;
        let detailIndex = attributes[index].details.indexOf(detailName);
        detailIndex != -1 ? attributes[index].details.splice(detailIndex, 1) : attributes[index].details.push(detailName);
        this.setData({
            attributes,
        })
    },

    // 删除对应规格
    delAttr({
        currentTarget
    }) {
        let {
            index
        } = currentTarget.dataset;
        let {
            attributes,
            title
        } = this.data;
        let titleIdx = title.indexOf(attributes[index].name);
        if (titleIdx != -1) title.splice(titleIdx, 1);
        attributes.splice(index, 1);
        this.setData({
            attributes,
            title
        })
    },

    // 增加属性
    addAttr({
        currentTarget
    }) {
        let {
            attributes,
            title,
            categoryTitleName
        } = this.data;
        let {
            titles,
            index
        } = currentTarget.dataset;
        if (title.indexOf(titles) != -1) return;
        attributes.push({
            name: titles,
            details: [],
            categoryList: index<3? categoryTitleName[index]: []
        })
        if (titles) title.push(titles)
        this.setData({
            attributes,
            title
        })
    },

    // 顶部添加
    newTitle() {
        let {
            creatCategroy
        } = this.data;
        creatCategroy.seat = "header"
        this.data.creatCategroy = creatCategroy;
        this.selectComponent('#remarkPanel').togglePanel()
    },

    newList({
        currentTarget
    }) {
        let {
            index
        } = currentTarget.dataset;
        let creatCategroy = {
            seat: "list",
            index: index
        }
        this.data.creatCategroy = creatCategroy;
        this.selectComponent('#remarkPanel').togglePanel();
    },

    // textareaText 添加内容
    getRemarkVal(e) {
        let {
            creatCategroy
        } = this.data;
        creatCategroy.textareaText = e.detail.value
        this.data.creatCategroy = creatCategroy
    },

    // 添加选项
    toggleRemark() {
        let {
            creatCategroy,
            titleName,
            attributes
        } = this.data;
        if (creatCategroy.seat == 'header') {
            titleName.push(creatCategroy.textareaText)
        } else {
            let index = creatCategroy.index;
            if (attributes[index].categoryList.length > 0 && (!creatCategroy.textareaText || attributes[index].categoryList.indexOf(creatCategroy.textareaText) != -1)) {
                this.selectComponent('#remarkPanel').togglePanel();
                return;
            }
            
            attributes[index].categoryList.push(creatCategroy.textareaText);
            attributes[index].details.push(creatCategroy.textareaText)
        }
        this.setData({
            creatCategroy: {
                seat: "",
            },
            titleName,
            attributes,
            remarkVal: ""
        })
        this.selectComponent('#remarkPanel').togglePanel()
    },

    // sureAttr
    sureAttr() {
        let {
            attributes
        } = this.data;
        if (attributes.length > 0) {
            attributes.map((item, index) => {
                if (!item.name) {
                    app.tip("请输入属性名称。")
                    return;
                }
                if (item.details.length <= 0) {
                    app.tip("请添加选项")
                    return;
                }
            })
        } else {
            attributes = [];
        }
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        prevPage.setData({
            attributes: JSON.stringify(attributes)
        })
        wx.navigateBack({
            delta: 1
        })
    }
})