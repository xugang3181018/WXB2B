<template>
  <div class="MallShow">
    <!-- <FixedNav v-show="navShouldFixed" width="100%">
      <div slot="navContent" class="container fixedNavContainer">
        <ul class="fixedRight">
          <li v-for="(item,index) in typeList" :key="index" :class="{selected:judgeCurPath(item.categoryId)}"
            @mouseenter="onMouseOver(item.categoryId,2)" @mouseleave="onMouseOut"
            @click.stop="selectType(item.categoryId,item.categoryName,item.children)">
            {{item.categoryName}}</li>
          <img class="classifyImg" src="../../assets/img/classify.png" alt="">
        </ul>
        <ul v-show="versionTotal2" class="oneClassisyBox" @mouseenter="onMouseOver1(2)" @mouseleave="onMouseOut1">
          <li class="oneClassify" v-for="(item,index) in typeList2" :key="index"
            @click="selectType(item.categoryId,item.categoryName,item.children)">
            <span> {{item.categoryName}}</span>
            <ul>
              <li class="twoTitle" v-for="(items,indexs) in item.children?item.children.slice(0,2):item.children"
                :key="indexs">
                {{(items.categoryName == '全部'?'':"|"+" "+items.categoryName)}}
              </li>
            </ul>
            <ul class="twoClassifyBox">
              <li class="arrows"></li>
              <li class="twoClassify" v-for="(twoItem,twoIndex) in item.children" :key="twoIndex"
                @click.stop="selectType(twoItem.categoryId,twoItem.categoryName,twoItem.children)">
                <span>{{(twoItem.categoryName == '全部'?'':"|"+" "+twoItem.categoryName)}}：</span>
                <ul class="threeClassifyBox">
                  <li class="threeClassify" v-for="threeItem in twoItem.children"
                    @click.stop="selectType3(threeItem.categoryName,threeItem.categoryId,threeItem.children)">
                    {{(threeItem.categoryName == '全部'?'':threeItem.categoryName)}}</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
        <div v-if="operatorType == 0" class="cartStatus" @click="navTo('/mall/personal')">
          <img class="cartImg" src="../../assets/img/cart.png" alt="">
          <span class="text">购物车</span>
          <span class="quantity">{{totailNumber > 99?"99+":totailNumber}}</span>
        </div>
      </div>
    </FixedNav> -->
    <div style="background:#fff;padding-top:40px;">
      <div class="container">
        <div class="hesdBox">
          <div class="title" @click="navTo('/mall/show/goodsList/0/all')">
            <span class="first-input">双维直营</span>
            <span class="second-input">企业购</span>
          </div>
          <div v-if="operatorType == 0" class="cartStatus" @click="navTo('/mall/personal')" @mouseenter="mouseOver">
            <img class="cartImg" src="../../assets/img/car.png" alt="">
            <span class="text">购物车</span>
            <span class="quantity">{{totailNumber > 99?"99+":totailNumber}}</span>
            <!-- <div v-show="cartList" class="cart" @mouseleave="mouseOut">
              <ul v-if="addCart" class="cartList">
                <li v-for="(item,index) in addCart" :key="index" class="cartListBox">
                  <div class="goodsImg">
                    <img v-if="item.goodsImg" class="goodsImg" :src="item.goodsImg" alt="商品图片" />
                    <img v-else class="goodsImg" src="../../assets/img/default.png" alt="">
                  </div>
                  <div class="goodsName">
                    <p>{{item.goodsName}}</p>
                    <span>{{item.goodsSpec}}</span>
                  </div>
                  <div class="totailPrice">
                    <span>{{'x' + item.goodsAmount}}</span>
                    <p class="amount">{{'￥'+item.goodsTotal}}</p>
                  </div>
                </li>
              </ul>
              <div class="cartTotal">
                <div class="totalNumber">
                  <span class="title">商品合计</span>
                  <p class="number">{{'￥'+totalAmount}}</p>
                </div>
                <div class="goPay">
                  <span class="title" @click="navTo('/mall/personal')">去购物车结算</span>
                </div>
              </div>
            </div> -->
          </div>
          <div class="inventory"  @click.stop="onSkip">
            <img class="myOrderImg" src="../../assets/img/order.png" alt="">
            <span>采购清单</span>
            <div v-show="cartList" class='Modal-input' @mouseleave="mouseOut">
              <div v-for="(item,index) in addCart" :key="index" class='Modal-item-input'  @click.stop="goDetail(item)">
                <div class='Modal-item-first'>
                  <img v-if="item.goodsImg" class="goodsImg" :src="item.goodsImg" alt="商品图片" />
                  <img v-else class="goodsImg" src="../../assets/img/default.png" alt="">
                </div>
                <div class='Modal-item-second'>{{item.goodsName}}</div>
                <div class='Modal-item-last'>
                  <span>X{{item.goodsAmount}}</span>
                  <span>¥{{item.goodsTotal}}</span>
                </div>
              </div>
              <div class='Modal-bottom-input'>
                <span>商品合计：</span>
                <span>¥{{totalAmount}}</span>
                <div @click.stop="navTo('/mall/personal')">去购物车下单</div>
              </div>
            </div>
          </div>
          <div class="searchBox">
            <i class="iconfont icon-search" @click="searchConfirm" />
            <TipsInput placeholder="请输入商品关键字" @tipsCChosen="searchTip" ref="TipsInput" v-model="searchText" />
            <span @click="searchConfirm">搜索</span>
          </div>
        </div>
      </div>
      <div ref="typeList" class="nav container">
        <ul class="typeList">
          <li v-for="(item,index) in typeList" :key="index" :class="{selected:judgeCurPath(item.categoryId)}"
            @click="selectType(item.categoryId,item.categoryName,item.children)"
            @mouseenter="onMouseOver(item.categoryId,1)" @mouseleave="onMouseOut">
            <p>{{item.categoryName}}</p>
          </li>
          <img class="classifyImg" src="../../assets/img/classify.png" alt="">
        </ul>
        <ul v-show="versionTotal1"  class="oneClassisyBox" @mouseenter="onMouseOver1(1)" @mouseleave="onMouseOut1">
          <li class="oneClassify" v-for="(item,index) in typeList2" :key="index"
            @click="selectType(item.categoryId,item.categoryName,item.children)">
            <span class="oneTitle"> {{item.categoryName}}</span>
            <ul>
              <!-- <li class="twoTitle" v-for="items in item.children.slice(0,2)"> -->
              <li class="twoTitle" v-for="(items,indexs) in item.children?item.children.slice(0,2):item.children"
                :key="indexs">
                {{(items.categoryName == '全部'?'':"|"+" "+items.categoryName)}}
              </li>
            </ul>
            <ul class="twoClassifyBox">
              <li class="arrows"></li>
              <li class="twoClassify" v-for="(twoItem,twoIndex) in item.children" :key="twoIndex"
                @click.stop="selectType(twoItem.categoryId,twoItem.categoryName,twoItem.children)"  v-show="twoItem.categoryName != '全部'">
                <span>{{(twoItem.categoryName == '全部'?'':twoItem.categoryName+'：')}}</span>
                <ul class="threeClassifyBox">
                  <li class="threeClassify" v-for="threeItem in twoItem.children"
                    @click.stop="selectType3(threeItem.categoryName,threeItem.categoryId,threeItem.children)">
                    {{(threeItem.categoryName == '全部'?'':threeItem.categoryName)}}</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!-- <div class=" container">
          <div class="submenu">{{'全部' + second + secondTwo + secondThree + secondFour}}</div>
        </div> -->
      <img class="goodsImg" src="../../assets/img/banner.png" alt="" />
      <!-- <div class="banner" :style="{width:clientWidth+'px'}">
        <img src="../../assets/img/banner.png" alt="banner" />
      </div> -->
    </div>
    <!-- <div style="height:50px;"></div> -->
    <div style="background:#fff;">
      <!-- <div class=" container">
        <Classify v-if="reclassify" :classify="reclassify" @selectType="selectType2" />
        <Classify v-if="threeClassify" :classify="threeClassify" @selectType="selectType3" />
        <Classify v-if="fourClassify" :classify="fourClassify" @selectType="selectType4" />
      </div> -->
    </div>
    <!-- <div class="container"> -->
    <router-view></router-view>
    <!-- </div> -->
  </div>
