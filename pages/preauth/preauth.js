let app = getApp()
import { bill } from '../../api/index.js'

Page({
    data: {
        bill: {},
        loading: true,
        payType: app.types.payType,
        orderStatus: app.types.orderStatus
    },
    onLoad(options) {

    },
    swtichTab(e) {
        console.log(e)
        const type = e.detail
        console.log(type)
        switch (type) {
            case 0:
                this.preauthQuery({})
                break
            case 1:
                this.preauthQuery({ orderStatus:'REVOKED'})            
                break
            case 2:
                this.preauthQuery({ orderStatus: 'SUCCESS' })
                break
        }
    },
    toDetail(e){
        wx.navigateTo({
            url: `/pages/preauthDetail/preauthDetail?id=${e.currentTarget.dataset.id}`
        })
    },
    preauthQuery(arg) {
        this.setData({
            loading:true
        })
        let params = {
            merchantCode: app.merchant.merchantCode,
            orderType: 6,
            pageSize: 50
        }
        if(arg){
            params = {...params,...arg}
        }
        return bill(params).then(bill => {
            console.log(bill)
            function toDate(orderDetails) {
                if (orderDetails) {
                    let str = orderDetails
                    for (let i in str) {
                        if (str[i].payTime) {
                            str[i].payTime = app.base.strDateFormat(str[i].payTime)
                        }
                    }
                }
            }
            toDate(bill.orderDetails)
            this.setData({
                bill,
                loading: false,
            })
        })
    },
    onShow() {
        this.preauthQuery()
    }
})