<template>
  <div class="Personal container">
    <ul class="titleList">
      <li v-if="operatorType == 0" :class="{selected:curPath==='/mall/personal/cart'}" @click="navTo('/mall/personal/cart')">购物车</li>
      <li :class="{selected:curPath==='/mall/personal/myOrder/0' || value}" @click="navTo('/mall/personal/myOrder/0')">我的订单</li>
      <!-- <li :class="{selected:curPath==='/mall/personal/myData'}" @click="navTo('/mall/personal/myData')">详细信息</li> -->
      <li v-if="operatorType == 0" :class="{selected:curPath==='/mall/personal/TakeSite'}" @click="navTo('/mall/personal/TakeSite')">地址管理</li>
      <li :class="{selected:curPath==='/mall/personal/myData'}" @click="navTo('/mall/personal/myData')">修改密码</li>
    </ul>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Personal',
  computed:{
    ...mapState([
      'clientId',
      'operatorType',
      'clientCode'
    ]),
  },
  data () {
    return {
      curPath:this.$route.path,
      value:""
    }
  },

  methods:{
    navTo(route){
      this.$router.push(route)
    },
  },

  mounted(){
    console.log(this.$router)
  },

  watch:{
    '$route'(to,from){
      console.log(to.path)
        this.curPath = to.path;
        this.value = this.$route.params.value
    }
  }
}
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.Personal{
  padding-top:80px;
  .titleList{
    width: 140px;
    background:#333;
    border:1px solid @borderColor;
    padding: 20px 0;
    display: inline-block;
    overflow: hidden;
    position:fixed;
    li{
      width: 100%;
      height: 40px;
      line-height:40px;
      padding-left: 30px;
      color:#fff;
      font-size: 15px;
      cursor: pointer;
      border-left: 2px solid transparent;
    }
    .selected{
      background:#AF7E49;
      border-left: 2px solid #b4a078;
      color:#fff;
    }
  }
  .content{
    width:1130px;
    margin-left:170px;
    overflow: hidden;
    display: inline-block;  
    vertical-align: top;
  }
}
</style>