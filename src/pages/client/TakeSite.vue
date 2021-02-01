<template>
    <div class="MyData">
        <!-- :class="specifications == -1?'pich':'size'" -->
        <ul :class="index == pichIndex?'pichSiteBox':'SiteBox'" v-for="(item,index) in sitelist"
            @dblclick="addSite(index)" @click="pickSite(index)">
            <li v-if="operatorType == 0" class="deleteImg" @click.stop="deleteSite(item.areaId)">
                <!-- <img class="deleteImg" src="../../assets/img/delete.png" alt=""> -->删除
            </li>
            <li>
                <span>联系人：</span>
                <p>{{item.contactName}}</p>
            </li>
            <li>
                <span>联系电话：</span>
                <p>{{item.contactMobile}}</p>
            </li>
            <li>
                <span>送货地址：</span>
                <p>{{item.address || "--"}}</p>
            </li>
        </ul>
        <div v-if="operatorType == 0" class="SiteBox addsite" @click="addSite('-1')"><span class="icon">+</span><span
                class="text">新增地址</span></div>
        <SitePswPopup v-if="showHide" @popupClose="addSite" @affirm="affirm" :title="title">
            <template #popupContent>
                <div class="takeSite">
                    <div class="textBox">
                        <span>联系人：</span>
                        <input type="text" v-model="name" placeholder="请输入联系人">
                    </div>
                    <div class="textBox">
                        <span>联系电话：</span>
                        <input type="number" v-model="phone" placeholder="请输入联系电话">
                    </div>
                    <div class="textBox">
                        <span>收货地址：</span>
                        <input type="text" v-model="site" placeholder="请输入地址">
                        <!-- <textarea class="textarea" rows="4" v-model="site" placeholder="请输入地址"></textarea> -->
                    </div>
                </div>
            </template>
        </SitePswPopup>
        <Hint ref="popup" />
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import SitePswPopup from '../../components/SitePswPopup';
    import Hint from '../../components/Hint';
    import { saveArea, deleteArea, listArea } from '../../api/client';

    export default {
        name: 'TakeSite',
        components: {
            SitePswPopup,
            Hint
        },
        computed: {
            ...mapState([
                'clientId',
                'clientCode',
                'operatorId',
                'operatorType',
            ]),

            type() {
                return this.$route.params.type;
            },
        },
        data() {
            return {
                list: [{}, {}, {}, {}, {}],
                title: '收货地址',
                showHide: false,
                name: "",
                phone: "",
                site: "",
                message: "添加成功",
                status: false,
                sitelist: "",
                pichIndex: 0,
                areaId: ""
            }
        },

        methods: {
            ...mapMutations({
                setClientCode: 'SET_CLIENT_CODE',
            }),
            updatePwd() {

            },

            //选择地址
            pickSite(index) {
                this.pichIndex = index
            },

            addSite(index) {
                if (!(this.operatorType == 0)) return
                this.showHide = !this.showHide
                // if (this.type === "cart" && index !== '-1') {
                //     let item = this.sitelist[index]
                //     this.$router.push({
                //         name: "Cart", params: {
                //             areaId: item.areaId,
                //             contactName: item.contactName,
                //             contactMobile: item.contactMobile,
                //             address: item.address
                //         }
                //     })
                //     // return
                // }
                if ((index === 0 || index) && index !== '-1') {
                    let item = this.sitelist[index]
                    this.areaId = item.areaId
                    this.name = item.contactName
                    this.phone = item.contactMobile
                    this.site = item.address
                    console.log("修改收货地址")
                } else if (index == '-1') {
                    this.areaId = ""
                    this.name = ""
                    this.phone = ""
                    this.site = ""
                }
            },

            // 删除收货地址
            deleteSite(areaId) {
                deleteArea({
                    appId: this.clientId,
                    merchantCode: this.clientCode,
                    operatorId: this.operatorId,
                    areaId
                }).then(res => {
                    console.log(res, "删除收货地址")
                    this.$refs.popup.timer(res.msg)
                    this.getListArea()
                })
            },
            affirm() {
                let { name, phone, site } = this
                if (!name || !phone || !site) {
                    console.log("请把信息填写完整")
                    this.$refs.popup.timer("请把信息填写完整")
                    return
                } else {
                    console.log("保存")
                    this.getSaveArea()
                }
            },

            // 获取收货地址列表
            getListArea() {
                listArea({
                    appId: this.clientId,
                    merchantCode: this.clientCode
                }).then(res => {
                    console.log(res, "收货地址列表")
                    if (res.code === "SUCCESS" && res.result.length) {
                        this.sitelist = res.result
                    }
                })
            },

            //新增和修改客户收货地址
            getSaveArea() {
                let { operatorId, clientId, clientCode, name, phone, site, areaId } = this
                let params = {
                    appId: clientId,
                    merchantCode: clientCode,
                    operatorId: operatorId,
                    address: site,
                    contactName: name,
                    contactMobile: phone,
                    areaId: areaId || ""
                }
                saveArea(params).then(res => {
                    if (res.code == 'SUCCESS') {
                        this.showHide = !this.showHide
                        this.name = ""
                        this.phone = ""
                        this.site = ""
                        this.getListArea()
                    }
                    this.$refs.popup.timer(res.msg)
                })
            }
        },
        mounted() {
            this.getListArea()
        },
    }
