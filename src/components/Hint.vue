<template>
    <div v-if="status" class="PopupWrapper" :style="{width:windowWidth+'px',height:windowHeight+'px',}"
        @click.stop="closePopup">
        <div class="Popup" @click.stop="()=>{}">
            <span>{{title}}</span>
        </div>
    </div>
</template>

<script>
    import { getClientSize } from '../util/util';
    export default {
        name: 'Hint',
        data() {
            return {
                windowWidth: getClientSize().width,
                windowHeight: getClientSize().height,
                title: "",
                status:false
            }
        },

        methods: {
            // 定时器
            timer(value) {
                let that = this
                that.title = value
                that.status = true
                setTimeout(function () {
                    that.status = false
                }, 2000)
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

        .Popup {
            height: 50px;
            max-width:240px;
            /* border-radius: 4px; */
            /* padding: 0 10px; */
            /* line-height: 50px; */
            text-align: center;
            color: #fff;
            font-size: 20px;
            /* background: rgba(0, 0, 0, 0.6); */
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;

            span{
                display: inline-block;
                padding: 0 10px;
                line-height: 50px;
                border-radius: 4px;
                background: rgba(0, 0, 0, 0.6);
            }
        }
    }
</style>