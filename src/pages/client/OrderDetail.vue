<template>
    <div class="MyOrder">
        <div class="orderBox">
            <div class="orderMessage">
                <p class="title">订单信息</p>
                <div class="orderDetail">
                    <p>
                        <span>
                            采购单编号：
                        </span>
                        <span>
                            {{orderStatus.orderNo}}
                        </span>
                    </p>
                    <p>
                        <span>
                            采购单状态：
                        </span>
                        <span>
                            {{GoodsState[orderStatus.orderStatus]}}
                        </span>
                    </p>
                    <p>
                        <span>
                            采购单日期：
                        </span>
                        <span>
                            {{orderStatus.createTime}}
                        </span>
                    </p>
                    <p>
                        <span>
                            采购总金额：
                        </span>
                        <span>
                            {{'￥'+actuallyPaid}}
                        </span>
                    </p>
                </div>
            </div>
            <div class="orderMessage">
                <p class="title">收货人信息</p>
                <div class="takeInfo">
                    <p>
                        <span class="takeText">收货人：</span><span>{{orderStatus.contactName}}</span>
                    </p>
                    <p>
                        <span class="takeText">联系方式：</span><span>{{orderStatus.contactMobile}}</span>
                    </p>
                    <p>
                        <span class="takeText">收货地址：</span><span>{{orderStatus.address || '--'}}</span>
                    </p>
                </div>
            </div>
            <div class="orderMessage">
                <p class="title">商品信息 <span class="print" @click="onPrint">打印</span></p>
                <div class="goodsMessage">
                    <div class="goodsTitleHead">
                        <p class="listTitle">
                            <span class="goodsInfo">商品信息</span>
                            <span class="unitPrice">单价(元)</span>
                            <span class="number unitPrice">配送数量</span>
                            <span class="money unitPrice">金额(元)</span>
                            <span class="operation unitPrice">操作</span>
                        </p>
                        <p>
                            <span>配送中心：{{orderStatus.merchantName}}</span><span
                                style="margin-left:20px;">客户中心：{{orderStatus.operatorName}}</span>
                        </p>
                    </div>
                    <div v-for="(item,index) in storedetailList" class="goodsListInfo" @click.top="goDetail(item)">
                        <img v-if="item.goodsImg" class="goodsImg" :src="item.goodsImg" alt="">
                        <img v-else class="goodsImg" src="../../assets/img/default.png" alt="">
                        <div class="describe">
                            <span class="goodsName">{{item.goodsName}}</span>
                            <p class="unit">{{item.goodsUnit}}</p>
                            <span class="goodsName">{{item.goodsBarcode}}</span>
                        </div>
                        <div class="numberDetail">
                            <span>{{item.wholesalePrice}}</span>
                            <span>{{item.stockCnt}}</span>
                            <span>{{item.amount}}</span>
                            <span></span>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <p>
                        <span class="moneyText">总金额：</span><span class="moneyNumber">{{'￥'+actuallyPaid}}</span>
                    </p>
                    <div class="btn">
                        <block
                            v-if="operatorType == 0 && !(orderStatus.orderStatus == 4) && !(orderStatus.orderStatus == 2)">
                            <div class="settleAccounts" @click.stop="deleteOrder">取消</div>
                        </block>
                        <block v-if="operatorType == 1 && orderStatus.orderStatus == 0">
                            <div class="deleteOrder" @click.stop="showModal(1)">审核</div>
                            <div class="settleAccounts color" @click.stop="showModal(4)">驳回</div>
                        </block>
                        <block v-if="operatorType == 2 && orderStatus.orderStatus == 1">
                            <div class="deleteOrder" @click.stop="showModal(2)">审核</div>
                            <div class="settleAccounts color" @click.stop="showModal(4)">驳回</div>
                        </block>
                    </div>
                </div>
            </div>
            <!-- <h3>商品信息</h3>
            <div class="goodsMessage"> -->
            <!-- <div class="messageTitle">
                    <p>商品信息</p>
                    <div class="title">
                        <span>单价(元)</span>
                        <span>配送数量</span>
                        <p v-if="status == 8">
                            <span>收货数量</span>
                            <span>金额(元)</span>
                        </p>
                        <span v-else>金额(元)</span>
                        <p v-if="status == 6">
                            <span>收货数量</span>
                            <span>商品售价</span>
                        </p>
                        <span>操作</span>
                    </div>
                </div>
                <div class="goodsDtails">
                    <p class="storeName">
                        <span>配送中心：</span>
                        <span>{{orderStatus.merchantName}}</span>
                        <span style="margin-left:20px;">订单客户：</span>
                        <span>{{orderStatus.operatorName}}</span>
                        <span class="print" @click="onPrint">打印</span>
                    </p>
                    <div v-for="(item,index) in storedetailList" class="goodsData">
                        <img v-if="item.goodsImg" class="goodsImg" :src="item.goodsImg" alt="">
                        <img v-else class="goodsImg" src="../../assets/img/default.png" alt="">
                        <div class="describe">
                            <span class="goodsName">{{item.goodsName}}</span>
                            <p>{{item.goodsUnit}}</p>
                            <span class="goodsName">{{item.goodsBarcode}}</span>
                        </div>
                        <div class="numberDetail">
                            <span>{{item.wholesalePrice}}</span>
                            <span>{{item.stockCnt}}</span>
                            <span>{{item.amount}}</span>
                            <span></span>
                        </div>
                    </div>

                </div> -->
            <!-- <div class="cartFooter">
                    <div v-if="operatorType == 0 && !(orderStatus.orderStatus == 4) " class="confirmBtn">
                        <div class="settleAccounts" @click.stop="deleteOrder">取消</div>
                    </div>
                    <div v-if="operatorType == 1 && orderStatus.orderStatus == 0" class="placeOrderBtn">
                        <div class="settleAccounts color" @click.stop="showModal(4)">驳回</div>
                        <div class="deleteOrder" @click.stop="showModal(1)">审核</div>
                    </div>
                    <div v-if="operatorType == 2 && orderStatus.orderStatus == 1" class="placeOrderBtn">
                        <div class="settleAccounts color" @click.stop="showModal(4)">驳回</div>
                        <div class="deleteOrder" @click.stop="showModal(2)">审核</div>
                    </div>
                    <div class="totalMoney">
                        <span>总金额：</span>
                        <span vclass="total">{{'￥'+actuallyPaid}}</span>
                    </div>
                </div> -->
            <!-- </div> -->
        </div>
        <div v-if="popupStatus" class="popup">{{statusData}}</div>
        <Modal v-model="modalShow" title="审核/驳回" @on-ok="ok">
            <Input v-model="cause" type="textarea" placeholder="请输入原因" />
        </Modal>
        <div style="margin-bottom:40px;">
            <ul v-for="item in record">
                <li class="record">
                    <span>{{item.operationTime}}</span>
                    <span>{{item.operationName}}</span>
                    <span>{{operationType[item.operationType]}}</span>
                    <span>{{item.rejectReason}}</span>
                </li>
            </ul>
        </div>
        <div v-if="printTemplate" class="PopupWrapper" :style="{width:windowWidth+'px',height:windowHeight+'px',}"
            @click.stop="onPrint">
            <div class="print-page" style="overflow:auto;overflow-x: hidden" @click.stop="()=>{}">
                <div id="printTest" style="width:960px">
                    <div style="text-align: center;font-size:26px;font-weight:900;padding:20px;">团采订单</div>
                    <div style="overflow: hidden;">
                        <ul style="float:left;width:49%;line-height:20px;">
                            <li>
                                <p style="display:inline-block;width:100px;text-align:right;">单据编号：</p>
                                <span>{{orderStatus.orderNo}}</span>
                            </li>
                            <li>
                                <p style="display:inline-block;width:100px;text-align:right;">发货仓库：</p>
                                <span>{{merchantInfo.merchantName}}</span>
                            </li>
                            <li>
                                <p style="display:inline-block;width:100px;text-align:right;">联系电话：</p>
                                <span>{{merchantInfo.contactMobile}}</span>
                            </li>
                            <li>
                                <p style="display:inline-block;width:100px;text-align:right;">联系人：</p>
                                <span>{{merchantInfo.contactName}}</span>
                            </li>
                            <li>
                                <p style="display:inline-block;width:100px;text-align:right;">单据状态：</p>
                                <span>{{GoodsState[orderStatus.orderStatus]}}</span>
                            </li>
                        </ul>
                        <ul style="float:left;line-height:20px;">
                            <li>
                                <p style="display:inline-block;width:100px;text-align:right;">订单日期：</p>
                                <span>{{orderStatus.createTime}}</span>
                            </li>
                            <li>
                                <p style="display:inline-block;width:100px;text-align:right;">下单账号：</p>
                                <span>{{orderStatus.operatorName}}</span>
                            </li>
                            <li>
                                <p style="display:inline-block;width:100px;text-align:right;">联系电话：</p>
                                <span>{{orderStatus.contactMobile}}</span>
                            </li>
                            <li>
                                <p style="display:inline-block;width:100px;text-align:right;">联系人：</p>
                                <span>{{orderStatus.contactName}}</span>
                            </li>
                            <li>
                                <p style="display:inline-block;width:100px;text-align:right;">配送地址：</p>
                                <span>{{orderStatus.address}}</span>
                            </li>
                        </ul>
                    </div>
                    <table style="text-align: center;margin-top:30px;line-height: 26px;">
                        <tr>
                            <td style="border:1px solid #eee">序号</td>
                            <td style="border:1px solid #eee">商品条码</td>
                            <td style="border:1px solid #eee">商品名称</td>
                            <td style="border:1px solid #eee">数量</td>
                            <td style="border:1px solid #eee">单位</td>
                            <td style="border:1px solid #eee">单价</td>
                            <td style="border:1px solid #eee">金额</td>
                            <td style="border:1px solid #eee">不含税金额</td>
                            <td style="border:1px solid #eee">税率</td>
                        </tr>
                        <tr align="center" v-for="(item,index) in storedetailList">
                            <td style="border:1px solid #eee">{{index+1}}</td>
                            <td style="border:1px solid #eee">{{item.goodsCode}}</td>
                            <td style="border:1px solid #eee">{{item.goodsName}}</td>
                            <td style="border:1px solid #eee">{{item.goodsCnt}}</td>
                            <td style="border:1px solid #eee">{{item.goodsUnit}}</td>
                            <td style="border:1px solid #eee">￥{{item.wholesalePrice}}</td>
                            <td style="border:1px solid #eee">￥{{item.amount}}</td>
                            <td style="border:1px solid #eee">{{"--"}}</td>
                            <td style="border:1px solid #eee">{{"--"}}</td>
                        </tr>
                        <tr style="border:1px solid #eee">
                            <td style="border:1px solid #eee">合计</td>
                            <td style="border:1px solid #eee"></td>
                            <td style="border:1px solid #eee"></td>
                            <td style="border:1px solid #eee"></td>
                            <td style="border:1px solid #eee"></td>
                            <td style="border:1px solid #eee"></td>
                            <td style="border:1px solid #eee">￥{{actuallyPaid}}</td>
                            <td style="border:1px solid #eee"></td>
                            <td style="border:1px solid #eee"></td>
                        </tr>
                    </table>
                    <table>
                        <tr  style="line-height: 26px;text-indent: 10px;margin-bottom:60px;height:26px;">
                            <td>收货人签字：</td>
                            <td>送货人签字：</td>
                            <td>收货时间：</td>
                        </tr>
                    </table>
                </div>
                <div class="btn">
                    <div class="cancelBtn" @click="onPrint">取消</div>
                    <div v-print="'#printTest'" class="printBtn">打印</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { tuancaiAudit, purchaseOrderDetail, deletePurchaseOrder, record } from '../../api/client';
    import Popup from '../../components/Popup';
    import { dataTime, concatString, presentDataTime, concatPutString, getClientSize } from '../../util/util';

    export default {
        name: 'MyOrder',
        components: {
            Popup
        },
        computed: {
            ...mapState([
                'clientId',
                'clientCode',
                'operatorId',
                'supplierCode',
                'merchantType',
                'operatorType'
            ]),

            actuallyPaid() {
                let amount = 0;
                this.storedetailList.map((item, index) => {
                    amount += Number(item.amount);
                })
                return Number(amount.toFixed(2));
            },

            totalAmount() {
                let amount = 0;
                if (this.$route.params.status == 6) {
                    this.storedetailList.map(item => {
                        console.log(item)
                        // amount += item.goodsCostPrice * (item.stock || item.deliveryStock);
                        amount += item.amount;
                    })
                } else {
                    this.storedetailList.map((item, index) => {
                        console.log(item)
                        if (item.purchaseAmt) {
                            amount += Number(item.purchaseAmt);
                        }
                    })
                }
                return amount.toFixed(2);
            },

            //采购商品的订单状态
            status() {
                return this.$route.params.status
            },
            //供应商编码
            code() {
                return this.$route.params.code
            },
        },

        data() {
            return {
                GoodsState: { 0: "待一审", 1: "待二审", 2: "已通过", 4: "已取消", 5: "待发货 ", 6: "待收货", 7: "已收货", 8: "部分收货", 9: "已取消" },
                operationType: { 0: "保存", 1: "一审", 2: "二审", 3: "删除", 4: "驳回/取消 " },
                curIndex: 0,
                orderList: [],
                popupShow: false,
                curOrderId: '',
                curCommentGoodsId: '',
                curCommentGoodsDetailId: '',
                curStar: 0,
                hasClickStar: false,
                comment: '',
                detail: "",
                orderNumber: "",
                orderStatus: "",
                deliveryNumber: "",
                deliveryList: [],
                stockInRecordData: "",
                popupStatus: false,
                statusData: "",
                name: this.$route.params.name,
                storedetail: '',
                storedetailList: [],
                merchantInfo: "",
                cause: "",
                modalShow: false,
                record: [],
                windowWidth: getClientSize().width,
                windowHeight: getClientSize().height,
                printTemplate: false
            }
        },

        methods: {
            navTo(route) {
                this.$router.push(route);
            },

            //报错提示
            getPopupStatus(status) {
                let that = this
                that.popupStatus = !that.popupStatus
                setTimeout(function () {
                    that.popupStatus = !that.popupStatus
                    if (that.operatorType == 0) {
                        that.navTo('/mall/show/goodsList/0/all')
                    } else {
                        if (status == 0) return
                        that.navTo('/mall/personal/myOrder/0')
                    }

                }, 2000)
            },

            //采购详情
            getPurchaseOrderList() {
                purchaseOrderDetail({
                    appId: this.clientId,
                    merchantCode: this.supplierCode,
                    orderNo: this.$route.params.value,
                }).then(res => {
                    console.log(res, "采购详情")
                    if (res.code === "SUCCESS") {
                        console.log(res)
                        this.orderStatus = res.result
                        this.storedetailList = res.result.detailDtoList
                        this.merchantInfo = res.result.merchantInfo
                        console.log(this.orderList, "采购详情")
                    }
                })
            },

            //取消订单

            deleteOrder() {
                console.log(this.merchantInfo.orderId, this.merchantInfo, this.operatorId)
                deletePurchaseOrder({
                    appId: this.clientId,
                    superMerchantCode: this.clientId,
                    wholesaleOrderId: this.orderStatus.orderId,
                    operatorId: this.operatorId
                }).then(res => {
                    console.log(res, "订单取消")
                    if (res.code === "SUCCESS") {
                        this.statusData = "订单已取消"
                        console.log(res)
                        this.getPopupStatus()
                    }
                })
            },

            // 展示弹窗

            showModal(status) {
                let startTime = Date.parse(new Date(this.orderStatus.createTime)) + 604800000
                let endTime = Date.parse(new Date())
                let days = startTime - endTime
                console.log(days)
                if (days < 0) {
                    this.type = 4
                    this.submitOrder("已超过七天直接驳回")
                } else {
                    this.modalShow = true
                    this.type = status
                }
            },


            // 确定
            ok() {
                if (this.type == 4 && !this.cause) {
                    this.statusData = "请输入驳回原因"
                    this.getPopupStatus(0)
                    return
                }
                this.submitOrder()
            },

            //审核、驳回
            submitOrder(status) {
                tuancaiAudit({
                    appId: this.clientId,
                    operatorId: this.operatorId,
                    wholesaleOrderId: this.orderStatus.orderId,
                    orderStatus: this.type,
                    rejectReason: this.type == 4 ? status || this.cause : this.cause || "已通过"
                }).then(res => {
                    if (res.code === "SUCCESS") {
                        this.statusData = this.type == 4 ? status || "订单驳回" : "订单已审核"
                        this.getPopupStatus()
                    }
                })
            },

            // 操作记录

            onRecord() {
                record({
                    appId: this.clientId,
                    merchantCode: this.supplierCode,
                    recordNo: this.$route.params.value,
                }).then(res => {
                    console.log(res, "操作记录")
                    if (res.code == "SUCCESS") {
                        this.record = res.result || []
                    }
                })
            },

            // 展示打印模板
            onPrint() {
                this.printTemplate = !this.printTemplate
            },

            goDetail(data) {
                this.navTo(`/mall/show/goods/${data.goodsBarcode}/${data.goodsId}`)
                // const { href } = this.$router.resolve(`/mall/show/goods/${data.goodsBarcode}/${data.goodsId}`)
                // window.open(href, '_blank');
            },
        },

        mounted() {
            console.log(this.$route.params.value, (this.name != 'undefined'))
            this.getPurchaseOrderList()
            this.onRecord()
        },
    }
