<template>
    <el-container class="anaysics-container">
        <el-row class="anaysics-toolbar-container" :gutter="20">
            <anaysics-toolbar :data-type="dataType" v-on:open="_openSetDialog" v-on:guidecomplete="_guideComplete"></anaysics-toolbar>
            <el-col :span="item.col" :key="item.id" v-for="(item, index) in mx_showCharArr" style="height: 355px; margin-top: 10px; padding: 0px 5px 0px 10px;">
                <div class="char-area has-close" draggable="true"
                     @dragstart="_mx_handleDragStart($event, item.id)" @dragover.prevent="_mx_handleDragOver($event)"
                     @dragenter.stop="_mx_handleDragEnter($event, item.id)" @dragend.stop="_mx_handleDragEnd($event)">
                    <org-char :option="item.option"></org-char>
                    <i class="char-icon fa fa-close" @click.stop="_closeChar($event, index)"></i>
                    <i class="char-icon fa ml-45" :class="item.col == 12 ? 'fa-expand' : 'fa-compress'" @click.stop="_changeWidth($event, item)"></i>
                </div>
            </el-col>
        </el-row>
        <el-dialog title="请选择需要查看的选型" :visible.sync="dialogVisible" width="860px" @close="_closed">
            <div v-if="ItemOrTemplate" class="step-area">
                <dense-data-item ref="denseDataItem" :data-item="infoSetOption"></dense-data-item>
            </div>
            <div v-else class="step-area">
                <choose-temple ref="chooseTemple" :data-item="finalArr"></choose-temple>
            </div>
            <span slot="footer" class="dialog-footer">
		    	<el-button @click="dialogVisible = false">取 消</el-button>
		    	<el-button v-if="ItemOrTemplate" type="primary" style="width: 100px" @click="_chooseTemple">选择模板</el-button>
		    	<div v-else style="display: inline-block; margin-left: 10px">
		    		<el-button @click.stop="ItemOrTemplate = true" style="width: 110px">选择数据项</el-button>
		    		<el-button type="primary" @click="_ok">完 成</el-button>
		    	</div>
		  	</span>
        </el-dialog>
    </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { setCharOption, setYAxis, setSeries } from '@/utils/char'
import { random32String } from '@/utils'
import Mixins from '@/views/app/mixins'
import OrgChar from '@/components/Chars/OrgChar'
import AnaysicsToolbar from '@/views/app/common/AnaysicsToolbar'
import DenseDataItem from '@/views/app/common/DenseDataItem'
import ChooseTemple from '@/views/app/common/ChooseTemple'

