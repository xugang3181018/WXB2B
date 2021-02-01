let app = getApp()
import { payQuery, preauthQuery} from '../../api/index.js'

Page({
    data: {
        payType: app.types.payType,
        orderStatus: app.types.orderStatus,
        orderSource: app.types.orderSource,
        detail: {},
        loading:true
    },
    onLoad(options) {
        const id = options.id
        Promise.all([this.preauthQuery(id), this.orderQuery(id)]).then(res => {
            console.log(res)
            const detail = { ...res[0], ...res[1]}
           detail.payTime = app.base.strDateFormat(detail.payTime)
            console.log(JSON.stringify(detail))
            this.setData({
                detail,
                loading:false
            })
        })
    },
    orderQuery(outTradeNo){
        return payQuery({outTradeNo})
    },
    preauthQuery(outTradeNo) {
        const params = {
            outTradeNo,
            showType: 1
        }
        return preauthQuery(params)
    }
})