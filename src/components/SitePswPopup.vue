<template>
    <div class="PopupWrapper" :style="{width:windowWidth+'px',height:windowHeight+'px',}" @click.stop="closePopup">
        <div class="Popup" @click.stop="()=>{}">
            <div class="title">{{title}}</div>
            <slot name="popupContent"></slot>
            <div class="btn">
                <div class="cancelBtn" @click.stop="closePopup">取消</div>
                <div class="affirmBtn" @click.stop="onAffirm">确定</div>
            </div>
            <div  @click.stop="closePopup" class="icon">+</div>
        </div>
    </div>
</template>

<script>
    import { goodList, goodsDetails } from '../api/client';
    import { getClientSize } from '../util/util';
    import { mapState, mapMutations } from "vuex";
    export default {
        name: 'SitePswPopup',
        props: {
            title: {
                type: String,
                default: "",
            }
        },
        computed: {
            ...mapState([
                'clientId',
                'clientCode',
                'supplierCode'
            ]),
        },
        data() {
            return {
                windowWidth: getClientSize().width,
                windowHeight: getClientSize().height,
            }
        },
        mounted() {
        },
        methods: {
            ...mapMutations({
                setCart: "ADD_CART_LIST",
            }),
            closePopup() {
                this.$emit('popupClose');
            },
            onAffirm() {
                this.$emit('affirm');
            },

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
        background-color: rgba(0, 0, 0, 0.5);

        .Popup {
            width: 520px;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: 200px auto;
            background: #fff;
            border-radius: 6px;
            /* box-shadow: 0 0 10px @fontDeepColor; */
            position: relative;
            overflow: hidden;
            padding: 20px 0;

            .title {
                /* text-align: center; */
                font-size: 20px;
                font-weight: 900;
                margin-bottom: 20px;
                border-bottom: 1px solid #f2f2f2;
                text-indent: 20px;
                padding-bottom: 10px;
            }

            .icon {
                font-size: 30px;
                color: #ccc;
                transform: rotate(45deg);
                -ms-transform: rotate(45deg);
                /* IE 9 */
                -moz-transform: rotate(45deg);
                /* Firefox */
                -webkit-transform: rotate(45deg);
                /* Safari 和 Chrome */
                -o-transform: rotate(45deg);
                /* Opera */
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
            }

            .btn {
                text-align: right;

                div {
                    display: inline-block;
                    width: 80px;
                    height: 40px;
                    text-align: center;
                    line-height: 40px;
                    font-size: 16px;
                    color: #fff;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .cancelBtn {
                    margin-right: 20px;
                    background: #DBDBDB;
                }

                .affirmBtn {
                    margin-right: 40px;
                    border-radius: 2px;
                    background: #AF7E49;
                    color: #fff;
                }
            }
        }
    }
</style>