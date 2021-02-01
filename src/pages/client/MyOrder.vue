<template>
  <div class="MyOrder">
    <div class="tabs">
      <ul class="tagList">
        <li :class="{selected:curIndex===index}" v-for="(item,index) in tagList" :key="'tag'+index"
          @click="changeIndex(index)">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="searchBox">
      <div class="search-box">
        <i class="iconfont icon-search" @click="searchBlur" />
        <input type="text" class="TextInput" v-model="message" @keyup.enter.prevent="searchBlur"
          placeholder="请输入订单编号" />
        <span @click="searchBlur">搜索</span>
      </div>
      <!-- <div class="search-box">
        <input type="text" class="TextInput" v-model="message" @keyup.enter.prevent="searchBlur"
          placeholder="请输入订单编号" />
        <span @click="searchBlur" class="search">搜索</span>
      </div> -->
    </div>
    <div style="height:58px;"></div>
    <div v-if="orderList" class="orderBox">
      <div class="orderTableHeader">
        <!-- <span></span> -->
        <span class="order-number ">订单编号</span>
        <span class="take-person wholesale">配送中心</span>
        <span class="take-person wholesale">订单客户</span>
        <span class="take-person">收货人</span>
        <span class="goods-money take-person">商品金额(元)</span>
        <span class="goods-number take-person">商品数量</span>
        <span class="order-time">下单时间</span>
        <span class="order-status take-person">订单状态</span>
        <span class="deleteBtn">操作</span>
      </div>
      <ul class="orderList">
        <li v-for="item in orderList">
          <div class="orderDetail">
            <div class="orderId"
              @click="detail(item.orderNo,item.orderStatus,item.wholesaleMerchantName,item.supplierCode)">
              <span>{{item.orderNo}}</span>
              <!-- <p>配送中心：{{item.merchantName}}</p>
              <span>订货客户：{{item.wholesaleMerchantName}}</span> -->
            </div>
            <div class="wholesale"><span>{{item.merchantName || "--"}}</span></div>
            <div class="wholesale"><span>{{item.wholesaleMerchantName || "--"}}</span></div>
            <span class="name">{{item.contactName || "--"}}</span>
            <span class="amount">{{'￥'+item.orderAmt}}</span>
            <span class="amount state">{{item.orderGoodsCount}}</span>
            <div class="orderTime">
              <p>{{item.createTime}}</p>
              <span>{{item.pastTime}}</span>
            </div>
            <span class="state">{{GoodsState[item.orderStatus]}}</span>
            <p class="deleteBtn" v-if="!(item.orderStatus == 4)">
              <span v-if="operatorType == 0 && item.orderStatus == 0" @click="deleteOrder(item.orderId)">取消</span>
              <span v-if="operatorType == 1 && item.orderStatus == 0 || operatorType == 3 && item.orderStatus == 0"
                @click="showModal(1,item)">一审</span>
              <span v-if="operatorType == 2 && item.orderStatus == 1 || operatorType == 3 && item.orderStatus == 1"
                @click="showModal(2,item)">二审</span>
              <span
                v-if="operatorType == 1 && item.orderStatus == 0 || operatorType == 2 && item.orderStatus == 1 || operatorType == 3"
                @click="showModal(4,item)" style="margin-left:16px;color:red">驳回</span>
            </p>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="popupStatus" class="popup">{{statusData}}</div>
    <Modal v-model="modalShow" title="审核/驳回" @on-ok="ok">
      <Input v-model="cause" type="textarea" placeholder="请输入原因" />
    </Modal>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { purchaseOrderList, purchaseOrderDetail, deletePurchaseOrder, selectGoodsDeliver, tuancaiAudit } from '../../api/client';
  import { dataTime, getLocalItem } from '../../util/util';
  import Popup from '../../components/Popup';
  import TipsInput from "../../components/TipsInput";

  export default {
    name: 'MyOrder',
    components: {
      Popup,
      TipsInput
    },
    computed: {
      ...mapState([
        'clientId',
        'clientCode',
        'clientName',
        'supplierCode',
        'merchantType',
        'operatorType',
        'operatorId'
      ]),
    },
    data() {
      return {
        value5: '',
        modalShow: false,
        tagList: ['全部订单', '待一审', '待二审', '已通过', '已取消/驳回'],
        GoodsState: { 0: "待一审", 1: "待二审", 2: "已通过", 4: "已取消/驳回", 5: "待发货 ", 6: "待收货", 7: "已收货", 8: "部分收货", 9: "已取消" },
        curIndex: 0,
        orderList: "",
        popupShow: false,
        curOrderId: '',
        curCommentGoodsId: '',
        curCommentGoodsDetailId: '',
        curStar: 0,
        hasClickStar: false,
        comment: '',
        orderNumber: "",
        pagenum: 1,
        totalnum: 1,
        // status:""
        message: "",
        statusData: "",
        popupStatus: false,
        cause: "",
        orderStatus: "",
        orderId: '',
        searchText: ""
      }
    },

    methods: {
      //显示弹窗
      showModal(orderStatus, data) {
        let startTime = Date.parse(new Date(data.createTime)) + 604800000
        let endTime = Date.parse(new Date())
        let date = startTime - endTime
        if (date < 0) {
          this.orderStatus = 4
          this.submitOrder("已超过七天直接驳回")
        } else {
          this.modalShow = true
          this.orderStatus = orderStatus
        }
        this.orderId = data.orderId
      },
      // 确认
      ok() {
        if (this.orderStatus == 4 && !this.cause) {
          this.statusData = "请输入驳回原因"
          this.getPopupStatus(0)
          return
        }
        this.submitOrder()
      },

      //审核和驳回
      submitOrder(type) {
        tuancaiAudit({
          appId: this.clientId,
          operatorId: this.operatorId,
          wholesaleOrderId: this.orderId,
          orderStatus: this.orderStatus,
          rejectReason: this.orderStatus == 4 ? type || this.cause : this.cause || "已通过"
        }).then(res => {
          console.log(res)
          if (res.code === "SUCCESS") {
            this.pagenum = 1
            this.statusData = this.orderStatus == 4 ? type || "订单驳回" : "订单已审核"
            this.getPopupStatus()
            this.getPurchaseOrderList()
          } else {
            this.statusData = res.msg
            this.getPopupStatus()
          }
        })
      },

      ...mapMutations({
        setCurIndex: "CLEAR_CURINDEX",
      }),
      searchBlur(e) {
        console.log(this.message, "搜索框输入的内容", e)
        this.getPurchaseOrderList(0, this.message)
      },
      changeIndex(i) {
        // this.setCurIndex(i)
        this.curIndex = i
        this.getPurchaseOrderList(i);
      },
      navTo(route) {
        this.$router.push(route);
      },
      getPurchaseOrderList(index, orderNo = "") {
        console.log(this.pagenum)
        let params
        let data
        let status
        switch (index) {
          case 0:
            this.pagenum = 1;
            break;
          case 1:
            status = '0';
            this.pagenum = 1;
            break;
          case 2:
            status = '1';
            this.pagenum = 1;
            break;
          case 3:
            status = '2';
            this.pagenum = 1;
            break;
          case 4:
            status = 4;
            this.pagenum = 1;
            break;
          case 5:
            status = 9;
            this.pagenum = 1;
            break;
        }
        if (status) {
          params = {
            appId: this.clientId,
            orderNo: orderNo,
            merchantCode: this.supplierCode,
            wholesaleMerchantCode: this.clientCode,
            currentPage: this.pagenum,
            orderStatus: !orderNo ? status : "",
            pageSize: 20,
            orderType: 0,
          }
        } else {
          params = {
            appId: this.clientId,
            orderNo: orderNo,
            merchantCode: this.supplierCode,
            wholesaleMerchantCode: this.clientCode,
            currentPage: this.pagenum,
            pageSize: 20,
            orderType: 0,
          }
        }
        if (this.operatorType != 0) {
          params = JSON.parse(JSON.stringify(params).replace(/wholesaleMerchantCode/g, 'wholesaleMerchantCodes'));
        }
        // console.log(data)
        console.log(params)
        purchaseOrderList(params).then(res => {
          if (res.code === "SUCCESS") {
            if (this.pagenum == 1) {
              console.log(res)
              if (!res.result.items) {
                this.orderList = false
              } else {
                this.$nextTick(() => {
                  // this.pagenum = 2
                  this.totalnum = res.result.pageCount
                  this.orderList = res.result.items
                  this.addPastTime(res.result.items)
                })
              }
            } else if (this.pagenum > 1 && res.result.items) {
              this.$nextTick(() => {
                this.orderList = [
                  ...this.orderList,
                  ...res.result.items
                ]
                this.addPastTime([
                  ...this.orderList,
                  ...res.result.items
                ])
              })
            }
            ++this.pagenum
          }
        })
      },

      addPastTime(list) {
        console.log(list)
        list.map(item => {
          console.log(item)
          let startTime = Date.parse(new Date(item.createTime)) + 604800000
          let endTime = Date.parse(new Date())
          let date = startTime - endTime
          if (date > 0) {
            let days = Math.floor(date / (24 * 3600 * 1000))
            //计算出小时数
            let leave1 = date % (24 * 3600 * 1000)  //计算天数后剩余的毫秒数
            let hours = Math.floor(leave1 / (3600 * 1000))
            //计算相差分钟数
            let leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
            let minutes = Math.floor(leave2 / (60 * 1000))
            //计算相差秒数
            let leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
            let seconds = Math.round(leave3 / 1000)
            item.pastTime = "剩余 " + days + "天 " + this.formatTime(hours) + ":" + this.formatTime(minutes) + ":" + this.formatTime(seconds)
          } else {
            item.pastTime = "剩余 00:00:00"
          }
        })
        this.orderList = list
      },

      //为时间添加导零
      formatTime(time) {
        if (time < 10) {
          time = '0' + time
        }
        return time
      },

      detail(recordNo, status, name, code) {
        console.log(recordNo, status)
        this.navTo('/mall/personal/OrderDetail/' + recordNo + "/" + status + "/" + name + "/" + code)
      },
      setCurStar(star) {
        if (this.hasClickStar) {
          return;
        }
        this.curStar = star;
      },
      confirmStar(star) {
        this.curStar = star;
        this.hasClickStar = true;
      },

      //取消订单

      deleteOrder(orderId) {
        deletePurchaseOrder({
          appId: this.clientId,
          superMerchantCode: this.clientId,
          wholesaleOrderId: orderId,
          operatorId: this.operatorId
        }).then(res => {
          if (res.code === "SUCCESS") {
            this.pagenum = 1
            this.statusData = "订单已取消"
            console.log(res)
            this.getPopupStatus()
            this.getPurchaseOrderList()
          }
        })
      },

      //报错提示
      getPopupStatus(type) {
        let that = this
        that.popupStatus = !that.popupStatus
        setTimeout(function () {
          that.popupStatus = !that.popupStatus
          if (type == 0) {
            that.modalShow = true
          }
        }, 2000)
      },
    },

    created() {
      console.log("下拉加载")
      let that = this
      window.onscroll = function () {
        //变量scrollTop是滚动条滚动时，距离顶部的距离
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        //变量windowHeight是可视区的高度
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        //变量scrollHeight是滚动条的总高度
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        //滚动条到底部的条件
        console.log(Math.ceil(scrollTop + windowHeight), scrollHeight)
        if (Math.ceil(scrollTop + windowHeight) >= scrollHeight) {
          if (that.pagenum <= that.totalnum) {
            that.getPurchaseOrderList()
          }
        }
      }
    },

    // watch: {
    //   status(newValue,oldValue) {
    //     console.log(newValue, oldValue)
    //     if(newValue != oldValue){
    //       console.log(111)
    //       this.pagenum = 1
    //     }
    //   }
    // },

    mounted() {
      this.getPurchaseOrderList()
    },
  }
