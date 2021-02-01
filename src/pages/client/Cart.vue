<template>
  <div class="Cart">
    <div v-if="addCart.length>0">
      <div class="cartTableHeader">
        <!-- <label>
          <input class="checkbox" type="checkbox" :checked="selectAll" @change="selectAlls">全选
        </label> -->
        <span class="img"></span>
        <span class="goodsMessage">商品信息</span>
        <span class="unitPrice">单位</span>
        <span class="unitPrice">单价</span>
        <span class="amount">数量</span>
        <span class="subtotal">小计</span>
        <span class="operation">交易操作</span>
      </div>
      <ul class="orderList">
        <li v-for="(item,index) in addCart" :key="'order'+item.goodsId">
          <div class="orderDetail">
            <img v-if="item.goodsImg" :src="item.goodsImg" alt="商品图片" @click.top="goDetail(item)" />
            <img v-else src="../../assets/img/default.png" alt="" @click.top="goDetail(item)" />
            <div @click.top="goDetail(item)" class="goodsMessage">
              <p>{{item.goodsName}}</p>
              <!-- <span></span> -->
              <span>{{item.goodsCode}}</span>
            </div>
            <div class="unitPrice">{{item.goodsUnit}}</div>
            <div class="unitPrice">{{'￥'+item.wholesalePrice || 0}}</div>
            <div class="amount">
              <NumberInput @changeHandle="numberChange(item.goodsId)" v-model="item.goodsAmount"
                :initNum="item.goodsAmount" :min="1" :max="9999" />
            </div>
            <!-- <input @change="numberChange(item.id)" type="text" v-model="item.temGoodsNum" min="1" class="numInput" /> -->
            <div class="subtotal">{{'￥'+item.goodsTotal}}</div>
            <div class="operation icon" @click="deleteGoods(index)">+</div>
          </div>
        </li>
      </ul>
      <div class="siteText">
        <p class="title">配送信息</p>
        <ul class="siteBox" :class="index == pichIndex?'pichSiteBox':'SiteBox'" v-for="(item,index) in siteList"
          @click="skipSite(index)">
          <li>
            <span>联系人：</span>
            <p>{{item.contactName}}</p>
          </li>
          <li>
            <span>联系电话：</span>
            <p>{{item.contactMobile}}</p>
          </li>
          <li>
            <span>送货地址：</span>
            <p>{{item.address || "--"}}</p>
          </li>
        </ul>
        <div class="siteBox SiteBox addsite" @click="addSite('-1')">+</div>
      </div>
      <div class="cartFooter">
        <button @click="settleAccounts">下单</button>
        <div class="totalMoney">
          <span>合计：</span>
          <span class="total">{{'￥'+totalAmount}}</span>
        </div>
      </div>
    </div>
    <p class="emptyTips" v-else>购物车还是空滴~</p>
    <!-- <div v-if="popupStatus" class="popup">下单失败</div> -->
    <!-- <div v-if="popupStatus" class="popup">{{status}}</div> -->
    <Hint ref="popup" />
    <SitePswPopup v-if="showHide" @popupClose="addSite" @affirm="affirm" :title="title">
      <template #popupContent>
        <div class="takeSite">
          <div class="textBox">
            <span>联系人：</span>
            <input type="text" v-model="name" placeholder="请输入联系人">
          </div>
          <div class="textBox">
            <span>联系电话：</span>
            <input type="number" v-model="phone" placeholder="请输入联系电话">
          </div>
          <div class="textBox">
            <span>收货地址：</span>
            <input type="number" v-model="site" placeholder="请输入联系电话">
            <!-- <textarea class="textarea" rows="4" v-model="site" placeholder="请输入地址"></textarea> -->
          </div>
        </div>
      </template>
    </SitePswPopup>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapGetters } from 'vuex';
  import { addPurchaseOrder, institutionDetail, orderSave, listArea, saveArea } from '../../api/client';
  import { dataTime, concatString } from '../../util/util';
  import NumberInput from '../../components/NumberInput';
  import SitePswPopup from '../../components/SitePswPopup';
  import Hint from '../../components/Hint';

  export default {
    name: 'Cart',
    components: {
      NumberInput,
      Hint,
      SitePswPopup
    },
    computed: {
      ...mapState([
        'clientId',
        'clientCode',
        'operatorId',
        'addCart',
        'supplierCode',
        'merchantType'
      ]),
      totalAmount() {
        let amount = 0;
        console.log(this.addCart, "购物车商品")
        this.addCart.map((item, index) => {
          console.log(item, "购物车价格综合")
          if (item.goodsAmount) {
            amount += item.goodsTotal;
          }
        })
        console.log(amount)
        return Number(amount.toFixed(2));
      },
      // sites() {
      //   return this.$route.params;
      // },
    },
    data() {
      return {
        // orderList: [{ temGoodsNum: 1, id: 1, amount: 20, select: true, goods: { name: "衬衫", spec: "男士夏装", unitPrice: 20, img: "http://yanxuan.nosdn.127.net/0266209ded1751f599fe0dc21bb33e02.jpg" } }, { temGoodsNum: 1, id: 2, amount: 20, select: true, goods: { name: "衬衫", spec: "男士夏装", unitPrice: 20, img: "http://yanxuan.nosdn.127.net/0266209ded1751f599fe0dc21bb33e02.jpg" } }],
        // orderList:"",
        selectAll: true,
        // popupStatus: false,
        // status: "",
        siteList: "",
        pichIndex: 0,
        title: '收货地址',
        showHide: false,
        name: "",
        phone: "",
        site: "",
      }
    },
    methods: {
      ...mapMutations({
        deleteGoodsList: "DELETE_GOODS",
        numberChange: "NUMBER_CHANGE",
        setCart: "ADD_CART_LIST",
      }),
      //删除购物车商品
      deleteGoods(index) {
        this.deleteGoodsList(index)
      },
      navTo(route) {
        this.$router.push(route);
      },

      skipSite(index) {
        this.pichIndex = index
      },

      goDetail(data) {
        this.navTo(`/mall/show/goods/${data.goodsBarcode}/${data.goodsId}`)
        // const { href } = this.$router.resolve(`/mall/show/goods/${data.goodsBarcode}/${data.goodsId}`)
        // window.open(href, '_blank');
      },
      //机构详情
      setInstitutionDetail() {
        console.log(this.clientId, this.clientCode)
        institutionDetail({
          appId: this.clientId, merchantCode: this.clientCode
        }).then(res => {
          console.log(res, '机构详情')
          if (res.code === "SUCCESS") {
            this.detail = res.result
            console.log(res.result)
          }
        })
      },

      //下单状态
      //选中状态
      // getPopupStatus() {
      //   let that = this
      //   that.popupStatus = !that.popupStatus
      //   setTimeout(function () {
      //     that.popupStatus = !that.popupStatus
      //   }, 2000)
      // },

      settleAccounts() {
        console.log(concatString(this.addCart))
        if (this.addCart) {
          let params = {
            appId: this.clientId,
            superMerchantCode: this.clientId,
            wholesaleMerchantCode: this.clientCode,
            merchantCode: this.supplierCode,
            orderStatus: 0,
            salesOperatorId: this.merchantType,
            operatorId: this.operatorId,
            wholesaleOrderJson: JSON.stringify(concatString(this.addCart)),
            orderSource: 1,
            areaId: this.siteList[this.pichIndex].areaId
          }
          orderSave(params).then(res => {
            console.log(res)
            if (res.code === "SUCCESS") {
              // params.orderStatus = 1
              // params.wholesaleOrderId = res.result.wholesaleOrderId
              // orderSave(params).then(res => {
              //   console.log(res)
              this.deleteGoods(-1)
              this.navTo('/mall/personal/myOrder/0')
              // })
            } else {
              this.$refs.popup.timer(res.msg)
              // this.status = res.msg
              // this.getPopupStatus()
            }
          })
        }
      },

      addSite(index) {
        this.showHide = !this.showHide
      },

      affirm() {
        let { name, phone, site } = this
        if (!name || !phone || !site) {
          console.log("请把信息填写完整")
          this.$refs.popup.timer("请把信息填写完整")
          return
        } else {
          console.log("保存")
          this.getSaveArea()
        }
      },

      // 新增收货地址
      getSaveArea() {
        let { operatorId, clientId, clientCode, name, phone, site } = this
        let params = {
          appId: clientId,
          merchantCode: clientCode,
          operatorId: operatorId,
          address: site,
          contactName: name,
          contactMobile: phone
        }
        saveArea(params).then(res => {
          if (res.code == 'SUCCESS') {
            this.showHide = !this.showHide
            this.name = ""
            this.phone = ""
            this.site = ""
            this.getListArea()
          }
          this.$refs.popup.timer(res.msg)
        })
      },

      //获取收货地址列表
      getListArea() {
        listArea({
          appId: this.clientId,
          merchantCode: this.clientCode
        }).then(res => {
          console.log(res, "收货地址列表")
          if (res.code === "SUCCESS" && res.result.length) {
            this.siteList = res.result
          }
        })
      }
    },
    mounted() {
      console.log("切换窗口执行没")
      console.log(this.supplierCode, this.addCart, this.sites)
      this.setInstitutionDetail()
      // if(this.sites.areaId){
      //   this.site = this.sites
      //   return
      // }
      this.getListArea()
    },
  }
