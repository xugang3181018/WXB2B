<template>
  <div class="goodsListBox">
    <!-- <div class="banner" :style="{width:clientWidth+'px'}">
      <img src="../../assets/img/banner.png" alt="banner" />
    </div> -->
    <div class="GoodsList">
      <div style="background:#fff">
        <div class="sortBox container">
          <span class="title">排序：</span>
          <span :class="['normal',{selected:sortMode===0}]" @click="changeSortMode(0)">默认</span>
          <span :class="['normal',{selected:sortMode!==0}]" @click="changeSortMode(3)">
            价格
            <img class="sortImg" src="../../assets/img/sort.png" alt="">
          </span>
        </div>
      </div>
      <div class="container">
        <div class="goodsTitle">全部商品</div>
        <ul class="result">
          <GoodsItem v-for="(item,index) in sortedList" :style="{marginRight: (index+1)%4===0?'0px':'20px'}"
            :key="item.goodsId" :id="item.supplierGoodsId" :img='item.goodsImg' :name="item.goodsName"
            :price="item.wholesalePrice" :operatorType="operatorType" :goodsSpec="item.goodsSpec"
            :goodsUnit="item.goodsUnit" :code="item.goodsId" :goodsCode="item.goodsBarcode"
            @addCart="addCart(item.goodsId)" />
          <p class="noGoods" v-if="sortedList.length<=0">抱歉，没有找到相关商品~</p>
        </ul>
        <Popup v-if="showHidPoup" @popupClose="addCart" :id="id" />
        <!-- <div v-if="popupStatus" class="popup">成功添加购物车</div> -->
        <Hint ref="popup" />
      </div>
    </div>
  </div>
</template>