</template>

<script>
  import { mapState, mapMutations } from "vuex";
  import { getTypes, getGoodsList, categoryList } from "../../api/client";
  import TipsInput from "../../components/TipsInput";
  import FixedNav from "../../components/FixedNav";
  import Classify from "../../components/Classify";

  export default {
    name: "MallShow",
    components: {
      TipsInput,
      FixedNav,
      Classify,
    },
    computed: {
      ...mapState({
        clientId: state => state.clientId,
        clientCode: state => state.clientCode,
        //分类路径1
        second: state => state.second,
        //分类路径2
        secondTwo: state => state.secondTwo,
        //分类路径3
        secondThree: state => state.secondThree,
        //分类路径4
        secondFour: state => state.secondFour,
        //一级分类
        // classify: state =>state.classify,
        //二级分类
        reclassify: state => state.reclassify,
        //三级级分类
        threeClassify: state => state.threeClassify,
        //四级级分类
        fourClassify: state => state.fourClassify,
        //购物车数据
        addCart: state => state.addCart,
        isActive: state => state.isActive,
        operatorType: state => state.operatorType,
        supplierCode: state => state.supplierCode
      }),
      totalAmount() {
        let amount = 0;
        this.addCart.map((item, index) => {
          console.log(item)
          console.log(item)
          if (item.goodsAmount) {
            amount += item.goodsTotal;
          }
        })
        return amount;
      },
      totailNumber() {
        let number = 0;
        this.addCart.map((item, index) => {
          console.log(item)
          console.log(item)
          if (item.goodsAmount) {
            number += item.goodsAmount;
          }
        })
        return number;
      },
      curPath() {
        // console.log(this.$route.path);
        return this.$route.path;
      }
      // idx(index) {
      //   return index
      // }
    },
    data() {
      return {
        typeList: [],
        typeList2: [],
        data: [],
        index: "",
        show: false,
        versionTotal1: false,
        versionTotal2: false,
        searchText: "",
        tips: ["aa", "bb", "cc"],
        navShouldFixed: false,
        goodsListBox: false,
        quantity: "99+",
        cartList: false
      };
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
        //一级分类
        setClassify: "SET_CLASSIFY",
        //二级分类
        setReclassify: "SET_RECLASSIFY",
        //三级分类
        setThreeClassify: "SET_THREE_CLASSIFY",
        //四级分类
        setFourClassify: "SET_FOUR_CLASSIFY",
        classify: "CLASSIFY",
        // setIsActive: "SET_ISACTIVE",
        clearIsActive: "CLEAR_ISACTIVE"
      }),

      navTo(route) {
        // console.log(route, "跳转路径");
        this.$router.push(route);
      },

      onSkip(){
        this.navTo('/mall/personal/myOrder/0')
      },

      goDetail(data){
        this.navTo(`/mall/show/goods/${data.goodsBarcode}/${data.goodsId}`)
      },

      judgeCurPath(typeId) {
        if (typeId === -1) {
          if (this.curPath.indexOf("/show/index") > -1) {
            return true;
          } else {
            return false;
          }
        } else {
          if (this.curPath.indexOf(`/show/goodsList/${typeId}`) > -1) {
            return true;
          } else {
            return false;
          }
        }
      },

      //获取二级分类的内容
      oneClassifyData(data) {
        console.log(data, "二级导航的内容")
        this.data = data
      },

      selectType(typeId, value, data, type, index) {
        this.clearIsActive()
        this.versionTotal1 = false;
        this.versionTotal2 = false;
        if (typeId === -1) {
          this.navTo("/mall/show/index");
        } else {
          this.navTo("/mall/show/goodsList/" + typeId + "/all");
          this.versionTotal = false;
          if (typeId === 0) {
            console.log("全部")
            this.setSecond("");
            this.setSecondTwo("");
            this.setSecondThree("");
            this.setSecondFour("");
            this.setReclassify(false);
            this.setThreeClassify(false);
            this.setFourClassify(false);
          } else {
            console.log(data, typeId);
            this.setSecond(">" + " " + value);
            this.setSecondTwo("");
            this.setSecondThree("");
            this.setSecondFour("");
            if (data.length) {
              if (data[0].categoryName != "全部") {
                data.unshift(
                  {
                    categoryId: typeId,
                    categoryName: "全部"
                  }
                );
              }
              this.setReclassify(data);
              this.setThreeClassify(false);
              this.setFourClassify(false);
            } else {
              this.setReclassify(false);
              this.setThreeClassify(false);
              this.setFourClassify(false);
            }
          }
        }
      },

      selectType2(value, typeId, data) {
        console.log(data, typeId, 2)
        this.navTo("/mall/show/goodsList/" + typeId + "/all");
        if (value != "全部") {
          this.setSecondTwo(">" + " " + value);
        } else {
          this.setSecondTwo("");
          this.setSecondThree("");
          this.setSecondFour("");
          this.setThreeClassify(false);
          this.setFourClassify(false);
        }
        this.setSecondThree("");
        if (data) {
          if (data[0].categoryName != "全部") {
            data.unshift(
              {
                categoryId: typeId,
                categoryName: "全部"
              }
            );
          }
          this.setThreeClassify(data);
          this.setFourClassify(false);
        } else {
          this.setReclassify(false);
        }
      },
      selectType3(value, typeId, data) {
        this.versionTotal1 = false;
        console.log(data, typeId, 3)
        this.navTo("/mall/show/goodsList/" + typeId + "/all");
        if (value != "全部") {
          this.setSecondThree(">" + " " + value);
        } else {
          this.setSecondThree("");
          this.setSecondFour("");
          this.setFourClassify(false);
        }
        if (data) {
          if (data[0].categoryName != "全部") {
            data.unshift(
              {
                categoryId: typeId,
                categoryName: "全部"
              }
            );
          }
          this.setFourClassify(data);
        } else {
          this.setFourClassify(false);
        }
      },
      selectType4(value, typeId, data) {
        console.log(data, typeId, 4)
        if (value != "全部") {
          this.setSecondFour(">" + " " + value);
        } else {
          this.setSecondFour("");
        }
        this.navTo("/mall/show/goodsList/" + typeId + "/all");
      },

      mouseOver() {
        this.cartList = true
      },

      mouseOut() {
        this.cartList = false
      },

      onMouseOver(id, type) {
        console.log(type)
        if (type == 1) {
          if (id === 0) {
            this.versionTotal1 = true;
          }
        } else if (type == 2) {
          if (id === 0) {
            this.versionTotal2 = true;
          }
        }

      },
      onMouseOut() {
        this.versionTotal1 = false;
        this.versionTotal2 = false;
      },
      onMouseOver1(type) {
        if (type == 1) {
          this.versionTotal1 = true;
        } else if (type == 2) {
          this.versionTotal2 = true;
        }
      },
      onMouseOut1() {
        this.versionTotal1 = false;
        this.versionTotal2 = false;
      },
      searchTip(tip) {
        console.log(tip)
        alert(tip);
      },
      searchTextChange(text) { },
      searchConfirm() {
        if (this.searchText.trim().length <= 0) {
          alert("输入不能为空！");
          return;
        }
        console.log(this.searchText)
        this.navTo(`/mall/show/goodsList/-1/${this.searchText}`);
      },
      scrollHandle() {
        const top = this.$refs.typeList.getBoundingClientRect().top;
        //还未到顶
        if (top > 0) {
          this.navShouldFixed = false;
        }
        //已经到顶
        else {
          this.navShouldFixed = true;
        }
      }
    },
    created() {
      let that = this;
      document.onkeypress = function (e) {
        if (e.keyCode == 13) {
          that.searchConfirm();
        }
      };
    },

    mounted() {
      // console.log(this.clientId, this.clientCode);
      categoryList({
        appId: this.clientId,
        merchantCode: this.supplierCode,
        categoryScene: 1
      }).then(res => {
        console.log(res, "商品分类");
        if (res.result.length) {
          let list = res.result.filter(item => item.categoryName.search("烟") == -1)
          console.log(list)
          list.unshift(
            {
              categoryId: 0,
              categoryName: "企业购商品分类"
            }
          );
          this.typeList = list;
          console.log(this.typeList, "分类列表");
          this.typeList2 = list.slice(1);
          console.log(this.typeList2)
        }
      });


      //监听滚动事件
      document.addEventListener("scroll", this.scrollHandle, false);
    },

    destroyed() {
      document.removeEventListener("scroll", this.scrollHandle, false);
    },
    watch: {
      searchText(newVal, oldVal) {
        this.searchTextChange(newVal);
      }
    },
  };