</script>

<style scoped lang="less">
    @import "../../assets/css/var.less";

    .MyData {
        .pichSiteBox {
            float: left;
            margin-right: 10px;
            margin-bottom: 10px;
            margin-bottom: 20px;
            width: 500px;
            min-height: 124px;
            padding: 14px 21px;
            overflow: hidden;
            color: #fff;
            cursor: pointer;
            background: #af7e49;
            position: relative;

            .deleteImg {
                width: 60px;
                height: 20px;
                position: absolute;
                right: -20px;
                top: 65px;
                /* color: #F66F51; */
            }

            li {
                line-height: 24px;
                font-size: 12px;

                span {
                    float: left;
                    width: 80px;
                    height: 20px;
                    text-align: right;
                }

                p {
                    /* width:px; */
                    /* float: right; */
                    float: left;
                    width:350px;
                    /* display: inline-block; */
                }
            }
        }

        .SiteBox {
            float: left;
            margin-right: 10px;
            margin-bottom: 20px;
            width: 500px;
            min-height: 124px;
            padding: 14px 21px;
            overflow: hidden;
            color: #fff;
            cursor: pointer;
            background: #fff;
            position: relative;

            .deleteImg {
                width: 60px;
                height: 20px;
                position: absolute;
                right: -20px;
                top: 65px;
                color: #F66F51;
            }

            li {
                line-height: 24px;
                font-size: 12px;
                color: #666666;
                vertical-align: middle;

                span {
                    /* display: inline-block; */
                    width: 80px;
                    height: 20px;
                    text-align: right;
                    float: left;
                }

                p {
                    /* width:400px; */
                    /* float: right; */
                    float: left;
                    width:350px;
                    /* display: inline-block; */
                }
            }
        }

        .addsite {
            color: #666666;
            text-align: center;
            line-height: 60px;
            font-size: 26px;
            cursor: pointer;

            span {
                font-size: 14px;
            }

            .icon {
                font-size: 26px;
                color: #ccc;
                position: relative;
                left: -6px;
                top: 3px;
            }
        }

        .takeSite {
            margin-left: 40px;
            margin-bottom: 30px;

            .textBox {
                margin-bottom: 16px;
                overflow: hidden;
                font-size: 16px;
                line-height: 40px;

                span {
                    display: inline-block;
                    width: 80px;
                    text-align: right;
                    float: left;
                    color: #333;
                }

                input {
                    height: 40px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    padding-left: 16px;
                }

                ::-webkit-input-placeholder {
                    color: #ccc;
                    font-size: 16px;
                }

                .textarea {
                    float: left;
                    border-radius: 2px;
                    border: 1px solid rgb(118, 118, 118);

                }
            }
        }
    }
</style>