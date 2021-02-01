<template>
  <div class="MyData">
    <!-- <div class="textContent">
      <span>原始密码：</span>
      <input type="password" placeholder="请输入" v-model="usedPws">
    </div> -->
    <div class="textContent">
      <span>修改的密码：</span>
      <input type="password" placeholder="请输入"  v-model="newPsw">
    </div>
    <div class="textContent">
      <span>请再次输入：</span>
      <input type="password" placeholder="请再次输入" v-model="twoNewPsw">
    </div>
    <div class="btn">
      <div @click="clear" class="clear">清空</div>
      <div  @click="updatePwd" class="affirm">确认</div>
    </div>

    <!-- <ul>
      <li>
        <span>名称：</span>
        <p>{{details.merchantName}}</p>
      </li>
      <li>
        <span>地址：</span>
        <p>{{details.address || '--'}}</p>
      </li>
      <li>
        <span>电话：</span>
        <p>{{details.contactMobile}}</p>
      </li>
      <li>
        <span>联系人</span>
        <p>{{details.contactName}}</p>
      </li>
    </ul> -->
    <Hint ref="popup" />
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { institutionDetail, detailByCode, resetPassword } from '../../api/client';
  import Hint from '../../components/Hint';

  export default {
    name: 'MyData',
    components: {
      Hint
    },
    computed: {
      ...mapState([
        'merchantId',
        'operatorId',
      ]),
    },
    data() {
      return {
        // id: '',
        // headimg: '',
        // email: '',
        // nickname: '',
        // recipient: '',
        // address: '',
        // phone: '',
        // popupShow: false,
        // oldPwd: '',
        // newPwd: '',
        // confirmPwd: '',
        // details: "",
        // statusArr: ["正常", "淘汰", "删除"],
        // merchantType: ["直营门店", "加盟门店", "供应商", "总仓", "中转仓"]
        // usedPws:'',
        newPsw: '',
        twoNewPsw: ''
      }
    },

    methods: {
      ...mapMutations({
        setClientCode: 'SET_CLIENT_CODE',
        clientLogout: 'CLIENT_LOGOUT'
      }),
      // getInstitutionDetail() {
      //   institutionDetail({
      //     appId: this.clientId,
      //     merchantCode: this.clientCode
      //   }).then(res => {
      //     console.log(res, "机构详情")
      //     if (res.code === "SUCCESS") {
      //       this.details = res.result
      //     } else {
      //       alert("加载失败")
      //     }
      //   })
      // },
      // updateUserData() {
      // },
      // closePopup() {
      //   this.popupShow = false;
      // },
      // showPopup() {
      //   this.popupShow = true;
      // },
      clear() {
        // this.usedPws = ""
        this.newPsw = ""
        this.twoNewPsw = ""
      },
      updatePwd() {
        let { usedPws, newPsw, twoNewPsw } = this
        console.log(usedPws, newPsw, twoNewPsw)
        if(newPsw == "" || twoNewPsw == "") return
        if (newPsw !== twoNewPsw) {
          alert('两次输入的密码不一致！');
          return;
        } else {
          resetPassword({
            merchantId: this.merchantId,
            operatorId: this.operatorId,
            password: newPsw
          }).then(res => {
            if (res.code == "SUCCESS") {
              // logout() {
                this.$refs.popup.timer("修改成功")
                this.clientLogout();
                this.$router.go();
              // },
            }
            console.log(res, "修改密码")
          })
        }
      }
    },

    mounted() {
      // this.getInstitutionDetail()
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/css/var.less";

  .MyData {
    margin-top:20px;
    /* text-align: center; */

    .textContent {
      margin-bottom: 10px;

      span {
        font-size: 14px;
        display: inline-block;
        width: 100px;
        text-align: right;
      }

      input{
        height: 30px;
        width:168px;
        border:1px solid #ccc;
        padding-left:10px;
      }

      ::-webkit-input-placeholder{
        color:#ccc;
        font-size: 14px;
      }
    }

    .btn {
      margin-top:30px;

      div {
        width:60px;
        height: 26px;
        font-size:12px;
        line-height:26px;
        text-align:center;
        display: inline-block;
        color:#fff;
      }

      .clear {
        background: #D8D8D8;
        margin-right: 30px;
        margin:0 20px 0 105px
      }

      .affirm {
        /* border: 1px solid rgb(118, 118, 118); */
        /* border-radius: 2px; */
        background: #AF7E49;
      }
    }

    /* ul {
      width: 100%;
      overflow: hidden;

      li {
        margin-bottom: 30px;

        span {
          display: inline-block;
          width: 100px;
          height: 20px;
          color: #ccc;
        }

        p {
          display: inline-block;
        }

        .long {}

        button {
          background-color: white;
          border: 1px solid @thirdColor;
          color: @thirdColor;
          width: 80px;
          height: 30px;
        }
      }
    }

    .saveBtn {
      background-color: @thirdColor;
      border: none;
      color: white;
      width: 110px;
      height: 35px;
      display: block;
      margin: 10px auto;
    }

    .popupContent {
      padding: 20px;

      input {
        display: block;
        border: none;
        border-bottom: 1px solid #313541;
        margin-bottom: 16px;
        font-size: 13px;
        padding: 5px;
        width: 200px;
      }

      button {
        background-color: #333333;
        border: none;
        color: white;
        width: 80px;
        height: 32px;
        display: block;
        margin: 20px auto 5px;
      }
    } */
  }
</style>