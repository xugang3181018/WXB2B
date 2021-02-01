<template>
  <div class="ClientLogin" :style="{width:width+'px',height:height+'px'}">
    <div class="login-wrap">
      <!-- {/* 左面图片 */} -->
      <div class="login-wrap-left">
        <div class="left-bg">
          <img src="../../assets/img/tem.png" alt="车图" />
        </div>
      </div>
      <!-- {/* 右面布局 */} -->
      <div class="login-wrap-right">
        <!-- {/* 右侧title图片 */} -->
        <div class="right-bg">
          <img src="../../assets/img/login.png" alt="背景图片" />
        </div>

        <!-- {/* 右侧登录名和密码 */} -->
        <div class="right-user-pass">
          <div class="user">
            <img src="../../assets/img/username.png" alt="登录名" />
            <input ref="account" type="text" placeholder="账号" />
          </div>
          <div class="pass">
            <img src="../../assets/img/password.png" alt="密码" placeholder="密码" />
            <input ref="pwd" type="password" placeholder="密码" />
          </div>
        </div>

        <!-- {/* 登录按钮 */} -->
        <div class="right-sign-in" @click="login">
          <div class="sign-in-btn">
            登录
          </div>
        </div>

        <!-- {/* footer */} -->
        <div class="right-footer">欢迎使用双维团采商城</div>
      </div>
      <!-- <div class="contentBox">
        <img src="../../assets/img/login.png" alt="">
        <div class="content">
          <p>欢迎使用双维团采商城</p>
          <div class="formBox">
            <input ref="account" type="text" placeholder="账号" />
            <input ref="pwd" type="password" placeholder="密码" />
            <button @click="login">登录</button>
          </div>
          <div class="brand">{{'由联拓数科提供技术支持Copyright © 2020 Liantuo. All Rights Reserved.'}}</div>
        </div>
      </div> -->
    </div>
    <!-- <div v-if="popupStatus" class="popup">账户或密码错误</div> -->
    <Hint ref="popup" />
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { getClientSize, setLocalItem } from '../../util/util';
  import { login, logins, purchaseOrderDetail, getWarehousingGoodsByDeliveryOrder, merchantInfoList, detailByCode } from '../../api/client';
  import Hint from '../../components/Hint';

  export default {
    name: 'ClientLogin',
    components: {
      Hint
    },
    computed: {
      width() {
        return getClientSize().width;
      },
      height() {
        return getClientSize().height;
      },
    },
    data() {
      return {
        curIndex: 0,
        popupStatus: false,
        operatorType: "",
      }
    },
    methods: {
      ...mapMutations({
        setClientCode: 'SET_CLIENT_CODE',
        setClientId: 'SET_CLIENT_ID',
        setClientName: 'SET_CLIENT_NAME',
        setPhone: 'SET_PHONE',
        setOperatorId: 'SET_OPERATOR_ID',
        setMerchantType: 'SET_MERCHANTYPE',
        setOperatorType: 'SET_OPERATOR_TYPE',
        //供应商code
        setSupplierCode: "SET_SUPPLIER_CODE",
        setMerchantId: "SET_MERCHANT_ID"
      }),
      //提示状态
      // getPopupStatus() {
      //   let that = this
      //   that.popupStatus = !that.popupStatus
      //   setTimeout(function () {
      //     that.popupStatus = !that.popupStatus
      //   }, 2000)
      // },
      login() {
        const account = this.$refs.account.value;
        const pwd = this.$refs.pwd.value;
        logins({ userName: account, passWord: pwd }).then(res => {
          console.log(res, "团采登录")
          let data = res.result
          if (res.code === "SUCCESS") {
            // this.setClientCode(data.merchantCode);
            this.setClientId(data.appId);
            this.setClientName(data.operatorName);
            this.setMerchantId(data.merchantId);
            this.setPhone(data.contactMobile)
            this.setOperatorId(data.operatorId)
            this.setOperatorType(data.operatorType)
            setLocalItem('role', data.role);
            this.operatorType = data.operatorType
            this.$router.push('/mall/show/goodsList/0/all');
            this.getDetailByCode(data.appId, data.merchantCode, data.operatorType)
            if (data.operatorType != 0) {
              console.log(data.firstAuditMerchantCodes)
              this.setClientCode(data.firstAuditMerchantCodes || data.secondAuditMerchantCodes);
            } else {
              this.setClientCode(data.merchantCode);
            }
          } else {
            // this.getPopupStatus()
            this.$refs.popup.timer(res.msg)
          }
        })
      },

      // 获取客户详情
      getDetailByCode(appId, merchantCode, operatorType) {
        detailByCode({ appId, merchantCode }).then(res => {
          console.log(res, "客户详情")
          if (res.code === "SUCCESS") {
            console.log(res.result.parentMerchantCode, res.result)
            if (operatorType == 0) {
              this.setSupplierCode(res.result.parentMerchantCode)
            } else {
              this.setSupplierCode(res.result.merchantCode)
            }

            this.setMerchantType(res.result.salesMan)
          }
        })
      },
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/css/var.less";

  .ClientLogin {
    /* background-color: @bgColor; */
    background-color: #F2F2F2;
    /* position: relative; */

    .login-wrap {
      width: 900px;
      height: 600px;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      position: fixed;
      margin: auto;
      background-color: #ffffff;
      box-shadow: 0 8px 22px 0 #DADADA;
      border-radius: 8px;
      display: flex;

      &>div {
        width: 50%;
      }


      .login-wrap-left {
        background-image: linear-gradient(48deg, invalid gradient);
        border-radius: 8px;
      }

      .login-wrap-right {
        padding: 30px 97.92px;

        .right-bg {
          text-align: center;
          padding-top: 93px;
          padding-bottom: 60px;

          &>img {
            width: 190px;
            height: 37px;
          }
        }

        .right-user-pass {
          &>div {
            width: 290px;
            border-bottom: 2px solid #C7C7C7;
            margin-bottom: 45px;

            &>img {
              width: 15.44px;
              height: 17.45px;
              margin-right: 14.28px;
              /* margin-bottom: 5px; */
            }

            &>input {
              outline: none;
              border: none;
              width: calc(100% - 29.72px);
              font-size: 18px;

              &:placeholder-shown {
                font-size: 18px;
                color: #666666;
              }
            }
          }
        }

        .right-sign-in {
          text-align: center;
          cursor: pointer;
          margin-bottom: 125px;

          .sign-in-btn {
            width: 290px;
            height: 50px;
            line-height: 50px;
            background: #AF7E49;
            border-radius: 4px;
            font-size: 18px;
            color: #FFFFFF;
          }
        }

        .right-footer {
          text-align: center;
          font-size: 14px;
          color: #333333;
        }
      }
    }

    /* .loginBox {
      position: absolute;
      width: 100%;
      height: 380px;
      background-color:#AF8C5C ;
      top: 50%;
      margin-top: -300px;

      .contentBox {
        position: absolute;
        margin-left: -475px;
        left: 50%;

        img {
          width: 380px;
          height: 380px;
          margin-right: 260px;
          opacity: 0.8;
          filter: alpha(opacity=80);
        }

        .content {
          margin-top: 10px;
          display: inline-block;
          background: #fff;
          width: 300px;
          vertical-align: top;
          text-align: center;
          overflow: hidden;

          p {
            color: #fff;
            font-size: 26px;
            font-weight:normal;
            padding: 30px 20px 20px;
            background:#AF8C5C ;
          }

          .tag {
            margin-top: 20px;
            color: @fontDefaultColor;
            margin-bottom: 20px;

            span {
              display: inline-block;
              width: 50px;
              text-align: center;
              margin: 0 10px;
              padding: 10px 0;
              cursor: pointer;
            }

            .selected {
              border-bottom: 2px solid @secondColor;
              color: @secondColor
            }
          }

          .formBox {
            padding-top: 30px;

            input {
              border-radius: 0;
              box-shadow: none;
              background: #fff;
              padding: 14px;
              width: 80%;
              border: 1px solid @borderColor;
              margin-bottom: 10px;
            }

            button {
              width: 80%;
              background:#AF8C5C ;
              box-shadow: none;
              border: 0;
              border-radius: 3px;
              line-height: 41px;
              color: #fff;
              cursor: pointer;
              margin-top: 10px;
              margin-bottom:20px;
            }
          }

          .brand {
            position:absolute;
            bottom:26px;
            left:490px;
            width:600px;
            color: #ccc;
            background: #AF8C5C ;
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
    } */
  }
</style>