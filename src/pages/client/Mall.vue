<template>
  <div class="Mall">
    <header>
      <div class="container clear">
        <span class="title" @click="navTo('/mall/show/goodsList/0/all')"><img class="homeImg"
            src="../../assets/img/home.png" alt=""><span class="titleContent">双维直营企业购</span> <span
            style="margin-left:10px;">客服电话：{{phone}}</span></span>
        <!-- <span v-else class="title">双维直营企业购 <span style="margin-left:10px;">客服电话：{{phone}}</span></span> -->
        <div class="right" v-if="clientId">
          <span class="name">{{clientName}}欢迎您~</span>
          <span @click="onSkip">个人中心</span>
          <span @click="logout">退出登录</span>
        </div>
      </div>
    </header>
    <div class="content" :style="{minHeight:clientHeight+'px'}">
      <!-- <div class="container"> -->
      <router-view></router-view>
      <!-- </div> -->
      <div class="fixedAd">
        <ul class="fixedList">
          <li @click="backToTop" v-show="shouldShowBT">
            <i class="iconfont icon-arrows-4-7" />
            <span>回顶部</span>
          </li>
        </ul>
      </div>
    </div>
    <footer>
      <div class="container">联拓数科提供技术支持Copyright © 2020 Liantuo. All Rights Reserved</div>
    </footer>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import NoticeList from '../../components/NoticeList';
  import { getClientSize, backToTop } from '../../util/util';

  export default {
    name: 'Mall',
    computed: {
      ...mapState([
        'clientId',
        'clientCode',
        'operatorType',
        'clientName',
        'phone'
      ]),
    },
    components: {
      NoticeList
    },
    data() {
      return {
        notices: ['今日疯抢：牛皮防水男靴仅229元！直减2...', '【福利】领1000元APP新人礼'],
        clientHeight: getClientSize().height,
        shouldShowBT: false
      }
    },

    methods: {
      ...mapMutations({
        clientLogout: 'CLIENT_LOGOUT',
      }),
      navTo(route) {
        console.log(route)
        this.$router.push(route)
      },
      logout() {
        this.clientLogout();
        this.$router.go();
      },
      backToTop() {
        backToTop();
      },
      watchScrollTop() {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > 300) {
          this.shouldShowBT = true;
        } else {
          this.shouldShowBT = false;
        }
      },

      onSkip() {
        if (this.operatorType == 0) {
          this.navTo('/mall/personal/cart')
        } else {
          this.navTo('/mall/personal/myOrder/0')
        }
      }
    },

    mounted() {
      document.addEventListener('scroll', this.watchScrollTop, false);
    },

    beforeDestroyed() {
      document.removeEventListener('scroll', this.watchScrollTop, false);
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/css/var.less";

  .Mall {
    width: 100%;
    background: #F5F5F5;

    header {
      width: 100%;
      background-color: #333333;
      height: 38px;
      color: @fontShallowColor;
      user-select: none;
      z-index: 10000;
      position: fixed;
      left: 0;
      top: 0;

      .container {
        position: relative;
        height: 38px;

        .title {
          left: 0;
          display: inline-block;
          height: 26px;
          top: 50%;
          line-height: 38px;
          font-size: 14px;

          .titleContent {
            cursor: pointer;
          }

          .homeImg {
            cursor: pointer;
            width: 20px;
            height: 20px;
            vertical-align: middle;
            margin-right: 6px;
            margin-top: -4px;
          }
        }

        .NoticeListBox {
          position: absolute;
          left: 200px;
        }

        .right {
          position: absolute;
          right: 0;
          display: inline-block;
          height: 26px;
          top: 50%;
          margin-top: -13px;
          line-height: 26px;
          font-size: 14px;

          span {
            margin-left: 20px;
            cursor: pointer;
          }

          .name {
            cursor: default;
          }
        }
      }
    }

    .content {
      /* padding-top: 40px; */
    }

    .fixedAd {
      position: fixed;
      right: 0;
      top: 548px;
      width: 72px;

      .fixedList {
        background-color: white;
        width: 100%;

        li {
          width: 100%;
          height: 80px;
          text-align: center;
          border: 1px solid @borderColor;
          cursor: pointer;
          padding-top: 12px;

          i {
            display: block;
            font-size: 30px;
            color: #666666;
          }

          span {
            display: block;
            font-size: 14px;
            color: #666666;
            margin-top: 4px;
          }

          /* &:last-child {
            border-bottom: none;
          } */

          &:hover {
            i {
              color: #b4a078;
            }

            span {
              color: #b4a078;
            }
          }
        }
      }
    }

    .bottomInfo {
      width: 100%;
      height: 300px;
      border-top: 1px solid @borderColor;
      overflow: hidden;
      margin-top: 80px;

      .footerItem {
        width: 33%;
        height: 210px;
        position: relative;
        top: 45px;
        display: inline-block;
        text-align: center;
        vertical-align: middle;
        color: @fontDefaultColor;

        .title {
          color: @fontDeepColor;
          margin-bottom: 30px;
        }
      }

      .service {
        border-right: 1px solid @borderColor;

        span {
          display: inline-block;
          width: 80px;
          height: 100px;
          border: 1px solid @borderColor;
          text-align: center;
          margin: 0 10px;
          font-size: 14px;
          cursor: pointer;

          &:hover {
            color: @thirdColor;
          }

          i {
            display: block;
            font-size: 30px;
            margin-top: 20px;
            margin-bottom: 10px;
          }
        }
      }

      .intro {
        border-right: 1px solid @borderColor;

        .intro-p {
          font-size: 13px;
          width: 300px;
          margin: 0 auto;
          text-align: left;
          color: @fontDeepColor;
          line-height: 1.8em;
        }

        div {
          text-align: left;
          font-size: 14px;
          margin-left: 47px;
          margin-top: 20px;

          img {
            margin: 0 6px;
            display: inline-block;
            vertical-align: middle;
          }
        }
      }

      .code {
        img {
          display: block;
          margin: 0 auto;
        }

        span {
          font-size: 12px;
          color: @thirdColor;
          margin-top: 10px;
          display: block;
        }
      }
    }

    footer {
      width: 100%;
      height: 90px;
      background-color: #333;
      overflow: hidden;

      div {
        font-size: 12px;
        color: #D4D4D4;
        text-align: center;
        line-height: 90px;
      }

      .footerTop {
        padding: 36px 0;
        width: 100%;

        li {
          display: inline-block;
          width: 33%;
          text-align: center;

          img {
            vertical-align: middle;
          }

          span {
            vertical-align: middle;
            font-size: 18px;
            margin-left: 10px;
          }
        }
      }

      .footerBottom {
        color: @fontDefaultColor;
        margin-top: 30px;
        font-size: 13px;
        text-align: center;

        ul {
          li {
            display: inline-block;
            cursor: pointer;
            padding: 0 6px;
            border-right: 2px solid @fontDefaultColor;

            &:last-child {
              border-right: none;
            }
          }
        }

        p {
          margin-top: 5px;
        }
      }
    }
  }
</style>