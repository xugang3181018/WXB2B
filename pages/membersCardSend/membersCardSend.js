let app = getApp(),
 qrcode = require('../../libs/qrcode/code.js')
import { memberCardTemplate } from '../../api/index.js'

Page({

    data: {

    },
    onLoad (options) {
        this.memberCardTemplate()
    },
    onReady(){
        this.qrcode()
    },
    qrcode(){
        let code = `http://club.liantuobank.com/m/${app.commonParams('merchantId')}/memberCard.htm`
        qrcode.createQrCode(code, "cardId", 250, 250);
    },
    memberCardTemplate(){
        memberCardTemplate({}).then(res=>{
            console.log(res);
        })
    },
   
})