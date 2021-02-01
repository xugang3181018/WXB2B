Page({
  data: {
    showBottom: false,
    quotaPopup: false,
    qoutaMoney: "",
    money: ""
  },
  onLoad() {
  },
  //监听键盘事件
  onShow() {
    my.ix.onKeyEventChange((r) => {
      if (r.keyCode === 133) {
        my.reLaunch({ url: '../home/home' })
      }
    });
  },

  //取消键盘监听
  onHide() {
    my.ix.offKeyEventChange();
  },

  //模态窗显示
  onButtomBtnTap() {
    this.setData({
      showBottom: true,
    });
  },

  //模态窗隐藏
  onPopupClose() {
    this.setData({
      showBottom: false,
    });
  },

  //跳转交接班结算页
  onBalance() {
    my.showLoading({
      content: '加载中...',
    });
    my.navigateTo({ url: '../connectClass/connectClass' })
    my.hideLoading();
    this.onPopupClose()
  },

  //跳转结算记录页
  onRecord() {
    my.showLoading({
      content: '加载中...',
    });
    my.navigateTo({ url: '../recore/recore' })
    my.hideLoading();
    this.onPopupClose()
  },

  //跳转汇总查询页
  onCollect() {
    my.navigateTo({ url: '../groupQuery/groupQuery' })
  },

  //跳转订单流水页
  onShiftRecords() {
    my.navigateTo({ url: '../orderFlow/orderFlow' })
  },

  // 设置定额
  onSettingMoney() {
    console.log("设置定额")
    this.setData({
      quotaPopup: true
    })
  },

  // 获取定额金额
  handleMoney(e) {
    let money = Number(e.detail.value.match(/^\d+(?:\.\d{0,2})?/))
    console.log(money)
    this.setData({
      money
    })
  },

  //定额取消键
  cancel() {
    this.setData({
      quotaPopup: false
    })
  },

  // 定额确认键
  confirm() {
    let { money } = this.data
    if (money) {
      my.setStorageSync({
        key: 'money',
        data: money
      });
      this.setData({
        quotaPopup: false
      })
      my.showToast({
        type: 'null',
        content: '定额设置成功',
        duration: 1000,
      });
      setTimeout(function () {
        my.navigateBack()
      }, 1000)
    } else {
      my.showToast({
        type: 'null',
        content: '请输入金额',
        duration: 1000,
      });
    }
  },

  // 取消定额
  onCancel() {
    let money = my.getStorageSync({ key: "money" }).data
    console.log(money)
    if (!money) {
      my.showToast({
        type: 'null',
        content: '暂未设置定额',
        duration: 1000,
      });
    } else {
      my.confirm({
        title: '取消定额',
        content: '确认要取消定额吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        success: (result) => {
          if (result.confirm) {
            my.removeStorageSync({
              key: 'money',
            });
            my.showToast({
              type: 'null',
              content: '定额取消成功',
              duration: 1000,
            });
          }
        },
      });
    }
  },

  //跳转设置页面
  onSetting() {
    my.ix.startApp({
      appName: 'settings',
    });
  },

  //退出登录
  onMember() {
    my.reLaunch({ url: "/pages/login/login" })
  },
});
