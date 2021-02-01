<template>
    <ul v-show="classify" class="submenu">
        分类：
        <li v-for="(item,index) in classify " :key="'type'+item.categoryId"
            @click="selectTypes(item.categoryName,item.categoryId,item,index)"
            :class="{selected:judgeCurPath(item.categoryId)}">
            <p>{{item.categoryName || item}}</p>
        </li>
    </ul>
</template>

<script>
    export default {
        name: 'Classify',
        props: {
            classify: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                curIndex: 0
            }
        },
        computed: {
            curPath() {
                // console.log(this.$route.path);
                return this.$route.path;
            }
        },
        methods: {
            selectTypes(value, id, data, index) {
                this.classify.map(item => {
                    console.log(item)
                })
                console.log(id, data, index)
                console.log(data, "分类数据")
                if (data.children) {
                    this.curIndex = index;
                    this.$emit('selectType', value, id, data.children);
                } else {
                    this.curIndex = index;
                    this.$emit('selectType', value, id, data);

                }
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
        }
    }
</script>

<style scoped lang="less">
    @import "../assets/css/var.less";

    .submenu {
        width: 100%;
        height: 50px;
        font-size: 14px;
        line-height: 50px;
        background-color: white;
        border-top: 1px dotted @borderColor;
        border-bottom: 1px dotted @borderColor;

        li {
            display: inline-block;
            margin: 0 20px;
            cursor: pointer;
        }

        li:hover{
            p{
                color: #B0882f;
            }
        }

        .selected {
            color: #B0882f;
            /* border-bottom: 3px solid #ff6700; */
        }
    }
</style>