</script>

<style scoped lang="less">
  @import "../../assets/css/var.less";

  .Cart {
    width: 100%;
    /* .popup {
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
    } */

    .emptyTips {
      width: 200px;
      text-align: center;
      display: block;
      margin: 30px auto;
      color: @thirdColor;
      font-size: 20px;
    }

    .cartTableHeader {
      background: #fff;
      width: 100%;
      height: 45px;
      /* background-color: #f5f5f5; */
      /* border: 1px solid @borderColor; */
      /* color: @fontDefaultColor; */
      color: #333;
      font-size: 14px;
      line-height: 45px;
      border-bottom: 1px solid #F2F2F2;

      .checkbox {
        margin: 0 10px;
      }

      span {
        display: inline-block;
        width: 148px;
        text-align: center;
      }

      .img {
        width: 100px;
      }

      .goodsMessage {
        width: 248px;
        text-align: left;
      }
    }

    .orderList {
      width: 100%;
      background: #fff;

      li {
        /* border: 1px solid @borderColor; */
        font-size: 13px;


        .orderHeader {
          background-color: #f1f1f1;
          height: 40px;
          line-height: 40px;
          padding: 0 5px;

          .orderTime {
            font-weight: 600;
          }

          .orderId,
          .state {
            margin-left: 10px;
          }
        }

        .orderDetail {
          width: 100%;
          height: 100px;
          padding: 15px;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid#F2F2F2;

          .checkbox {
            position: absolute;
            /* top:-40px; */
            /* margin-right:10px; */
          }

          img {
            width: 70px;
            height: 70px;
            border: 1px solid #eee;
            display: inline-block;
            margin-right: 15px;
            cursor: pointer;
          }

          .goodsMessage {
            display: inline-block;
            /* margin-left: 5px; */
            width: 248px;
            vertical-align: top;
            /* text-indent: 10px; */
            text-align: left;
            cursor: pointer;

            p {
              margin-top: 10px;
              line-height: 20px;

              &:hover {
                text-decoration: underline;
              }
            }

            span {
              color: @fontDefaultColor;
              display: block;
              margin-top: 10px;
            }
          }

          .unitPrice,
          .amount,
          .subtotal,
          .operation {
            display: inline-block;
            vertical-align: top;
            width: 148px;
            height: 70px;
            line-height: 70px;
            text-align: center;
          }

          .icon {
            font-size: 30px;
            color: #ccc;
            cursor: pointer;
            transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            /* IE 9 */
            -moz-transform: rotate(45deg);
            /* Firefox */
            -webkit-transform: rotate(45deg);
            /* Safari 和 Chrome */
            -o-transform: rotate(45deg);
            /* Opera */
          }

          .NumberInput {
            position: relative;
            top: 16px;
            left: 13px;
          }
        }

        .orderDetail:hover {
          background: #eee;
        }
      }
    }

    .siteText {
      background: #fff;
      margin-top: 30px;
      margin-bottom: 30px;
      /* border: 1px solid @borderColor; */
      overflow: hidden;

      .title {
        font-size: 20px;
        padding-left: 30px;
        height: 59px;
        line-height: 59px;
        border-bottom: 1px solid #F2F2F2;
      }

      .siteBox {
        width: 100%;
        height: 114px;
        padding: 15px 30px;
        border-bottom: 1px solid #f2f2f2;

        li {
          line-height: 28px;
          font-size: 14px;

          span {
            display: inline-block;
            text-align: right;
            width: 70px;
            height: 20px;
          }

          p {
            display: inline-block;
          }
        }
      }

      .pichSiteBox {
        background-color: #af7e49;
        color: #fff;
      }

      .SiteBox {
        /* background-color: #ccc; */
      }

      .addsite {
        text-align: center;
        line-height: 76px;
        font-size: 30px;
        cursor: pointer;
      }
    }

    .cartFooter {
      width: 100%;
      height: 60px;
      line-height: 60px;
      padding-left: 30px;
      margin-bottom: 40px;
      /* padding: 0 10px; */
      /* border: 1px solid @borderColor; */
      border-top: none;
      background-color: #fff;
      position: relative;

      .totalMoney {
        /* float: right; */

        span {
          color: #666666;
          font-size: 14px;
          /* color: @fontDefaultColor; */
          display: inline-block;
          vertical-align: top;
        }

        .total {
          /* color: @falseColor;
          font-size: 25px;
          font-weight: 600; */
          font-size: 20px;
          color: #F66F51;
        }
      }

      button {
        float: right;
        width: 170px;
        height: 100%;
        background-color: #F66F51;
        border: none;
        color: #fff;
        font-size: 20px;
      }
    }

    .takeSite {
      margin-left: 40px;
      margin-bottom: 30px;

      .textBox {
        margin-bottom: 16px;
        overflow: hidden;
        font-size: 16px;
        line-height: 40px;

        span {
          display: inline-block;
          width: 80px;
          text-align: right;
          float: left;
          color: #333;
        }

        input {
          height: 40px;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding-left: 16px;
        }

        ::-webkit-input-placeholder {
          color: #ccc;
          font-size: 16px;
        }

        .textarea {
          float: left;
          border-radius: 2px;
          border: 1px solid rgb(118, 118, 118);

        }
      }
    }

    /* .takeSite {
      .textBox {
        margin-bottom: 16px;
        overflow: hidden;

        span {
          display: inline-block;
          width: 80px;
          text-align: right;
          float: left;
        }

        .textarea {
          float: left;
          border-radius: 2px;
          border: 1px solid rgb(118, 118, 118);
        }
      }
    } */
  }
</style>