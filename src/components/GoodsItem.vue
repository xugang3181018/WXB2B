<template>
  <!-- <li class="GoodsItem">
    <div class="imgBox">
      <img v-if="img" :src="img" alt="商品图片" @click="navTo('/mall/show/goods/'+goodsCode+'/'+code)" />
      <img v-else src="../assets/img/default.png" alt="" @click="navTo('/mall/show/goods/'+goodsCode+'/'+code)" />
    </div>
    <div class="goodsInfo">
      <span class="goodsName ellipsis" @click="navTo('/mall/show/goods/'+goodsCode+'/'+code)">{{name}}</span>
      <span style="display:inline-block;margin-bottom: 4px;">{{goodsCode}}</span>
      <span class="price">{{'¥'+price}}<span v-show="goodsUnit" class="price2">{{"/"+goodsUnit}}</span></span> -->
  <!-- <span v-show="goodsUnit" class="price2">{{goodsSpec+"/"+goodsUnit}}</span> -->
  <!-- <div v-if="operatorType == 0" class="addCart" @click="addCart">购物车</div>
    </div>
  </li> -->
  <li class="commodity-item">
    <div class="commodity-item-top">
      <span>
        <img v-if="img" :src="img" alt="商品图片" @click="navTo('/mall/show/goods/'+goodsCode+'/'+code)" />
        <img v-else src="../assets/img/default.png" alt="" @click="navTo('/mall/show/goods/'+goodsCode+'/'+code)" />
      </span>
    </div>
    <div class="commodity-item-bottom">
      <div class="first-commodity" @click="navTo('/mall/show/goods/'+goodsCode+'/'+code)">{{name}}</div>
      <div class="second-commodity">{{goodsCode}}</div>
      <div class="third-commodity">
        <span class="spec">{{'¥'+price}}{{"/"+goodsUnit}}</span>
        <span class="btn" v-if="operatorType == 0" @click="addCart">加入购物车</span>
      </div>
    </div>
  </li>
</template>

<script>
  export default {
    name: 'GoodsItem',
    props: {
      id: {
        type: Number,
        default: 0
      },
      img: {
        type: String,
        default: ""
      },
      name: {
        type: String,
        default: ''
      },
      price: {
        type: Number,
        default: 0
      },
      goodsSpec: {
        type: String,
        default: ""
      },
      goodsUnit: {
        type: String,
        default: ""
      },
      code: {
        type: String,
        default: ""
      },
      goodsCode: {
        type: String,
        default: ""
      },
      operatorType: {
        default: ""
      }
    },
    data() {
      return {
      }
    },
    methods: {
      navTo(route) {
        this.$router.push(route);
      },
      addCart() {
        this.$emit('addCart');
      }
    },
  }
</script>

<style scoped lang="less">
  @import "../assets/css/var.less";

  .commodity-item {
    display: inline-block;
    max-width:309px;
    height: 375px;
    background: #fff;
    display: flex;
    flex-flow: column nowrap;
    margin: 10px 0;
    float: left;

    .commodity-item-top {
      width:;
      height: 240px;
      cursor: pointer;

      span {

        font-size: 0;

        width:309px;

        height:240px;

        display: table-cell;

        text-align: center;

        vertical-align: middle;

      }

      img {

        max-width: 100%;

        max-height: 100%;

      }
    }

    .commodity-item-bottom {
      display: flex;
      flex-flow: column nowrap;
      padding-left: 20px;

      .first-commodity {
        padding-top: 20px;
        padding-bottom: 8px;
        font-size: 16px;
        color: #333;
        font-weight: 600;
        cursor: pointer;
      }

      .second-commodity {
        padding-bottom: 20px;
        font-size: 12px;
        color: #999;
        cursor: pointer;
      }

      .third-commodity {
        padding-right: 15px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;

        .spec {
          font-size: 18px;
          color: #F66F51;
        }

        .btn{
          display: inline-block;
          min-width: 90px;
          height: 30px;
          border: 1px solid #F66F51;
          color: #F66F51;
          line-height: 30px;
          text-align: center;
          cursor: pointer;
        }
      }
    }
  }

  /* .GoodsItem {
    display: inline-block;
    width: 285px;
    height: 420px;
    overflow: hidden;
    margin-top:20px;

    &:hover {
      img {
        transform: scale(1.05);
        width:285px;
        height:285px;
        border:1px solid #eee;
      }
    }

    .imgBox {
      width: 100%;
      height: 285px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        cursor: pointer;
        transition: transform 0.5s;
        border:1px solid #eee;
      }
    }

    .goodsInfo {
      width: 100%;
      height: 60px;
      font-size: 14px;
      text-align: center;

      .goodsName {
        display: block;
        text-align: center;
        cursor: pointer;
        margin-top: 20px;
        margin-bottom: 10px;
        line-height: 20px;

        &:hover {
          color: @thirdColor;
        }
      }

      .price {
        display: block;
        font-size:18px;
        text-align: center;
        color: @falseColor;

        .price2 {
        display: inline-block;
        font-size: 13px;
        /* width:200px; */
  /* margin: 10px auto 0;
        text-align: center;
        color: #000;
        line-height:30px
      }
      }


      .addCart{
        display: inline-block;
        margin-left:6px;
        color:#BE4141;
        border:2px solid #BE4141;
        padding:2px 4px;
        border-radius:4px;
        cursor: pointer;
      }
    }
  }  */
</style>