<template>
  <div class="PopupWrapper" :style="{width:windowWidth+'px',height:windowHeight+'px',}" @click.stop="closePopup">
    <div style=" height: 360px;width:768px;position: absolute;left: 0;right:0;top:0;bottom:0;margin:200px auto">
      <div class="Popup" @click.stop="()=>{}">
        <div @click.stop="closePopup" class="icon">+</div>
        <div class="imgBox">
          <span>
            <img v-if="detailList.goodsImg" :src="detailList.goodsImg" alt="商品图片" />
            <img v-else src="../assets/img/default.png" alt="" />
          </span>
        </div>
        <div class="popupHeader">
          <div class="goodsIfor">
            <span>商品名称：</span>
            <span class="goodsName">{{name}}</span>
          </div>
          <div class="goodsIfor">
            <span>商品价格：</span>
            <span class="goodsPrice">￥{{money}}</span>
          </div>
          <div class="specification goodsIfor">
            <span>商品规格：</span>
            <ul>
              <li>
                <p :class="specifications == -1?'pich':'size'" @click="pithcEvent(detailList,-1)">
                  {{'￥'+detailList.wholesalePrice+'/'+detailList.goodsUnit}}</p>
              </li>
              <li v-if="modelsList" v-for="(item,index) in modelsList">
                <p :class="specifications == index?'pich':'size'" @click="pithcEvent(item,index)">
                  {{'￥'+item.wholesalePrice+'/'+item.goodsUnit}}
                </p>
              </li>
            </ul>
          </div>
          <div class="goodsIfor">
            <span>商品条码：</span>
            <span class="goodsCode"></span>
          </div>
          <div class="infoBox goodsIfor">
            <span>商品数量：</span>
            <NumberInput v-model="num" :min="1" :max="999999" />
          </div>
          <div class="addBtn" @click.stop="addToCart">加入购物车</div>
        </div>
        <div class="popupBody">
          <slot name="popupContent"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { goodList, goodsDetails } from '../api/client';
  import { getClientSize } from '../util/util';
  import NumberInput from './NumberInput';
  import { mapState, mapMutations } from "vuex";
  export default {
    name: 'Popup',
    components: {
      NumberInput,
    },
    props: {
      id: {
        type: Number,
        default: "",
      }
    },
    computed: {
      ...mapState([
        'clientId',
        'clientCode',
        'supplierCode'
      ]),
    },
    data() {
      return {
        show: false,
        windowWidth: getClientSize().width,
        windowHeight: getClientSize().height,
        specifications: -1,
        img: "",
        detailList: "",
        modelsList: "",
        num: 1,
        money: "",
        name: ""
      }
    },
    mounted() {
      this.getGoodsDetails()
    },
    methods: {
      ...mapMutations({
        setCart: "ADD_CART_LIST",
      }),
      closePopup() {
        this.$emit('popupClose');
      },

      //选择的包装因子
      pithcEvent(data, index) {
        console.log(data, index)
        if (data) {
          this.name = data.goodsName || data.packageName
          this.money = data.wholesalePrice || 0
          this.specifications = index
          this.packagingData = data
        }
      },

      getGoodsDetails() {
        goodsDetails({ appId: this.clientId, parentMerchantCode: this.supplierCode, goodsId: this.id, merchantCode: this.clientCode }).then(res => {
          console.log(res, "商品详情数据", res.result)
          if (res.code === "SUCCESS") {
            res.result.wholesalePrice = res.result.wholesalePrice || 0
            this.name = res.result.goodsName
            this.money = res.result.wholesalePrice
            this.detailList = res.result
            this.modelsList = res.result.goodsPackageList
          }
        })
      },

      addToCart() {
        console.log(this.num)
        let data = this.packagingData
        console.log(Object.assign({}, this.detailList, { goodsAmount: this.num, goodsTotal: 0 }))
        if (this.specifications == -1) {
          if (!this.detailList.wholesalePrice) this.detailList.wholesalePrice = 0
          this.setCart(Object.assign({}, this.detailList, { goodsAmount: this.num, goodsTotal: 0 }))
        } else {
          if (!data.wholesalePrice) data.wholesalePrice = 0
          this.setCart(Object.assign({}, this.detailList, { goodsAmount: this.num, goodsTotal: 0 }, data))
        }
        this.$emit('popupClose', 'success');
      }
    },
  }