</script>

<style scoped lang="less">
  @import "../../assets/css/var.less";

  .MallShow {
    width: 100%;
    
    .goodsImg{
      height: 420px;
    }
    .Modal-input {
      width: 350px;
      height: 440px;
      background: #fff;
      border: 1px solid #eee;
      box-shadow: 4px 6px 12px 0 rgba(201, 201, 201, 0.50);
      position: absolute;
      top:68px;
      /* right:148px; */
      right:-131px;
      z-index: 999;

      .Modal-item-input {
        height: 70px;
        display: flex;
        flex-flow: row nowrap;
        margin-left: 23px;
        margin-right: 10px;
        margin-top: 20px;

        .Modal-item-first {
          width: 70px;
          height: 70px;
          background: skyblue;

          .goodsImg {
            width: 70px;
            height: 70px;
            border: 1px solid #eee;
          }
        }

        .Modal-item-second {
          flex: 1;
          margin-left: 20px;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #666666;
          display: flex;
          align-items: center;
        }

        .Modal-item-last {
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-around;
          align-items: flex-end;
          margin-left: 50px;

          span:first-child {
            color: #666;
          }

          span:last-child {
            color: #F66F51;
          }
        }
      }

      .Modal-bottom-input {
        width: 100%;
        height: 63px;
        background: #F3F3F3;
        position: absolute;
        bottom: 0;
        z-index: 99;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;

        span:first-child {
          font-size: 12px;
          padding-left: 21px;
          padding-right: 10px;
        }

        span:nth-child(2) {
          flex: 1;
          font-size: 21px;
          color: #F66F51;
          padding-right: 40px;
          font-weight: 600;
        }

        div {
          width: 100px;
          height: 40px;
          background: #F66F51;
          text-align: center;
          line-height: 40px;
          color: #fff;
          margin-right:20px;
        }
      }
    }

    .banner {
      width: 100%;
      height: 420px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .hesdBox {
      width: 100%;
      height: 40px;
      margin-top: 20px;
      position: relative;
      z-index: 999;
      margin-bottom: 30px;

      .title {
        display: inline-block;
        cursor: pointer;

        /* span:nth-child(1) {
          font-size: 38px;
          color: #1E1E1E;
        } */

        .first-input {
          padding-right: 14px;
          font-family: MF-FangHei-Noncommercial-Regular;
          font-size: 28px;
          color: #333333;
          font-weight: 600;
        }

        /* span:nth-child(2) {
          font-size: 28px;
          color: #B08830;
        } */

        .second-input {
          padding-right: 83px;
          font-family: MF-FangHei-Noncommercial-Regular;
          font-size: 20px;
          color: #AF7E49;
          font-weight: 600;
        }
      }

      .searchBox {
        float: right;
        display: inline-block;
        vertical-align: middle;
        text-align: left;
        width: 470px;
        height: 40px;
        /* border-radius: 20px; */
        border: 2px solid #333;
        position: relative;

        .TipsInput {
          margin-left: 10px;
        }

        .icon-search {
          font-size: 18px;
          font-weight: bold;
          color: #c5c5c5;
          cursor: pointer;
          position: relative;
          top: 2px;
          left: 10px;
        }

        span {
          display: inline-block;
          height: 100%;
          width: 60px;
          /* border-radius: 0 20px 20px 0; */
          white-space: normal;
          background: #333;
          position: absolute;
          right: 0;
          color: #fff;
          text-align: center;
          line-height: 38px;
        }
      }

      .inventory {
        float: right;
        border: 1px solid #f4f4f4;
        width: 120px;
        height: 40px;
        font-size: 12px;
        margin-left: 80px;
        line-height: 40px;
        text-align: center;
        color: #333;
        cursor: pointer;
        position: relative;

        .myOrderImg {
          width: 14px;
          height: 16px;
          position: absolute;
          left: 16px;
          top: 13px;
        }

        span {
          margin-left: 10px;
        }
      }

      .cartStatus {
        float: right;
        margin-left: 10px;
        display: inline-block;
        border: 1px solid #f4f4f4;
        width: 120px;
        height: 40px;
        cursor: pointer;
        /* border-radius: 20px; */

        .cartImg {
          width: 16px;
          height: 18px;
          position: relative;
          top: 4px;
          left: 10px;
        }

        .text {
          font-size: 12px;
          color: #333;
          line-height: 40px;
          margin-left: 15px;
        }

        .quantity {
          display: inline-block;
          width: 26px;
          height: 20px;
          font-size: 12px;
          border-radius: 12px;
          background: rgb(243, 43, 43);
          margin-left: 10px;
          color: #fff;
          position: relative;
          left: 19px;
          top: -20px;
          text-align: center;
          line-height: 20px;
          ;
        }

        .cart {
          /* display: none; */
          width: 300px;
          height: 400px;
          border: 1px solid #b4a078;
          position: absolute;
          top: 40px;
          right: 0;
          background: #fff;

          .cartList {
            width: 100%;
            height: 340px;
            overflow: auto;
            padding: 12px;

            .cartListBox {
              margin-top: 10px;

              .goodsImg {
                width: 60px;
                height: 60px;
                border: 1px solid #eee;
                display: inline-block;
                vertical-align: top;
              }

              .goodsName {
                width: 100px;
                display: inline-block;
                line-height: 26px;
                font-size: 14px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }

              .totailPrice {
                width: 90px;
                display: inline-block;
                text-align: right;
                line-height: 26px;

                .amount {
                  color: #b4a078;
                }
              }
            }
          }

          .cartTotal {
            width: 100%;
            height: 60px;
            /* border-radius: 0 0 6px 6px; */
            background: #eee;
            position: absolute;
            bottom: 0;
            text-align: center;
            font-size: 16px;

            .totalNumber {
              float: left;
              width: 50%;
              text-align: left;
              padding-left: 10px;

              .title {
                color: #ccc;
                line-height: 36px;
              }

              .number {
                color: #b4a078;
              }

            }

            .goPay {
              float: left;
              width: 50%;

              .title {
                display: inline-block;
                height: 40px;
                width: 80%;
                margin: 10px auto;
                line-height: 40px;
                color: #fff;
                /* border-radius: 4px; */
                background: #b4a078;
              }
            }
          }
        }
      }

      /* .cartStatus:hover {
        .cart {
          display: block;
        }
      } */
    }

    .nav {
      text-align: left;
      white-space: nowrap;


      /* 下拉菜单样式 */
      .oneClassisyBox {
        position: absolute;
        top: 172px;
        z-index:9999;

        .oneClassify {
          width: 200px;
          /* height: 80px; */
          padding: 10px 0 10px 20px;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          font-size: 14px;
          position: relative;
          /* overflow: hidden; */

          .oneTitle {
            line-height: 30px;
          }

          .twoTitle {
            font-size: 12PX;
            color: rgba(265, 265, 265, 0.6);
            display: inline-block;
            margin-right: 10px;
            word-wrap: break-word;
            /* overflow: hidden; */
              /*内容超出后隐藏*/
              /* text-overflow: ellipsis; */
              /* 超出内容显示为省略号*/
              /* white-space: nowrap; */
              /*文本不进行换行*/
          }

          .twoClassifyBox {
            display: none;
          }
        }

        .oneClassify:last-of-type {
          min-height: 80px;
        }

        .oneClassify:hover {
          /* color: #b4a078; */
          cursor: pointer;

          .twoClassifyBox {
            position: absolute;
            width: 410px;
            padding: 0 20px;
            background: rgba(265, 265, 265, 0.7);;
            top: 0;
            left: 200px;
            box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.8);
            display: block;
            z-index:9999;


            .arrows {
              width: 0;
              height: 0;
              border:8px solid rgba(0, 0, 0, 0.1);
              border-right: 10px solid rgba(265, 265, 265, 0.7);
              position: absolute;
              top: 20px;
              left: -17px;
            }

            .twoClassify {
              line-height: 40px;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-right: 10px;

              span {
                display: inline-block;
                width: 90px;
                float: left;
                font-weight: 900;
                color: #333;
                text-align:right;
              }

              .threeClassifyBox {
                display: inline-block;
                margin-left: 10px;
                width: 310px;

                .threeClassify {
                  /* width: 90px; */
                  padding: 0 10px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  float: left;
                  color: #333;
                  margin-right: 10px;
                }

                .threeClassify:hover {
                  color: #b4a078;
                }
              }
            }
          }

          .twoClassify:hover {
            span {
              color: #b4a078;
            }
          }
        }
      }

      .fixedLeft {
        display: inline-block;
        vertical-align: middle;
        width: 15%;
        height: 100%;
        font-size: 30px;
        color: #b4a078;
        user-select: none;
        line-height: 64px;
        text-align: center;
        cursor: pointer;
      }

      .typeList {
        max-width: 1200px;
        margin: 0;
        display: inline-block;
        background-color: white;
        display: inline-block;
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;


        li:nth-child(1) {
          background: #000;
          color: #fff;
          width: 200px;
          margin: 0;
          /* line-height:45px; */
        }


        .classifyImg {
          width: 20px;
          height: 20px;
          position: absolute;
          left: 10px;
          top: 10px;
          z-index: 999;
        }

        li {
          display: inline-block;
          margin: 0 30px;

          p {
            height: 42px;
            line-height: 42px;
            text-align: center;
            font-size: 14px;
            cursor: pointer;
          }
        }

        li:hover {
          p {
            color: rgb(175, 126, 73);
          }
        }

        .selected {
          color: rgb(175, 126, 73);
          /* border-bottom: 3px solid#b4a078; */
        }
      }
    }

    .submenu {
      width: 100%;
      height: 56px;
      font-size: 12px;
      line-height: 56px;
      background-color: white;
      border-top: 1px dotted @borderColor;

      li {
        display: inline-block;
        margin: 0 50px;
      }

      .selected {
        color: #b4a078;
        border-bottom: 3px solid #b4a078;
      }
    }

    .fixedNavContainer {
      text-align: left;
      white-space: nowrap;
      position: relative;

      /* 下拉菜单样式 */
      .oneClassisyBox {
        position: absolute;
        top: 60px;

        .oneClassify {
          width: 200px;
          height: 60px;
          line-height: 20px;
          padding: 10px 0 10px 20px;
          background: rgba(0, 0, 0, 0.9);
          color: #fff;
          font-size: 12px;
          position: relative;

          .oneTitle {
            line-height: 30px;
          }

          .twoTitle {
            font-size: 10px;
            color: rgba(265, 265, 265, 0.6);
            float: left;
            margin-right: 10px;
            /* overflow: hidden; */
              /*内容超出后隐藏*/
              /* text-overflow: ellipsis; */
              /* 超出内容显示为省略号*/
              /* white-space: nowrap; */
              /*文本不进行换行*/
          }

          .twoClassifyBox {
            display: none;
          }
        }

        .oneClassify:last-of-type {
          height: 80px;
        }

        .oneClassify:hover {
          /* color: #b4a078; */
          cursor: pointer;

          .twoClassifyBox {
            position: absolute;
            width: 410px;
            padding: 0 20px;
            background: #fff;
            top: 0;
            left: 200px;
            box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.8);
            display: block;

            .arrows {
              width: 0;
              height: 0;
              border: 10px solid rgba(0, 0, 0, 0.4);
              border-right: 10px solid #fff;
              position: absolute;
              top: 20px;
              left: -20px;
            }

            .twoClassify {
              /* width: 100px;
              line-height: 40px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              float: left;
              margin-right: 10px; */
              line-height: 40px;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-right: 10px;


              span {
                display: inline-block;
                width: 90px;
                float: left;
                font-weight: 900;
                color: #333;
              }

              .threeClassifyBox {
                display: inline-block;
                margin-left: 10px;
                width: 310px;


                .threeClassify {
                  /* width: 100px; */
                  padding: 0 10px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  float: left;
                  color: #333;
                  margin-right: 10px;
                }

                .threeClassify:hover {
                  color: rgb(175, 126, 73);
                }
              }
            }
          }

          .twoClassify:hover {
            span {
              color: rgb(175, 126, 73);
            }
          }
        }
      }

      .fixedLeft {
        display: inline-block;
        vertical-align: middle;
        width: 15%;
        height: 100%;
        font-size: 30px;
        color: rgb(175, 126, 73);
        user-select: none;
        line-height: 64px;
        text-align: center;
        cursor: pointer;
      }

      .cartStatus {
        margin-top: 13px;
        float: right;
        margin-left: 10px;
        display: inline-block;
        border: 1px solid #f4f4f4;
        width: 120px;
        height: 40px;
        cursor: pointer;
        /* border-radius: 20px; */

        .cartImg {
          width: 20px;
          height: 20px;
          position: relative;
          top: 4px;
          left: 10px;
        }

        .text {
          font-size: 12px;
          color: #333;
          line-height: 40px;
          margin-left: 10px;
        }

        .quantity {
          display: inline-block;
          width: 26px;
          height: 20px;
          font-size: 12px;
          border-radius: 12px;
          background: rgb(243, 43, 43);
          margin-left: 10px;
          color: #fff;
          position: relative;
          left: -4px;
          text-align: center;
          line-height: 20px;
        }
      }

      .fixedRight {
        height: 100%;
        width: 84%;
        display: inline-block;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;

        li:nth-child(1) {
          height: 60px;
          background: #000;
          color: #fff;
          width: 200px;
          margin: 0;
          line-height: 60px;
          margin: 0;
        }

        li {
          display: inline-block;
          /* width: 60px; */
          margin: 0 10px;
          text-align: center;
          height: 30px;
          line-height: 20px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          position: relative;
          top: 4px;
        }

        .classifyImg {
          width: 20px;
          height: 20px;
          position: absolute;
          left: 20px;
          top: 24px;
          z-index: 999;
        }

        .selected {
          color: rgb(175, 126, 73);
          /* border-bottom: 3px solid #b4a078; */
        }
      }
    }
  }
</style>