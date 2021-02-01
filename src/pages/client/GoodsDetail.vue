<template>
  <div style="background:#fff">
    <div class="GoodsDetail container">
      <div class="content" v-if="detailList">
        <div class="goodsInfo">
          <div class="infoLeftBox">
            <span>
              <img v-if="detailList.goodsImg" class="infoLeft" :src="detailList.goodsImg" alt="商品图片" />
              <img v-else class="infoLeft" src="../../assets/img/default.png" alt="">
            </span>
            <!-- <div class="thumbnailBox">
              <ul>
                <li>
                  <img v-if="detailList.goodsImg" class="thumbnail" :src="detailList.goodsImg" alt="商品图片" />
                  <img class="thumbnail" v-else src="../../assets/img/default.png" alt="">
                </li>
              </ul>
            </div> -->
          </div>
          <div class="infoRight">
            <div class="infoBox">
              <h3 class="name">{{name}}</h3>
            </div>
            <div class="infoBox">
              <p>{{goodsDesc || ""}}</p>
            </div>
            <div class="detail">
              <div><span class='right-grey-first'>价格</span><span class='right-grey-bao'>¥{{money}}/{{goodsUnit}}</span>
              </div>
              <div><span class='right-grey-first'>折扣</span><span class='right-grey-zhe'>企业专享折扣</span></div>
              <div><span class='right-grey-first'>服务</span><span class='right-grey-first'>48小时快速退款/ 不支持无理由退货/
                  国内部分地区无法配送</span></div>
            </div>
            <div class="specification">
              <span>规格：</span>
              <ul>
                <li>
                  <p :class="specifications == -1?'pich':'size'" @click="pithcEvent(detailList,-1)">
                    {{'￥'+detailList.wholesalePrice+'/'+detailList.goodsUnit}}</p>
                </li>
                <li v-if="modelsList.length" v-for="(item,index) in modelsList">
                  <p v-if="item.wholesalePrice" :class="specifications == index?'pich':'size'"
                    @click="pithcEvent(item,index)">
                    {{'￥'+item.wholesalePrice+'/'+item.goodsUnit}}
                  </p>
                </li>
              </ul>
            </div>
            <div class="goodsCode">商品条码：{{goodsBarcode}}</div>
            <div v-if="operatorType == 0">
              <div class="infoBox">
                <span class="numberText">数量：</span>
                <NumberInput @click='input' v-model="num" :min="1" :max="temStockNum" />
              </div>
              <div class="cartBtn" @click="addToCart">加入购物车</div>
            </div>
          </div>
        </div>
        <Hint ref="popup" />
        <div class="titleDetail">商品详情</div>
        <table class="table">
          <tr>
            <td class="title">商品名称</td>
            <td class="text">{{name}}</td>
          </tr>
          <tr>
            <td class="title">商品条码</td>
            <td class="text">{{goodsBarcode}}</td>
          </tr>
          <tr>
            <td class="title">商品品牌</td>
            <td class="text">{{detailList.goodsBrand}}</td>
          </tr>
          <tr>
            <td class="title">商品单位</td>
            <td class="text">{{goodsUnit}}</td>
          </tr>
          <tr>
            <td class="title">商品规格</td>
            <td class="text">{{detailList.goodsSpecInfo || ''}}</td>
          </tr>
          <tr>
            <td class="title">商品产地</td>
            <td class="text">{{detailList.goodsOriginPlace || ''}}</td>
          </tr>
        </table>
        <!-- <div class="detailContent">
          <span class="text">商品名称：{{name}}</span>
          <span class="text">商品条码：{{goodsBarcode}}</span>
          <span class="text">商品品牌：{{detailList.goodsBrand}}</span>
          <span class="text">商品单位：{{goodsUnit}}</span>
          <span class="text">商品规格：{{detailList.goodsSpecInfo || ''}}</span>
          <span class="text">商品产地：{{detailList.goodsOriginPlace || ''}}</span>
        </div> -->
        <div v-html="detailList.goodsDesc" class="msgHtmlBox"></div>
      </div>
      <div v-else class="empty-goods">{{status}}</div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex';
  import { goodsDetails } from '../../api/client';
  import { distinct, steamroller, returnCode, dataTime } from '../../util/util';
  import NumberInput from '../../components/NumberInput';
  import Radio from '../../components/Radio';
  import GoodsItem from '../../components/GoodsItem';
  import Hint from '../../components/Hint';

  export default {
    name: 'GoodsDetail',
    components: {
      NumberInput,
      Radio,
      GoodsItem,
      Hint
    },
    computed: {
      ...mapState({
        clientId: state => state.clientId,
        clientCode: state => state.clientCode,
        second: state => state.second,
        addCart: state => state.addCart,
        supplierCode: state => state.supplierCode,
        operatorType: state => state.operatorType
        // num:state => state.num,
      }),
      id() {
        return this.$route.params.id;
      },
      code() {
        return this.$route.params.code;
      },
      // goodsPrice() {
      //   let unitPrice = 0;
      //   this.specs.map((item, index) => {
      //     if (item.id === this.temSpecId) {
      //       unitPrice = Number(item.unitPrice);
      //     }
      //   })
      //   return (this.num * unitPrice);
      // },
      temStockNum() {
        let stockNum = 0;
        // this.specs.map((item, index) => {
        //   if (item.id === this.temSpecId) {
        //     stockNum = Number(item.stockNum);
        //   }
        // })
        //最多可以售卖的数量
        // return stockNum;   
        return 1000000
      },
    },
    data() {
      return {
        modelsList: "",
        goodsImg: 'http://yanxuan.nosdn.127.net/0266209ded1751f599fe0dc21bb33e02.jpg',
        imgUrl: ["http://yanxuan.nosdn.127.net/0266209ded1751f599fe0dc21bb33e02.jpg", "http://yanxuan.nosdn.127.net/7cd0c8ed77da498090fb67c288ef05be.jpg", "http://yanxuan.nosdn.127.net/d824afe357e61fbee097412c5894c6ce.jpg"],
        goodsName: '衣服',
        goodsDesc: '',
        specs: [{ id: 1, specName: "衬衫", stockNum: "100" }],
        typeId: '',
        temSpecId: 0,
        num: 1,
        msgList: [],
        askContent: '',
        tagList: ['评价', '商品问答'],
        curIndex: 0,
        rate: '',
        commentList: [],
        goodsList: [],
        detailList: "",
        recordNo: "",
        packagingData: "",
        // popupStatus: false,
        specifications: -1,
        idx: 0,
        succeed: false,
        status: "",
        name: ""
        // purchaseFactor:1
      }
    },

    methods: {
      ...mapMutations({
        setCart: "ADD_CART_LIST",
        // setSpcifications: "SET_SEPCIFICATIONS"
      }),


      input(e) {
        console.log(e)
      },

      changeIndex(i) {
        this.curIndex = i;
      },

      //切换图片的下标
      getIndex(index) {
        this.idx = index
      },

      //选择的包装因子
      pithcEvent(data, index) {
        console.log(data, index)
        if (data) {
          this.name = data.goodsName || data.packageName
          this.goodsUnit = data.goodsUnit
          this.goodsBarcode = data.goodsBarcode
          this.money = data.wholesalePrice || 0
          this.specifications = index
          this.packagingData = data
          // this.purchaseFactor = data.purchaseFactor
        }
        //  else {
        //   this.specifications = -1
        //   this.packagingData = ""
        // }
      },

      //获取详情数据
      getGoodsDetails() {
        console.log(this.code)
        // let arr = [{
        //   merchantCode: this.clientCode,
        //   supplierCode: this.code,
        //   goodsCode: this.id,

        // }]
        goodsDetails({ appId: this.clientId, parentMerchantCode: this.supplierCode, goodsId: this.code, merchantCode: this.clientCode }).then(res => {
          console.log(res, "商品详情数据", res.result)
          if (res.code === "SUCCESS") {
            if (!res.result) {
              this.status = res.msg
            }
            res.result.wholesalePrice = res.result.wholesalePrice || 0
            this.name = res.result.goodsName
            this.goodsUnit = res.result.goodsUnit
            this.goodsBarcode = res.result.goodsBarcode
            this.money = res.result.wholesalePrice
            this.detailList = res.result
            this.modelsList = res.result.goodsPackageList
          }
        })
      },

      //提示状态
      // getPopupStatus() {
      //   let that = this
      //   that.popupStatus = !that.popupStatus
      //   setTimeout(function () {
      //     that.popupStatus = !that.popupStatus
      //   }, 2000)
      // },

      addToCart() {
        let data = this.packagingData
        console.log(this.detailList)
        // if (this.modelsList) {
        if (this.specifications == -1) {
          if (!this.detailList.wholesalePrice) this.detailList.wholesalePrice = 0
          console.log(this.detailList)
          this.setCart(Object.assign({}, this.detailList, { goodsAmount: this.num, goodsTotal: 0 }))
          this.$refs.popup.timer("成功添加购物车")
          // this.status = "成功添加购物车"
          // this.getPopupStatus()
        } else {
          if (!data.wholesalePrice) data.wholesalePrice = 0
          // this.detailList.pack = data
          this.setCart(Object.assign({}, this.detailList, { goodsAmount: this.num, goodsTotal: 0 }, data))
          this.$refs.popup.timer("成功添加购物车")
          // this.status = "成功添加购物车"
          // this.getPopupStatus()
        }
        // }
      }

    },
    mounted() {
      this.getGoodsDetails()
      // this.getPurchaseOrderList()
    },
    watch: {
      $route(to, from) {
        this.getGoodsDetails()
      },

      // addCart(newValue,oldValue){
      //   console.log(newValue,"添加购物车",oldValue)
      // },
    }
  }
