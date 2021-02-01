import categorgJS from './data/category'
import bankJS from './data/bank'
import areaJS from './data/area'
import areaLsSS from './data/area_ls_ss'
import areaLsSSQ from './data/area_ls_ssq'
import areaLsHF from './data/area_hf'
import tradeJS from '/data/trade'
const app = getApp()

Component({
  properties: {
    type: String, // area, bank, bankArea, category
    category: String, // 经营类目的级别
    categoryId: String, // 上一级经营类别的id
    passType: String, // 银行通道 7网商 8客商 9乐刷
    merchantType: { // 商户类型，目前只在汇付通道使用
      type: String,
      value: null
    },
    firstId: { // 一级经营类别的ID，目前只在汇付使用
      type: String,
      value: null
    },
    columnAry: {
      type: Object,
      value: null,
    }, // 地区反选值
    columnStr: {
      type: String,
      value: '',
    }, // 经营类目、银行名称反选值
    disabled: { // 是否可用
      type: Boolean,
      value: false,
    },
  },

  data: {
    column: ['0', '0', '0'], // 当前选项的索引
    allRange: [], // 所有省市区的数据
    range: [], // 当前的省市区
    select: null,
  },

  ready() {
    this.initData()
  },

  methods: {
    // 初始化数据
    initData() {
      let {passType, category, columnAry, columnStr, type, select} = this.data 
      let rangeArray = null
      let allRange = null
      let range = null
      let mode = 'multiSelector'
      switch (type) {
        case 'area':
          //地区
          if (passType === '9') {
            rangeArray = areaLsSSQ
          } else if (passType === '11') {
            rangeArray = areaLsHF
          } else {
            rangeArray = areaJS
          }
          allRange = this.setArrary(rangeArray)
          range = this.initRange(allRange)
          if (columnAry) select = columnAry
          break
        case 'bankArea':
          //银行所属地区
          if (passType === '9') {
            rangeArray = areaLsSS
          } else if (passType === '11') {
            rangeArray = areaLsHF
          } else {
            rangeArray = areaJS
          }
          allRange = this.setArrary(rangeArray).slice(0, 2)
          range = this.initRange(allRange)
          this.setData({column: ['0', '0']})
          if (columnAry) select = columnAry
          break
        case 'trade':
          // 所属行业
          rangeArray = tradeJS
          allRange = this.setArrary(rangeArray)
          range = this.initRange(allRange)
          this.setData({column: ['0', '0']})
          if (columnAry) select = columnAry
          break
        case 'bank':
          //银行
          rangeArray = bankJS[passType]
          allRange = rangeArray
          range = []
          allRange.map((item, index) => {
            range[index] = item.split('|')
          })
          mode = 'selector'
          if (columnStr) select = {bankName: columnStr}
          break
        case 'category':
          rangeArray = categorgJS[passType]
          if (passType === '7') { // 网商经营类目
            allRange = rangeArray
            range = []
            rangeArray.map((item, index) => {
              range[index] = item.split('|')
            })
          } else {
            allRange = this.setArrary(rangeArray)
            allRange = category === '1' ? allRange[0] : (category === '2' ? allRange[1] : allRange[2])
            range = this.initRange(allRange)
          }
          mode = 'selector'
          if (columnStr) select = {category: columnStr}
          break
        default: null
      }
      this.setData({allRange, range, mode, select})
    },

    // 格式化数据，有几级数据拆分几个大数组，里边的数据按照‘|’拆分成小数组
    setArrary(data) {
      const _arrary = [[], [], []]
      const toArrary = (item) => {
        return item.split('|')
      }
      data.map((item, index) => {
        _arrary[index] = item.map(toArrary)
      })
      return _arrary
    },

    // 初始化pickers选项
    initRange(range) {
      let info
      const {type, category, categoryId, passType, merchantType} = this.data
      switch (type) {
        case 'area':
          info = [range[0], this.getNode(range[1], range[0][0][0]), this.getNode(range[2], range[1][0][0])]
          break
        case 'bankArea':
          info = [range[0], this.getNode(range[1], range[0][0][0])]
          break
        case 'trade':
          info = [range[0], this.getNode(range[1], range[0][0][0])]
          break
        case 'category':
          if (category === '1') {
            switch (passType) {
              case '8':
                if (merchantType === '0') {
                  range = [range[1]]
                }
                break
              case '11':
                if (merchantType < 2) {
                  range = [range[0]]
                } else {
                  range.splice(0, 1)
                }
                break
              default: null
            }
            info = range
          } else {
            info = this.getNode(range, categoryId)
          }
          break
        default: null
      }
      return info
    },

    // 根据前一级的地区id，获取相应的列表
    getNode(data, id) {
      const {category, passType, firstId} = this.data
      if (passType === '11' && category === '3') { // 汇付第三级经营类目，需要根据第一级和第二级共同判断
        data = data.filter((value) => {
          return value[3] === firstId
        })
      }
      return data.filter((value) => {
        return value[2] === id
      })
    },

    // 改变picker选项
    checkChange(e) {
      const data = {}
      let {range, type, select, passType, category} = this.data
      const value = e.detail.value
      switch (type) {
        case 'area':
          data['province'] = range[0][value[0]][1]
          data['provinceId'] = range[0][value[0]][0]
          data['city'] = range[1][value[1]][1]
          data['cityId'] = range[1][value[1]][0]
          data['area'] = range[2][value[2]][1]
          data['areaId'] = range[2][value[2]][0]
          select = data
          break
        case 'bankArea':
          data['subbranchProvince'] = range[0][value[0]][1]
          data['subbranchProvinceId'] = range[0][value[0]][0]
          data['subbranchCity'] = range[1][value[1]][1]
          data['subbranchCityId'] = range[1][value[1]][0]
          select = data
          break
        case 'trade':
          data['trade'] = range[0][value[0]][1]
          data['tradeId'] = range[0][value[0]][0]
          data['category'] = range[1][value[1]][1]
          data['categoryId'] = range[1][value[1]][0]
          select = data
          break
        case 'bank':
          data['bankName'] = range[value][1]
          data['bank'] = range[value][0]
          select = {bankName: range[value][1]}
          break
        case 'category':
          data['businessCategoryName'] = range[value][1]
          data['businessCategory'] = range[value][0]
          data['aliId'] = passType === '11' && category === '3' ? range[value][4] : null
          select = {category: range[value][1]}
          break
        default: null
      }
      this.setData({select})
      this.triggerEvent('pickers', data)
    },

    

    // 改变当前显示的列表
    columnChange(e) {
      let {allRange, column, type, range} = this.data
      column[e.detail.column] = e.detail.value
      if (type === 'area') {
        switch (e.detail.column) {
          case 0:
            let city = this.getNode(allRange[1], range[0][e.detail.value][0])
            range = [range[0], city, this.getNode(allRange[2], city[0][0])]
            column[1] = 0
            column[2] = 0
            break
          case 1:
            column[2] = 0
            range = [range[0], range[1], this.getNode(allRange[2], range[1][e.detail.value][0])]
            break
          case 2:
            range = range
            break
        }
      } else if ((type === 'bankArea' || type === 'trade') && e.detail.column === 0) {
        range = [range[0], this.getNode(allRange[1], range[0][e.detail.value][0])]
        column[1] = 0
      }
      this.setData({column, range})
    }
  }
})
