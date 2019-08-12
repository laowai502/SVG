<template>
	<el-col :span="24" class="anaysics-toolbar">
		<div class="toolbar-input">
			<el-input v-model="uid" placeholder="底盘号/车牌号/终端ID"></el-input>
		</div>
		<div class="icon-div" @click.stop="_openSetArea"><i class="fa fa-cogs"></i></div>
		<div v-if="dataType == 'vehicle'" class="icon-div"><i class="fa fa-undo"></i></div>
		<div :disabled="showTimePicker" class="icon-div" @click.stop="showTimePicker = true;time = initTime"><i class="fa fa-calendar-minus-o"></i></div>
		<div v-show="showTimePicker" class="icon-div noborder" @click.stop="showTimePicker = false"><i class="fa fa-close" style="font-size: 18px;"></i></div>
		<div class="toolbar-date" v-show="showTimePicker">
			<el-date-picker v-model="time" type="daterange" align="right" size="mini" :clearable="false" :editable="false"
		    	range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
		    	value-format="yyyy-MM-dd" :picker-options="mx_pickerOptions" >
		    </el-date-picker>
		    <i class="fa fa-search search-icon" @click.stop="_clickQuery"></i>
		</div>
		<guide-step-modal :data-type="dataType" :show-modal="showGuideModal" v-on:closeguide="_closeGuideModal"></guide-step-modal>
	</el-col>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSessionKey } from '@/utils/auth'
import CommonApi from '@/api/common'
import commonMixins from './mixins/commonMixins'
import GuideStepModal from '@/views/app/common/GuideStepModal'

export default {
	components: {
		'guide-step-modal': GuideStepModal
	},
	mixins: [commonMixins],
	props: {
		dataType: String
	},
	data() {
		return {
			uid: '',
			time: '',
			initTime: '',
			showTimePicker: false,
			showGuideModal: false
		}
	},
	created() {
		this.time = this.initTime = [this.$moment().subtract(6, 'days').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
		this.$store.dispatch('SetQueryDate', this.initTime.join(' ~ '))
	},
	mounted() {
		if (getSessionKey('THIS_WEB_TAB_FIRST_VISIT') !== 'y') {
			this.showGuideModal = true
		}
		if (this.vx_uid) {
			this.uid = this.vx_uid
		}
	},
	methods: {
		_closeGuideModal(data) {
			this.showGuideModal = false
			this.$emit('guidecomplete', data)
		},
		_openSetArea() {
			this.$emit('open')
		},
//		_reset() {
//			this.$store.dispatch('ResetAll')
//			this.$store.dispatch('SetQueryDate', this.initTime[0] + ' ~ ' + this.initTime[1])
//			if (this.dataType === 'vehicle') {
//				this.$store.dispatch('ClearDriveMergeDataCollection')
//			}
//		},
		_clickQuery() {
			this._queryData(this.time[0], this.time[1])
		},
		_queryData(sDate, eDate) {
			if (!this.uid || this.uid === '') {
//				this.$notify({ message: '请输入您要查询的终端ID', type: 'warning', duration: 2000 })
				this.$message.warning('请输入您要查询的终端ID')
	          	return
			}
			let childs = null
			switch (this.dataType) {
				case 'vehicle':
					childs = this.mx_childs['vehicle']
					break
				case 'behavior':
					childs = this.mx_childs['behavior']
					break
				case 'warning':
					childs = this.mx_childs['warning']
					break
				default:
					break
			}
			this.$store.dispatch('SetQueryDate', sDate + ' ~ ' + eDate)
			const params = {
				uid: this.uid,
				start: sDate,
				end: eDate,
				parents: childs,
//				type: this.dataType, //仅mock时使用，dev时注释掉
				cycle: this.DATA_CYCLE
			}
			this.$loading()
			CommonApi.getCarDataByParents(params).then(data => {
				this.$loading().close()
				if (data) {
					this.$store.dispatch('SetVxUid', this.uid)
					this._mx_saveVuexData(data, this.dataType)
				}
			}).catch(() => {
				this.$loading().close()
			})
		}
	},
	computed: {
		...mapGetters(['vx_uid'])
    },
    watch: {
        vx_uid(n) {
        	if (n) {
        		this.uid = n
        	}
        }
//      time(val, oldVal) {
//			if (oldVal !== '') { //日期输入框不会清空，所以用此判断是否是初始化状态
//				if(val && val !== '') {
//					this._queryData(val[0], val[1])
//				} else {
//					this._queryData(this.initTime[0], this.initTime[1])
//				}
//			}
//		}
    }
}
</script>
<style lang="scss">
	
</style>
<style lang="scss" scoped>
div[disabled] {
	pointer-events: none;
	background: #C3C3C3 !important;
	color: #969696 !important;
}

.noborder {
	border: none !important;
	background: none !important;
}

.search-icon {
	cursor: pointer;
	top: 15px;
    margin-left: 235px;
    position: absolute;
    color: #c0c4cc;	
    &:hover {
    	color: #559FF0;
    }
}
</style>