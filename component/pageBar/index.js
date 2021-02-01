const app = getApp()
Component({
  properties: {
    hasBar:{
      type:Boolean,
      value:false
    }
  },
  data: {

  },
  
  options: {
    styleIsolation: 'apply-shared'
  },

  lifetimes:{
    attached(){
      this.setData({
        ...app.globalData
      })
    }
  }
})