</script>
<!-- scoped -->
<style  lang="less">
  @import "../../assets/css/var.less";

  .msgHtmlBox{
   width:1200px;
    img{
      width:100%;
      height:100%
    }
  }

  .GoodsDetail {
    position: relative;
    padding-bottom: 40px;

    .empty-goods {
      height: 50px;
      width: 160px;
      font-size: 20px;
      position: absolute;
      ;
      top: 200px;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
    }

    .content {
      width: 100%;
      padding-top: 20px;

      .titleDetail {
        width: 100%;
        height: 60px;
        background: #E0E0E0;
        font-size: 18px;
        text-indent: 20px;
        line-height: 60px;
        margin: 20px 20px 0 0;
      }

      .detailContent {
        width: 100%;
        padding: 10px 24px;
        background: #f4f4f4;
        font-size: 16px;
        /* margin: 0 20px; */


        .text {
          display: inline-block;
          line-height: 30px;
          width: 33%;
        }
      }

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

      .goodsInfo {
        width: 100%;
        overflow: hidden;

        .detail {
          width: 100%;
          height: 160px;
          background: #F9F9F9;
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-around;
          padding: 20px 23px;
          margin-bottom: 30px;

          .right-grey-first {
            font-size: 12px;
            color: #666666;
            padding-right: 20px;
          }

          .right-grey-bao {
            font-size: 20px;
            color: #F66F51;
          }

          .right-grey-zhe {
            font-size: 12px;
            color: #F66F51;
          }

          /* .money {
            margin: 15px;

            p {
              font-size: 28px;
              color: #AE2A40;
              display: inline-block;
              margin-left: 26px;
            }
          } */

          /* .discount {
            margin: 15px;

            p {
              background: #b0882f;
              display: inline-block;
              width: 90px;
              height: 30px;
              font-size: 13px;
              color: #fff;
              line-height: 30px;
              text-align: center;
              margin-left: 26px;
            }
          } */

          /* .server {
            margin: 15px;

            p {
              font-size: 13;
              color: #666;
              display: inline-block;
              margin-left: 26px;
            }
          } */
        }

        .infoLeftBox {
          float: left;
          width: 500px;
          height: 500px;
          border: 1px solid #f2f2f2;

          span {

            font-size: 0;

            width: 500px;

            height: 500px;

            display: table-cell;

            text-align: center;

            vertical-align: middle;

          }

          img {

            max-width: 100%;

            max-height: 100%;

          }

          /* .infoLeft {
            display: inline-block;
            width: 500px;
            height: 500px;
            border: 1px solid #eee;
          } */

          /* .thumbnailBox {
            margin: 10px 0;

            li {
              float: left;
              margin: 0 4px;

              .thumbnail {
                width: 80px;
                height: 80px;
                border: 1px solid #eee;
                cursor: pointer;
              }
            }

            li:hover {
              .thumbnail {
                width: 80px;
                height: 80px;
                border: 2px solid #b4a078;
              }
            }
          } */
        }

        .infoRight {
          display: inline-block;
          float: right;
          width: 760px;

          /* margin-top: 40px; */
          .goodsCode {
            display: inline-block;
            margin-bottom: 30px;
            font-size: 12px;
            color: #666666;
            padding-right: 20px;
          }

          ul {
            display: inline-block;
            vertical-align: middle;

            li {
              float: left;
              vertical-align: top;
              margin: 4px;

              p {
                display: none;
              }
            }

            /* li:hover {
              position: relative;

              p {
                white-space: nowrap;
                padding: 4px;
                display: block;
                font-size: 22px;
                border: 1px solid #eee;
                position: absolute;
                left: 10px;
              }
            } */
          }

          .specification {
            span {
              display: inline-block;
              margin-top: 30px;
              margin-bottom: 30px;
              font-size: 12px;
              color: #666666;
              padding-right: 20px;
            }

            .pich {
              display: inline-block;
              border: 2px solid #F66F51;
              color: #F66F51;
              width: 87px;
              height: 32px;
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
              font-size: 20px;
              color: #333333;
              padding-top: 10px;
              padding-bottom: 20px;
              font-weight: 600;
            }

            p {
              color: @fontDefaultColor;
              font-size: 15px;
            }

            .price {
              font-size: 35px;
              color: @falseColor;
            }

            .numberText {
              color: @fontDefaultColor;
              font-size: 13px;
              margin-right: 10px;
              display: inline-block;
              width: 50px;
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

          .cartBtn {
            /* background-color: #b4a078;
            width: 170px;
            height: 50px;
            color: white;
            border: none;
            font-size: 19px;
            margin-right: 20px;
            margin-top: 10px; */
            width: 320px;
            height: 50px;
            color: #fff;
            font-size: 18px;
            line-height: 50px;
            text-align: center;
            background: #F66F51;
            margin-top: 29px;
            cursor: pointer;

            &:hover {
              opacity: 0.8;
            }
          }

          .buyBtn {
            border: 1px solid #b4a078;
            color: #b4a078;
            background-color: #f5f3ef;
          }
        }

      }

      .msgBox {
        margin: 50px 0;
        border: 1px solid @borderColor;
        padding-top: 0;

        .tagList {
          width: 100%;
          height: 40px;
          border-bottom: 1px solid @borderColor;
          background-color: #f5f5f5;

          li {
            width: 170px;
            height: 42px;
            position: relative;
            top: -2px;
            display: inline-block;
            text-align: center;
            line-height: 40px;
            font-size: 13px;
            cursor: pointer;

            &:hover {
              color: @thirdColor;
            }
          }

          .selected {
            background-color: white;
            border-top: 4px solid @thirdColor;
          }
        }

        .commentBody {
          padding: 20px;
          min-height: 300px;

          .rateBox {
            margin-bottom: 10px;

            span {
              color: @fontDefaultColor;
              display: inline-block;
              margin-right: 10px;
            }

            .rate {
              color: @falseColor;
              font-weight: 600;
              font-size: 30px;
            }
          }

          .commentList {
            width: 100%;

            li {
              width: 100%;
              display: block;
              margin: 0 auto;
              border-bottom: 1px solid @borderColor;
              padding: 20px 0;

              .userInfo {
                width: 80px;
                display: inline-block;
                text-align: center;

                img {
                  margin: auto;
                  display: block;
                  width: 50px;
                  height: 50px;
                  border-radius: 50%;
                  margin-bottom: 6px;
                }

                span {
                  font-size: 13px;
                  color: @fontDefaultColor;
                }
              }

              .commentInfo {
                display: inline-block;
                vertical-align: top;

                .starList {
                  i {
                    color: #f9bd4f;
                  }
                }

                .specName,
                .time {
                  color: @fontDefaultColor;
                  font-size: 13px;
                  margin-top: 10px;
                }

                .comment {
                  margin-top: 10px;
                }
              }
            }
          }

          .noComment {
            width: 100%;
            text-align: center;
            color: @thirdColor;
            padding-top: 30px;
          }
        }

        .msgBody {
          padding: 20px;
          min-height: 300px;

          .inputBox {
            margin-top: 20px;

            textarea {
              width: 88%;
              height: 50px;
              padding: 5px;
              border: 2px solid @borderColor;
              display: inline-block;
              overflow: hidden;
            }

            button,
            .banAsk {
              float: right;
              width: 10%;
              height: 50px;
              position: relative;
              display: inline-block;
              overflow: hidden;
              background-color: white;
              border: 2px solid @fontShallowColor;
              color: @fontDefaultColor;
            }

            .banAsk {
              background-color: @fontShallowColor;
              text-align: center;
              font-size: 12px;
              line-height: 50px;
              color: white;
              user-select: none;
            }
          }

          .msgList {
            margin-top: 20px;

            li {
              border-bottom: 1px solid @borderColor;
              padding: 10px 0;

              .ask,
              .answer {
                margin: 8px 0;
                width: 100%;

                .note {
                  display: inline-block;
                  color: white;
                  text-align: center;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  font-size: 10px;
                  line-height: 20px;
                }

                .text {
                  font-size: 14px;
                }

                .tipsInfo {
                  float: right;
                  font-size: 14px;
                  color: @fontDefaultColor;
                }
              }

              .ask {
                .note {
                  background-color: @falseColor;
                }
              }

              .answer {
                .note {
                  background-color: @mainColor;
                }
              }
            }
          }
        }
      }

      .typeGoods {
        margin: 50px 0;
        border: 1px solid @borderColor;
        padding-top: 0;

        .title {
          text-align: center;
          width: 100%;
          height: 40px;
          line-height: 40px;
          background-color: #f5f5f5;
          font-weight: 600;
          border-bottom: 1px solid @borderColor;
        }

        .list {
          .GoodsItem {
            display: block;
            border-bottom: 1px dotted @borderColor;
            margin: 0 auto;
          }
        }
      }
    }

    .ban {
      user-select: none;
      cursor: not-allowed;
    }
  }

  .table {
    width: 1300px;
    height: 330px;
    font-size: 16px;

    tr {
      line-height: 55px;

      td {
        border: 1px solid #E0E0E0;
      }

      .title {
        text-align: center;
      }

      .text {
        text-align: left;
        padding-left: 16px;
      }
    }

  }
</style>