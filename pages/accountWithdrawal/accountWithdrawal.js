let app = getApp()
import { ksApi } from '../../api/index.js'
var base = require('../../utils/util.js')

Page({
    data: {
        phone: "15210719964",
        endTime: 0,
        disableSend: true,
        bank: require('bank.js'),
        checkOk: false
    },
    onLoad(options) {
        let selBag = wx.getStorageSync("selBag")
        let cardNo = selBag.balanceAccount
        let cardNos = ''
        for (let i in cardNo) {
            if (i > 3 && i < 12) {
                cardNos += '*'
            } else {
                cardNos += cardNo[i]
            }
        }
        console.log(cardNos)
        this.setData({
            balance: wx.getStorageSync("balance"),
            selBag: wx.getStorageSync("selBag"),
            storeDetail: wx.getStorageSync("storeDetail"),
            cardNo: cardNos
        })
    },
    withdraw() {
        let params = {

        }
    },
    allTotal() {
        this.setData({
            total: this.data.balance.availableBalance
        })
    },
    changeTotal(e) {
        if (e.detail.value > this.data.balance.availableBalance) {
            wx.showToast({
                title: '提取金额不能大于可提取金额',
                icon: "none",
            })
            this.setData({
                total: ''
            })
        } else {
            this.setData({
                total: e.detail.value
            })
        }
    },
    sendCode() {
        this.setData({
            endTime: 60
        })
        this.setTime()
        this.getPhoneCode()
    },

    setTime() {
        let endTime = this.data.endTime
        if (this.data.endTime > 0) {
            this.setData({
                endTime: endTime - 1
            })
        } else {
            this.setData({
                endTime: 0
            })
        }
        setTimeout(() => {
            this.setTime()
        }, 1000)
    },
    getPhoneCode() {
        let balance = this.data.balance
        let params = {
            version: '1.0',
            input_charset: 'UTF-8',
            service: 'kshbank_sms_send',
            partner_id: '18110120453815253',
            core_merchant_no: 'KS_N1453170986',
            fund_pool_no: "PN01000000000000213",
            payment_id: '3',
            out_trade_no: '82934829348203947829387423',
            pay_channel: 'ZF0016_01_001',
            phone_no: this.data.phone
        }
        ksApi(params, '519e220dc1cc6ab517ffff60b59a8d51').then(res => {
            console.log(res)
            if (res.is_success == 'S') {
                let data = JSON.parse(res.thirdData)
                console.log(data)
                this.setData({
                    verCode: data.verCode
                })
            } else {
                wx.showToast({
                    title: '获取验证码失败',
                    icon: 'none'
                })
            }
        })
    },
    changePhone(e) {
        let phone = e.detail.value
        let storeDetail = this.data.storeDetail
        if (phone.length == 11) {
            // let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/

            // if (!reg.test(phone)) {
            //     wx.showToast({
            //         title: '请输入正确的手机号',
            //         icon: 'none'
            //     })
            // }
            if (phone != storeDetail.batchWithdrawPhone) {
                wx.showToast({
                    title: '请输入银行预留手机号',
                    icon: 'none'
                })
            }
            this.setData({
                disableSend: phone != storeDetail.batchWithdrawPhone ? true : false,
                phone: e.detail.value
            })
        } else if (phone == storeDetail.batchWithdrawPhone) {
            this.setData({
                disableSend: true,
                phone: e.detail.value
            })
        } else {
            this.setData({
                disableSend: true,
                phone: e.detail.value
            })
        }
    },
    verCode(e) {
        this.setData({
            checkOk: e.detail.value == this.data.verCode ? true : false
        })
    },
    withdrawal() {
        if (this.data.total > 0 && this.data.total != '') {
            let store = this.data.storeDetail,
                balance = this.data.balance,
                selBag = this.data.selBag,
                bank = this.data.bank,
                storeDetail = this.data.storeDetail
            let other_attachment_group_json = {
                accountType: `${balance.accountType}${balance.accountType}`,
                bankAccountName: storeDetail.accountHolder,
                certCode: storeDetail.certificateNo
            }
            if (balance.accountType == 1) {
                other_attachment_group_json.phoneNumber = storeDetail.mobile
            } else if (balance.accountType == 2) {
                toCityName = storeDetail.subbranchCity
                other_attachment_group_json.publicBankName = bank[store.bank]
                other_attachment_group_json.toProName = storeDetail.subbranchProvince
                other_attachment_group_json.subbranchName = storeDetail.subbranchName
            }
            console.log(other_attachment_group_json)
            let params = {
                version: '1.0',
                input_charset: 'UTF-8',
                service: 'trade_single_withdraw_remittance',
                partner_id: '18042621422975713',
                core_merchant_no: balance.coreMerchantNo,
                fund_pool_no: balance.poolNo,
                out_trade_no_ext: `${new Date().Format('yyyyMMddhhmmss')}${base.randomNum(6)}`,
                merchant_extend_field_1: store.bank, //银行名称
                merchant_extend_field_2: bank[store.bank], //银行名称
                merchant_extend_field_3: store.storeCode, //来自【门店详情】接口返回【门店编号】
                merchant_extend_field_4: store.storeFullName, //来自【门店详情】接口返回【门店名称】
                merchant_extend_field_5: store.agentNo, //来自【门店详情】接口返回【代理商编号】
                withdraw_account_no: balance.accountNo, //提现账户编号
                pay_channel: 'ZF0016_01_004',
                pay_transaction_id: "000000000015208",
                withdraw_account_out_amt: this.data.total, //支付渠道身份编号
                pay_amount: this.data.total,
                receive_account: this.data.selBag.balanceAccount,
                other_attachment_group_json: JSON.stringify(other_attachment_group_json)
            }
            ksApi(params).then(res => {
                if (res.is_success == 'S'){
                    console.log(res)
                    wx.setStorageSync("thirdData", JSON.parse(res.thirdData))
                    wx.setStorageSync("tradeDetails", JSON.parse(res.tradeDetails))
                    wx.navigateTo({
                        url: '/pages/accountWithdrawalRes/accountWithdrawalRes',
                    })
                }else{
                    wx.showToast({
                        title: '提现失败',
                        icon:'none'
                    })
                }
            })
        }else{
            wx.showToast({
                title: '请输入提现金额',
                icon:'none'
            })
        }
    }
})