export default {
    components: {
        'dense-data-item': DenseDataItem,
        'choose-temple': ChooseTemple,
        'anaysics-toolbar': AnaysicsToolbar,
        'org-char': OrgChar
    },
    mixins: [Mixins],
    data() {
        return {
            dialogVisible: false,
            infoSetOption: [],	//可选的设置项
            finalArr: [], //中间过渡
            ItemOrTemplate: true, //true 选择密集数据项节点, false 选择模板阶段
            dataType: '',
            importType: '',
            optionType: '',
            vxData: '',
            type: ''
        }
    },
    created() {
        this._getRouterData()
    },
    mounted() {
        this._setInfoOption()
    },
    methods: {
        _openSetDialog() {
            this.dialogVisible = true
        },
        _setInfoOption() {
            import('@/views/app/constant/' + this.importType).then(res => {
                this.infoSetOption = [...res[this.optionType]]
            })
        },
        _getRouterData() {
            this.type = this.$route.meta.type
            if(this.type === 'vehicle') {
                this.dataType = 'vehicle'
                this.importType = 'vehicle'
                this.optionType = 'vehicleOption'
                this.vxData = 'resData'
            }else if(this.type === 'operate') {
                this.dataType = 'operate'
                this.importType = 'operate'
                this.optionType = 'operateOption'
                this.vxData = 'resBehavior'
            }else{
                this.dataType = 'warning'
                this.importType = 'warning'
                this.optionType = 'warningOption'
                this.vxData = 'resWarning'
            }
        },
        _chooseTemple() {
            this.$nextTick(() => {
                const arr = [...this.$refs['denseDataItem'].setArr]
                this.finalArr = arr.filter(e => e.childs.length > 0)
                if (this.finalArr.length > 0) {
                    this.ItemOrTemplate = false
                } else {
                    this.$message.warning('请选择您要查看的数据项')
                }
            })
        },
        _closed() {
            this.$nextTick(() => { //防止视觉效果bug
                this.finalArr = []
                this.ItemOrTemplate = true
            })
        },
        _ok() {
            this.$nextTick(() => {
                let haveNull = false
                const arr = [...this.$refs['chooseTemple'].setArr]
                arr.forEach((item, index) => { //设置类型并空
                    if (item.template === null) {
                        haveNull = true
                    } else if (item.template === 'bar,line') {
                        for (const e of item.childs) {
                            if (e.type === null) {
                                haveNull = true
                                break
                            }
                        }
                    } else {
                        item.childs.forEach(e => {
                            e.type = item.template
                        })
                    }
                })
                if (!haveNull) {
                    this._complete(arr)
                } else {
                    this.$message.warning('您有未设置的模板类型，请选择')
                }
            })
        },
        _guideComplete(data) { //初始化向导完成
            this._complete(data)
        },
        _complete(data) {
            if (this[this.vxData] === null) {
                this.$message.warning('请先输入终端ID，并查询')
                return
            }
            let key = null
            const prepareData = [] //过渡数据
            data.forEach((item, index, obj) => {
                item.childs.forEach((e, i) => { //留口直接塞数据
                    if(this.vxData === 'resBehavior') {
                        key = e.key.split('_')[0] //根据数据结构定义
                        e.series = setSeries(e.name, e.key, e.type, this[this.vxData][key][e.key], i)
                    }else{
                        e.series = setSeries(e.name, e.key, e.type, this[this.vxData][e.fatherKey][e.key], i, e.fatherKey)
                    }
                    e.yAxis = setYAxis(e.name + '(' + e.unit + ')', i)
                    obj[index]['yAxis'].push(e.yAxis)
                    obj[index]['series'].push(e.series)
                    obj[index]['title'].push(e.name)
                    obj[index]['legend'].push(e.name)
                })
                prepareData.push({
                    id: 'CharArea' + random32String(),
                    col: 12,
                    option: setCharOption(item.title.join('-'), this.$store.getters.allDate)
                })
            })
            data.forEach((item, index) => {
                prepareData[index].option['legend']['data'] = item.legend
                prepareData[index].option['yAxis'] = item.yAxis
                prepareData[index].option['series'] = item.series
                prepareData[index].option['xAxis']['data'] = this[this.vxData].x
                if (item.yAxis.length > 3) {
                    prepareData[index].option['grid']['top'] = '120'
                }
            })
            this.mx_showCharArr = this.mx_showCharArr.concat(prepareData)
            //关闭清空操作
            this.dialogVisible = false
        },
        _setData(data) {
            this.mx_showCharArr.forEach(e => {
                e.option.xAxis.data = data.x
                e.option.title.subtext = this.$store.getters.allDate
                e.option.series.forEach(item => {
                    item.data = data[item.fatherKey][item.key]
                })
            })
        },
        _closeChar(e, i) {
            this.mx_showCharArr.splice(i, 1)
        },
        _changeWidth(e, item) {
            item.col = item.col === 12 ? 24 : 12
            window.dispatchEvent(new Event('resize'))
        }
    },
    computed: {
        ...mapGetters(['resWarning', 'resBehavior', 'resData'])
    },
    watch: {
        resWarning: {
            handler(n, o) {
                if (n && o) {
                    this._setData(n)
                }
            },
            deep: true
        },
        resBehavior: {
            handler(n, o) {
                if (n && o) {
                    this._setData(n)
                }
            },
            deep: true
        },
        resData: {
            handler(n, o) {
                if (n && o) {
                    this._setData(n)
                }
            },
            deep: true
        },
        // 如果路由有变化刷新数据
        '$route': function(newVal, oldVal) {
            if(newVal !== oldVal) {
                this.mx_showCharArr = []
                this.infoSetOption = []
                this._getRouterData()
                this._setInfoOption()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.step-area {
    min-height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.has-close {
    .char-icon {
        display: none;
    }
    &:hover {
        .char-icon {
            display: block;
            cursor: pointer;
            color: #99A9BF;
            position: absolute;
            left: 100%;
            top: 0;
            margin-left: -20px;
            margin-top: 4px;
            &:hover {
                opacity: .5;
            }
        }
    }
}
</style>