<script>
  import { goodList, goodsDetails } from '../../api/client';
  import { steamroller, distinct, traversal, returnCode, getClientSize } from '../../util/util';
  import GoodsItem from '../../components/GoodsItem';
  import Popup from '../../components/Popup';
  import { mapState, mapMutations } from "vuex";
  import Hint from '../../components/Hint';

  export default {
    name: 'GoodsList',
    components: {
      GoodsItem,
      Popup,
      Hint
    },
    computed: {
      ...mapState([
        'clientId',
        'clientCode',
        'supplierCode',
        'operatorType',
      ]),
      isSearchPage() {
        return Number(this.typeId) == -1 ? true : false;
      },
      typeId() {
        console.log(this.$route.params.typeId)
        return this.$route.params.typeId || 0;
      },
      sortedList() {
        let temList
        if (this.goodsList) {
          temList = this.goodsList.slice();
          if (this.sortMode === 0) {
            return temList;
          } else if (this.sortMode === 1) {
            return temList.sort((a, b) => {
              return a.deliveryPrice - b.deliveryPrice;
            })
          } else if (this.sortMode === 2) {
            return temList.sort((a, b) => {
              return b.deliveryPrice - a.deliveryPrice;
            })
          }
        } else {
          return []
        }
      },
      value() {
        console.log(this.$route.params.text)
        return this.$route.params.text
      }
    },
    data() {
      return {
        goodsList: [],
        sortMode: 0,//0默认，1价格升序，2价格降序
        scroll: true,
        pagenum: 1,
        totalnum: 1,
        showHidPoup: false,
        detailList: "",
        modelsList: "",
        id: "",
        // popupStatus: false
        clientWidth: getClientSize().width,
      }
    },

    methods: {
      ...mapMutations({
        //分类路径1
        setSecond: "SET_SECOND",
        //分类路径2
        setSecondTwo: "SET_SECOND_TWO",
        //分类路径3
        setSecondThree: "SET_SECOND_THREE",
        //分类路径4
        setSecondFour: "SET_SECOND_FOUR",
        //二级分类
        setReclassify: "SET_RECLASSIFY",
        //三级分类
        setThreeClassify: "SET_THREE_CLASSIFY",
        //四级分类
        setFourClassify: "SET_FOUR_CLASSIFY",
        //清除规格状态
        setSpcifications: "SET_SEPCIFICATIONS",
      }),
      //排序选中后的样式
      changeSortMode(mode) {
        if (mode === 3) {
          this.sortMode = this.sortMode === 1 ? 2 : 1;
        } else {
          this.sortMode = 0;
        }
      },


      //获取数据        
      getProductList(value) {
        let id = this.typeId
        if (value && value != "all") {
          console.log(value)
          goodList({ appId: this.clientId, parentMerchantCode: this.supplierCode, merchantCode: this.clientCode, goodsInfo: value, currentPage: this.pagenum, pageSize: 20 }).then(res => {
            console.log(res, "商品列表")
            if (this.pagenum === 1) {
              this.goodsList = res.result.items
              this.pagenum = res.result.currentPage
              this.totalnum = res.result.pageCount
            } else if (this.pagenum > 1 && res.result.items) {
              this.goodsList = [
                ...this.goodsList,
                ...res.result.items
              ]
            }
            if (res.result.pageCount > 1) {
              ++this.pagenum
            }
          })
        } else {
          if (id == 0) {
            goodList({ appId: this.clientId, parentMerchantCode: this.supplierCode, merchantCode: this.clientCode, categoryId: "", currentPage: this.pagenum, pageSize: 20 }).then(res => {
              console.log(res, "商品列表")
              if (this.pagenum === 1) {
                this.goodsList = res.result.items
                this.pagenum = res.result.currentPage
                this.totalnum = res.result.pageCount
              } else if (this.pagenum > 1 && res.result.items) {
                console.log(111, "加载数据")
                this.goodsList = [
                  ...this.goodsList,
                  ...res.result.items
                ]
              }
              if (res.result.pageCount > 1) {
                ++this.pagenum
              }
            })
          } else {
            goodList({ appId: this.clientId, parentMerchantCode: this.supplierCode, merchantCode: this.clientCode, categoryId: id, currentPage: this.pagenum, pageSize: 20 }).then(res => {
              console.log("333")
              if (this.pagenum === 1) {
                this.goodsList = res.result.items
                this.pagenum = res.result.currentPage
                this.totalnum = res.result.pageCount
              } else if (this.pagenum > 1 && res.result.items) {
                this.goodsList = [
                  ...this.goodsList,
                  ...res.result.items
                ]
              }
              if (res.result.pageCount > 1) {
                ++this.pagenum
              }
            })
          }
        }
      },

      addCart(id) {
        console.log(id)
        if (id == 'success') {
          this.showHidPoup = !this.showHidPoup
          this.$refs.popup.timer('成功添加购物车')
          // this.getPopupStatus()
        } else {
          this.id = id
          this.showHidPoup = !this.showHidPoup
        }
      },

      //提示状态
      // getPopupStatus() {
      //   let that = this
      //   that.popupStatus = !that.popupStatus
      //   setTimeout(function () {
      //     that.popupStatus = !that.popupStatus
      //   }, 2000)
      // },
    },
    created() {
      console.log(this.value)
      if (this.$route.params.typeId == 0) {
        this.setSecond("");
        this.setSecondTwo("");
        this.setSecondThree("");
        this.setSecondFour("");
        this.setReclassify(false);
        this.setThreeClassify(false);
        this.setFourClassify(false);
      }
      let that = this
      window.onscroll = function () {
        //变量scrollTop是滚动条滚动时，距离顶部的距离
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        //变量windowHeight是可视区的高度
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        //变量scrollHeight是滚动条的总高度
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        //滚动条到底部的条件
        console.log(scrollTop, windowHeight, scrollTop + windowHeight, scrollHeight)
        if (Math.ceil(scrollTop + windowHeight) >= scrollHeight) {
          //写后台加载数据的函数
          console.log("距顶部" + scrollTop + "可视区高度" + windowHeight + "滚动条总高度" + scrollHeight);
          if (that.pagenum <= that.totalnum) {
            if (that.value) {
              that.getProductList(that.value)
            } else {
              that.getProductList()
            }
          }
        }
      }
    },

    mounted() {
      //类别页
      if (!this.isSearchPage) {
        this.getProductList();
      }
      //搜索结果页
      else {
        this.getProductList(this.value);
      }

    },

    watch: {
      $route(to, from) {
        console.log(to, from)
        if (to.params.typeId != from.params.typeId) {
          this.pagenum = 1
        }
        this.sortMode = 0;
        if (!this.isSearchPage) {
          this.getProductList();
        } else {
          this.pagenum = 1
          this.getProductList(to.params.text)
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      console.log(to, to.params.id, from)
      if (to.path == '/mall/show/goods/' + to.params.id) {
        this.setReclassify(false);
        this.setThreeClassify(false);
        this.setFourClassify(false);
        this.setSpcifications(-1)
        next()
      } else {
        next()
      }
    },
  }
</script>

<style scoped lang="less">
  @import "../../assets/css/var.less";

  .goodsTitle {
    font-family: PingFangSC-Medium;
    font-weight: 900;
    font-size: 20px;
    color: #333333;
    margin:20px 0;
  }

  .goodsListBox {
    position: relative;

    .banner {
      height: 420px;

      img {
        width: 100%;
        height: 100%;
        z-index: 0;
      }
    }

    .GoodsList {
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

      .sortBox {
        height: 60px;
        /* padding:20px 0; */
        line-height: 60px;

        span {
          font-size: 14px;
          color: #333 !important;
          position: relative;

          .sortImg {
            position: absolute;
            width: 16px;
            height: 16px;
            top: 22px;
            left: 34px;
          }
        }

        .title {
          color: @fontDefaultColor;
          display: inline-block;
          margin-right: 10px;
        }

        .normal {
          cursor: pointer;
          color: @fontDefaultColor;
          display: inline-block;
          margin-right: 10px;
        }

        .iconfont {
          color: @fontDefaultColor;
          display: inline-block;
          position: relative;
          left: -3px;
          z-index: -1;

          &:last-of-type {
            transform: rotate(180deg);
            left: -6px;
          }
        }

        .selected {
          color: @thirdColor;
        }
      }

      .classifyTitle {
        width: 100%;
        height: 80px;
        font-size: 30px;
        color: #333;
        text-align: center;
        line-height: 80px;
      }

      /* .result{
      margin-top:50px;
    } */

      .noGoods {
        margin: 38px auto;
        text-align: center;
        color: @thirdColor;
        font-size: 18px;
      }
    }
  }

  /* footer{
    width:100%;
    backgroun
  } */
</style>