</script>

<style scoped lang="less">
    @import "../../assets/css/var.less";

    .title {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        margin-bottom: 11px;
        text-indent: 10px;

        .print {
            float: right;
            margin-right: 20px;
            color: #af7e49;
            cursor: pointer;
        }
    }

    .MyOrder {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #666666;

        /* background:#fff; */
        .PopupWrapper {
            overflow: hidden;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;
            background-color: rgba(0, 0, 0, 0.5);


            .print-page {
                overflow: hidden;
                width: 1000px;
                height: 500px;
                /* padding: 0 10px; */
                background: #fff;
                position: fixed;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: 200px auto;

                #printTest {
                    padding: 0 10px;
                }

                .btn {
                    width: 1000px;
                    height: 50px;
                    padding-left: -10px;
                    position: fixed;
                    top: 660px;
                    background: #fff;

                    div {
                        display: inline-block;
                        width: 60px;
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        border-radius: 2px;
                        color: #fff;
                    }

                    .cancelBtn {
                        background: #ccc;
                        margin-left: 420px;
                    }

                    .printBtn {
                        margin-left: 20px;
                        background: #AF7E49;
                    }
                }
            }
        }

        .popup {
            height: 50px;
            width: 160px;
            border-radius: 4px;
            padding: 0 10px;
            line-height: 50px;
            text-align: center;
            color: #fff;
            font-size: 20px;
            background: rgba(0, 0, 0, 0.6);
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
        }

        .orderBox {
            width: 100%;

            .orderMessage {
                width: 100%;
                margin-bottom: 20px;
                line-height: 22px;

                .orderDetail {
                    height: 123px;
                    background: #fff;
                    padding-left: 12px;
                    padding-top: 19px;
                }

                .takeInfo {
                    height: 100px;
                    background: #fff;
                    padding: 19px 12px;

                    .takeText {
                        display: inline-block;
                        width: 72px;
                        text-align: right;
                    }
                }

                .goodsMessage {
                    background: #fff;

                    .goodsTitleHead {
                        height: 87px;
                        border-bottom: 1px solid #f2f2f2;
                        padding-top: 21px;
                        padding-left: 22px;

                        .listTitle {
                            margin-bottom: 15px;

                            span {
                                display: inline-block;
                            }

                            .goodsInfo {
                                width: 390px;
                            }

                            .unitPrice {
                                width: 170px;
                                text-align: center;
                            }
                        }
                    }
                }

                .goodsListInfo {
                    height: 90px;
                    border-bottom: 1px solid #f2f2f2;
                    padding-top: 10px;
                    padding-left: 22px;
                    vertical-align: middle;
                    cursor: pointer;


                    .goodsImg {
                        width: 70px;
                        height: 70px;
                        border: 1px solid #f2f2f2;
                        margin-right: 14px;
                        vertical-align: middle;

                    }

                    .describe {
                        display: inline-block;
                        width: 306px;
                        vertical-align: middle;
                        line-height: 18px;
                    }

                    .numberDetail {
                        display: inline-block;

                        span {
                            display: inline-block;
                            width: 170px;
                            text-align: center;
                        }
                    }
                }

                .footer {
                    margin-top: 20px;
                    height: 60px;
                    background: #fff;

                    p {
                        display: inline-block;
                        padding-left: 24px;
                        line-height: 60px;

                        .moneyText {
                            font-size: 14px;
                        }

                        .moneyNumber {
                            font-size: 20px;
                            color: #F66F51;
                        }
                    }

                    .btn {
                        float: right;
                        text-align: center;
                        line-height: 60px;
                        font-size: 18px;
                        font-family: PingFangSC-Medium;

                        .settleAccounts {
                            display: inline-block;
                            width: 170px;
                            height: 60px;
                            background: #DBDBDB;
                        }

                        .deleteOrder {
                            display: inline-block;
                            width: 170px;
                            height: 60px;
                            background: #AF7E49;
                            color: #fff;
                        }

                        .color {
                            background: #F66F51;
                            color: #fff;
                        }
                    }
                }

                /* .record{
                    line-height:22px
                } */
            }
        }

        .record {
            line-height: 30px;
            font-size: 12px;
            color: #999;

            span {
                margin-left: 10px;
            }
        }

        .popupContent {
            padding: 10px;

            .scoreBox {
                width: 100%;
                height: 50px;
                position: relative;
                line-height: 50px;
                text-align: left;

                .tips {
                    font-size: 15px;
                    vertical-align: middle;
                    display: inline-block;
                }

                i {
                    cursor: pointer;
                    vertical-align: middle;
                    display: inline-block;
                    font-size: 25px;
                    margin-right: 5px;
                    -webkit-text-stroke: 1px #f9bd4f;
                }
            }

            textarea {
                width: 400px;
                height: 80px;
                padding: 5px;
                border: 1px solid @borderColor;
                display: block;
                margin-top: 10px;
            }

            button {
                display: block;
                margin: 10px auto;
                width: 70px;
                height: 30px;
                border-radius: 3px;
                background-color: #313541;
                color: white;
                border: none;
            }
        }
    }
</style>