<template>
	<el-dialog append-to-body title="开始" :visible.sync="showModal" width="860px" 
		:show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
		<el-card shadow="never">
			<el-col :span="24">
				<el-steps :active="step" class="self-step" align-center>
					<el-step description="请输入想要查询的终端"></el-step>
					<el-step description="选择想要查看的数据项"></el-step>
					<el-step description="选择查看的模板"></el-step>
				</el-steps>
				<div v-show="step==1" class="step-area">
					<div class="step-input">
						<el-input class="mb20" v-model="uid" placeholder="请输入终端ID"></el-input>
						<el-date-picker v-model="time" type="daterange" align="right" :editable="false"
					    	range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 300px;"
					    	value-format="yyyy-MM-dd" :picker-options="mx_pickerOptions">
					    	
					    </el-date-picker>
					</div>
				</div>
				<div v-if="step==2" class="step-area">
					<dense-data-item ref="denseDataItem" :data-item="dataItem"></dense-data-item>
				</div>
				<div v-if="step==3" class="step-area">
					<choose-temple ref="chooseTemple" :data-item="finalArr"></choose-temple>
				</div>
			</el-col>
		</el-card>
		<span slot="footer" class="dialog-footer">
			<el-button v-if="step>1" @click="_previous">上一步</el-button>
	    	<el-button v-if="step<3" @click.stop="_next">下一步</el-button>
	    	<el-button v-if="step==3" type="primary" @click.stop="_ok">完 成</el-button>
	  	</span>
	</el-dialog>
</template>

<script>
import CommonApi from '@/api/common'
import DenseDataItem from './DenseDataItem'
import ChooseTemple from './ChooseTemple'
import commonMixins from './mixins/commonMixins'
import { setSessionKey } from '@/utils/auth'
import { operateOption } from '@/views/app/constant/operate'
import { vehicleOption } from '@/views/app/constant/vehicle'
import { warningOption } from '@/views/app/constant/warning'

export default {
	components: {
		'dense-data-item': DenseDataItem,
		'choose-temple': ChooseTemple
	},
	mixins: [commonMixins],
	props: {
		showModal: {
			type: Boolean,
			default: false
		},
		dataType: String
	},
	data() {
		return {
			step: 1,
			uid: '',
			oldUid: '',
			time: null,
			oldTime: null,
			dataItem: null, //第二步组件入参
			finalArr: []
		}
	},
	mounted() {
		if (this.dataType === 'operate') {
			this.dataItem = [...operateOption]
		} else if (this.dataType === 'vehicle') {
			this.dataItem = [...vehicleOption]
		} else if (this.dataType === 'warning') {
			this.dataItem = [...warningOption]
		}
	},
	methods: {
		_next() {
			if (this.step === 1) {
				if (this.uid === '') {
					this.$message.warning('请输入您要查询的终端ID')
				} else if (this.time === null) {
					this.$message.warning('请选择查询日期')
				} else if ((this.uid !== '' && this.uid === this.oldUid) &&
					(this.time !== null && this.oldTime !== null &&
					 this.time[0] === this.oldTime[0] && this.time[1] === this.oldTime[1])) { //没有更改直接下一步
				 	this.step++
				} else { //查询接口
					this.$store.dispatch('SetQueryDate', this.time.join(' ~ '))
					this.$store.dispatch('SetVxUid', this.uid)
					const params = {
						uid: this.uid,
						start: this.time[0],
						end: this.time[1],
						parents: ['vehicle', 'behavior', 'warning'],
						cycle: this.DATA_CYCLE
					}
					this.$loading()
					CommonApi.getCarDataByParents(params).then(data => {
						this.$loading().close()
						if (data) {
							this._mx_saveVuexData(data, 'vehicle;behavior;warning')
							this.oldUid = this.uid
							this.oldTime = this.time
							this.step++
						}
					}).catch(e => {
						this.$loading().close()
					})
				}
			} else {
				this.$nextTick(() => { //省事，就这样写了，My heart is not guilty
					const arr = [...this.$refs['denseDataItem'].setArr]
					this.finalArr = arr.filter(e => e.childs.length > 0)
					if (this.finalArr.length > 0) {
						this.step++
					} else {
						this.$message.warning('请选择您要查看的数据项')
					}
				})
			}
		},
		_previous() {
			this.step--
		},
		_ok() {
			this.$nextTick(() => { //省事*2
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
					setSessionKey('THIS_WEB_TAB_FIRST_VISIT', 'y')
					this.$emit('closeguide', arr)
				} else {
					this.$message.warning('您有未设置的模板类型，请选择')
				}
			})
		},
		_rest() {
			this.inquired = false
			this.uid = this.oldUid = ''
			this.time = this.oldTime = null
		}
	},
	watch: {
		showModal(n) {
			if (n) {
				this._rest()
			}
		}
	}
}
</script>

<style lang="scss">
/*覆盖样式*/
.self-step {	
	.el-step__head.is-process {
		color: #c0c4cc !important;
		border-color: #c0c4cc !important;
	}
	.el-step__description.is-process {
		color: #c0c4cc !important;
		font-weight: 500;
	}
	.el-step__description {
		font-size: 13px;
		margin-top: 6px;
	}
}
</style>

<style lang="scss" scoped>
.step-area {
	min-height: 180px;
	display: flex;
	align-items: center;
	justify-content: center;
	.step-input {
		width: 300px;
	}
}
</style>