</script>

<style scoped lang="less">
  @import "../assets/css/var.less";

  .PopupWrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.5);
    /* text-align: center; */

    .Popup {
      height: 400px;
      width: 768px;
      margin-top: 10%;
      display: inline-block;
      background-color: #fff;
      padding: 40px 0 40px 40px;
      /* box-shadow: 0 0 10px @fontDeepColor; */
      position: relative;

      .icon {
        font-size: 30px;
        color: #ccc;
        transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        /* IE 9 */
        -moz-transform: rotate(45deg);
        /* Firefox */
        -webkit-transform: rotate(45deg);
        /* Safari 和 Chrome */
        -o-transform: rotate(45deg);
        /* Opera */
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
      }

      .imgBox {
        width: 330px;
        height: 320px;
        margin-right: 40px;
        border:1px solid #f2f2f2;
        /* margin: 40px; */
        display: inline-block;

        span {

          font-size: 0;

          width: 330px;

          height: 320px;

          display: table-cell;

          text-align: center;

          vertical-align: middle;

        }

        img {

          max-width: 100%;

          max-height: 100%;

        }
      }

      .popupHeader {
        position: absolute;
        line-height: 20px;
        font-size: 16px;
        top: 40px;
        display: inline-block;

        .goodsIfor {
          padding: 8.5px 0;

          .goodsName {
            font-size: 18px;
            color: #333333;
            font-weight: 600;
          }

          .goodsPrice {
            font-size: 18px;
            color: #F66F51;
          }
        }

        li {
          /* float: right; */
          display: inline-block;
        }

        .specification {
          span {
            display: inline-block;
            margin-bottom: 10px;
            margin-right: 10px;
            /* color: #999;
            font-size: 12px */
          }

          .pich {
            display: inline-block;
            border: 2px solid #F66F51;
            width: 87px;
            height: 32px;
            margin-left: 12px;
            line-height: 32px;
            text-align: center;
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .size {
            display: inline-block;
            border: 1px solid #eee;
            width: 87px;
            height: 32px;
            margin-left: 12px;
            line-height: 32px;
            text-align: center;
            font-size: 12px;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

        }

        .infoBox {
          margin-bottom: 30px;

          .sizeImg {
            width: 30px;
            height: 30px;
          }

          .pichImg {
            width: 30px;
            height: 30px;
            border: 2px solid #b4a078;
          }

          .name {
            font-size: 22px;
          }

          p {
            color: @fontDefaultColor;
            font-size: 15px;
          }

          .price {
            font-size: 35px;
            color: @falseColor;
          }

          span {
            /* color: @fontDefaultColor;
              font-size: 13px; */
            display: inline-block;
            width: 80px;
          }

          .tips {
            width: auto;
            margin: 0 20px 0 5px;
          }

          .NumberInput {
            display: inline-block;
            vertical-align: middle;
          }
        }

        .addBtn {
          width: 240px;
          height: 40px;
          background: #F66F51;
          color: #fff;
          line-height: 40px;
          text-align: center;
          margin-top: 28px;
          cursor: pointer;
          /* background-color: #b4a078;
          width: 170px;
          height: 50px;
          color: white;
          border: none;
          font-size: 19px;
          margin-right: 20px; */
          /* margin-top:6px; */

          &:hover {
            opacity: 0.8;
          }
        }
      }

      .popupBody {
        background-color: white;
      }
    }
  }
</style>