</script>

<style scoped lang="less">
  @import "../../assets/css/var.less";

  ::-webkit-input-placeholder {
    color: #c5c5c5;
  }

  .MyOrder {
    .popup {
      height: 50px;
      width: 260px;
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

    .tabs {
      width: 1130px;
      height: 206px;
      background: #f5f5f5;
      position: fixed;
      top: 0px;
      z-index: 1;

      .tagList {
        background: #fff;
        height: 60px;
        margin-top: 83px;
        padding: 0 10px;

        li {
          text-align: center;
          display: inline-block;
          font-size: 14px;
          /* border-bottom: 2px solid @borderColor; */
          cursor: pointer;
          margin: 0 20px;
          padding: 25px 0 8px;
          position: relative;
          margin-bottom: 10px;

          /* &:after {
          top: 12px;
          right: 0;
          position: absolute;
          content: "";
          width: 1px;
          height: 15px;
          background-color: @borderColor;
        } */

          /* &:last-child {
          &:after {
            display: none;
          }
        } */
        }

        .selected {
          color: #b4a078;
          border-bottom: 2px solid #b4a078;
        }
      }
    }

    .searchBox {
      width: 100%;
      position: fixed;
      top: 140px;
      border-bottom: none;
      z-index: 1;
      padding-top: 26px;


      .search-box {
        display: inline-block;
        vertical-align: middle;
        text-align: left;
        width: 312px;
        height: 40px;
        background: #fff;
        border: 2px solid #333;
        position: relative;

        input {
          width: 200px;
          height: 36px;
          border: none;
          margin-left: 20px;
        }

        .icon-search {
          font-size: 18px;
          font-weight: bold;
          color: #c5c5c5;
          cursor: pointer;
          position: relative;
          top: 2px;
          left: 20px;
        }

        span {
          display: inline-block;
          height: 100%;
          width: 90px;
          white-space: normal;
          background: #333;
          position: absolute;
          right: 0;
          color: #fff;
          text-align: center;
          line-height: 38px;
        }
      }
    }

    .orderBox {
      width: 100%;
      margin-top: 84px;
      background: #fff;
      margin-bottom: 40px;

      .orderTableHeader {
        width: 100%;
        height: 40px;
        /* background-color: #f5f5f5; */
        /* border: 1px solid @borderColor; */
        color: @fontDefaultColor;
        font-size: 10px;
        line-height: 40px;
        white-space: nowrap;
        /* position:fixed; */
        border-bottom: 1px solid #f2f2f2;

        span {
          display: inline-block;
          width: 8.5%;
          text-align: center;
          /* 
          &:nth-child(1) {
            width: 19.5%;
            text-align: center;
          }

          &:nth-child(5) {
            width: 19%;
            text-align: center;
          } */
        }

        .order-number {
          width: 180px;
          text-align: left;
          text-indent: 20px;
        }

        .take-person {
          width: 110px;
        }

        .wholesale {
          width: 150px;
        }

        .order-status,
        .goods-number {
          width: 90px;
        }

        .order-time {
          width: 120px;
        }

        .deleteBtn {
          display: inline-block;
          width: 100px;
          text-align: center;
        }
      }

      .orderList {
        width: 100%;

        li {
          border-bottom: 1px dashed #EBEBEB;
          font-size: 10px;
          /* margin-top: 10px; */

          .orderDetail {
            width: 100%;
            padding-left: 20px;
            position: relative;
            overflow: hidden;

            img {
              width: 84px;
              height: 84px;
              border: 1px solid #eee;
              display: inline-block;
              margin-right: 25px;
            }

            .orderTime {
              width: 120px;
              display: inline-block;
              vertical-align: top;
              height: 60px;
              text-align: left;

            }

            .orderId {
              display: inline-block;
              width: 160px;
              line-height: 60px;
              text-align: left;
              cursor: pointer;
            }

            .orderTime {
              padding-top: 10px;
              line-height: 20px;
            }

            .name,
            .num,
            .amount,
            .state {
              display: inline-block;
              vertical-align: top;
              width: 110px;
              height: 60px;
              line-height: 60px;
              text-align: center;
              overflow: hidden;
              /*内容超出后隐藏*/

              text-overflow: ellipsis;
              /* 超出内容显示为省略号*/

              white-space: nowrap;
              /*文本不进行换行*/

              /* span {
                width: 65px;
                height: 40px;
                background: #b4a078;
                padding: 6px;
                border-radius: 4px;
                color: #fff;
                cursor: pointer;
              } */
            }

            .wholesale {
              display: inline-block;
              width: 150px;
              vertical-align: middle;
              text-align: center;
              line-height: 20px;
            }

            .state {
              width: 90px;
            }

            /* .wholesale {
              padding-top: 10px;
              line-height: 20px;
              text-align: left;
            } */

            .deleteBtn {
              display: inline-block;
              vertical-align: top;
              width: 100px;
              height: 60px;
              line-height: 60px;
              text-align: center;
              cursor: pointer;
              color: #af7e49;
              /* span{
                display: inline-block;
                width:100px;
                height:100%;
                text-align:center;
              } */
            }

            button {
              position: absolute;
              right: 90px;
              bottom: 40px;
              width: 70px;
              height: 30px;
              border-radius: 3px;
              background-color: @thirdColor;
              color: white;
              border: none;
            }
          }
        }
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