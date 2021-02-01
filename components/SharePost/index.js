
Component({
  properties: {
    post:{
      type:Object,
      value:{}
    },
		width:{
			type:String,
			value:0
		},
		height:{
			type: String,
			value: 0
		}
  },
  data: {
		open:false,
		width:0,
		height:0,
		src:null
  },
  options: {
    addGlobalClass: true,
  },
	observers: {
		'post': (post) => {
		}
	},
  lifetimes: {
    attached() {
			
    }
  },
  methods: {
    renderToCanvas() {
			wx.showLoading()
			const {wxml,style} = this.data.post
			// setTimeout(() =>{
			// 	const p1 = this.widget.renderToCanvas(this.data.post)
			// 	console.log(this.data.post)
			// 	console.log(p1)
			// 	p1.then((res) => {
			// 		console.log(res)
			// 		this.container = res
			// 		if(!this.data.post.screWidth) {
			// 			this.setData({
			// 				...res.layoutBox
			// 			})
			// 		} else {
			// 			this.setData({
			// 				width: this.data.post.screWidth,
			// 				height: this.data.post.screHeight
			// 			})
			// 		}
					
			// 	})
			// // },500)
			
			// setTimeout(()=>{
			// 	this.extraImage()
			// }, 4500)


      const p1 = this.widget.renderToCanvas({
        wxml,
        style
      })
      p1.then((res) => {
        this.container = res
        this.setData({
          width: res.layoutBox.width,
          height: res.layoutBox.height
        })
        this.extraImage()
      }).catch(function(error) {
        wx.hideLoading()
        console.log('发生错误！', error);
      });
    },
    extraImage() {
      this.widget.canvasToTempFilePath({fileType:'jpg',quality: 80}).then(res => {
				console.log(res)
				wx.hideLoading()
				this.setData({
					src:res.tempFilePath
				})
      }).catch(err=>{
				console.log(err)
			})
    },
		togglePost(){
			const open = !this.data.open
			this.setData({
				open,
			})
			wx.nextTick(() => {
				if (open) {
					this.widget = this.selectComponent('#widget')
					wx.showLoading()
					setTimeout(()=>{
						this.renderToCanvas()
					},500)
				}
			})
		},
		// 保存海报
		downLoadPost() {
			wx.saveImageToPhotosAlbum({
				filePath: this.data.src,
				success: (data) => {
					console.log(data)
					wx.showModal({
						title: '保存成功',
						content: '图片已保存到相册，快去发布朋友圈吧！',
						showCancel: false,
						confirmText: "我知道了"
					})
				},
			})
		}
  },

})
