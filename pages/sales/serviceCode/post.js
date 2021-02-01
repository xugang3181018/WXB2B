const wxml = item => {
  const userLoginInfo = item.info.headImgUrl ? `<image src="${item.info.headImgUrl}" class="user-login-image"></image>` : `<image src="https://xiaomall-1253818706.file.myqcloud.com/xiaomall/f8c19383-49f6-4977-a60b-04574e804fc9" class="user-login-image"></image>`
  item.qrCode = (item.qrCode && item.qrCode.indexOf('http:') != -1) ? item.qrCode.replace(/http:/, 'https:') : (!item.qrCode? '':ImageBitmapRenderingContext.qrCode)
  const userQr = item.qrCode ? `<image src="${item.qrCode}" class="qr-code-image"></image>` : ``

  return `<view class="prompt-box">
  <view class="prompt-content-box">
    <image src="${item.postImg}" class="prompt-img"></image>
    <view class="sales-info">
      <view class="user-login">
      ${userLoginInfo}
      </view>
      <view class="sales-user">
        <text class="sales-name">${item.info.name}</text>
        <text class="sales-shop">${item.info.merchantName}</text>
      </view>
      <view class="qr-code">
        ${userQr}
      </view>
    </view>
  </view>
</view>`
}
const style = item => {
  return {
    promptBox: {
      width: 300,
      height: 472,
      position: 'relative',
      backgroundColor: "#fff",
      color: "#000",
      fontSize: 16,
    },

    promptImg: {
      width: 300,
      height: 472,
    },

    salesInfo: {
      position: 'absolute',
      bottom: 82.73,
      left: 10,
      width: 279.2,
      backgroundColor: '#fff',
      borderRadius: 3,
      boxShadow: 'rgba(125, 125, 125, 1)',
      height: 72,
      paddingTop: 10.34,
      paddingLeft: 10.34,
      paddingRight: 10.34,
      justifyContent: 'space-around',
      flexDirection: 'row',
			alignItems: 'flex-start',
    },

    userLogin: {
      width: 51.7,
      height: 51.7,
      borderRadius: 25.85,
      backgroundColor: '#00cc99',
    },

    userLoginImage: {
      width: 51.7,
      height: 51.7,
    },

    salesUser: {
      width: 106.515,
      height: 51.7,
      fontSize: 14,
      flexFlow: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    salesName: {
      width: 106.515,
      height: 20.68,
      lineHeight: 20.68,
      fontSize: 14,
      color: `#000`,
      fontWeight: 600,
    },
    salesShop: {
      width: 106.515,
      height: 20.68,
      fontSize: 10,
      color: '#7f7f7f',
    },
    qrCode: {
      display: 'flex',
      flexFlow: 'column',
      alignItems: 'center',
      width: 51.7,
      height: 51.7,
    },
    
    qrCodeImage: {
      width: 51.7,
      height: 51.7,
    }
  }
}
export const post = arg => {
  console.log(arg)
  return {
    wxml: wxml(arg),
    style: style(arg),
    width: 300,
    height: 182 + 130 + 50 + 40,
    screWidth: 300,
    screHeight: 472,
  }
}