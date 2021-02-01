<template>
    <li>
      <div @click="toggle" :class="liClass">{{model.menuName}}</div>
      <transition name="slide">
        <ul v-show="open">
          <items v-for="(item,index) in model.childTree" :model="item" :key="index"></items>
        </ul>
      </transition>
    </li>
  </template>
   
  <script>
    export default {
      name: "items",
      props:['model'],
      data() {
        return {
          open:false
        }
      },
      methods:{
        toggle() {
          this.open = !this.open
        }
      },
      computed:{
        liClass() {
          let _this = this;
          let option = `level_${this.model.level}`;
          let res = {};
          res[option] = true;
          return res;
        }
      }
    }
  </script>
   
  <style scoped lang="less">
    ul {
      list-style: none;
      text-align: left;
      .level_1 {
        /*border: 1px #ff0000 solid;*/
      }
      .level_2 {
        /*border: 1px #00ff00 solid;*/
        text-indent: 2em;
        /*background: #00ff00;*/
      }
      .level_3 {
        /*border: 1px #0000ff solid;*/
        text-indent: 4em;
        /*background: #0000ff;*/
      }
      .level_4 {
        /*border: 1px #ffff00 solid;*/
        text-indent: 6em;
        /*background: #ffff00;*/
      }
    }
    .slide-enter-active,.slide-leave-active {
      transition: all 0.2s;
    }
    .slide-enter,.slide-leave-to {
      transform: translateY(-20px);
    }
    .slide-enter-to,.slide-leave {
      transform: translateY(0px);
    }
  </style>