<template>
	<el-container class="anaysics-container">
		<el-row class="anaysics-toolbar-container" :gutter="20">
			<anaysics-toolbar data-type="vehicle" v-on:open="_openSetDialog" v-on:reset="_reset"></anaysics-toolbar>
			<el-col :span="12" :key="item.name" v-for="(item, index) in selOptDetails" style="height: 355px; margin-top: 10px;">
				<div :id="'CharArea' + index" class="char-area" draggable="true" @dragstart="_handleDragStart($event, item, index)" @dragover.prevent="_handleDragOver($event, item)"
					@dragenter.stop="_handleDragEnter($event, item, index)" @dragend.stop="_handleDragEnd($event)">					
					<component :is="item.value"></component>
				</div>
			</el-col>
		</el-row>
		<el-dialog title="请选择需要查看的选型" :visible.sync="dialogVisible" width="30%">
		  	<el-checkbox-group v-model="selectOptions" @change="_handleCheckedChange">
			    <el-checkbox v-for="(item, index) in setOption" :disabled="item.disabled" :label="item.value" :key="index">{{item.name}}</el-checkbox>
		  	</el-checkbox-group>
		  	<span slot="footer" class="dialog-footer">
		    	<el-button @click="dialogVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="_ok">确 定</el-button>
		  	</span>
		</el-dialog>
		<business-tips ref="busTips" :tip-text="tipText"></business-tips>
	</el-container>
</template>

<script>
import Oil from '../components/oil'
import Drive from '../components/drive'
import Idling from '../components/idling'
import Mileage from '../components/mileage'
import AnaysicsToolbar from '@/views/app/common/AnaysicsToolbar'
import BusinessTips from '../components/BusinessTips'
import { mapGetters } from 'vuex'
import { ComponentConfig, DefaultSelect } from '../constant'
import { isEdge } from '@/utils/dom'
import { getLocKey } from '@/utils/auth'

export default {
	components: {
		'anaysics-toolbar': AnaysicsToolbar,
		'business-tips': BusinessTips
	},
	data() {
		return {
			setOption: ComponentConfig,
			selOptDetails: [],
			selectOptions: [Mileage, Oil, Drive, Idling],	//此标识符只用来设置多选框选中状态
			dragOverArr: [],
			dragItem: null,
			dropItem: null,
			drapDom: null,
			dropDom: null, //因为拖拽的后续操作在同一在dragend里面执行，所以边缘检测需要用的dom元素用此变量保存
			dialogVisible: false,
			tipText: ''
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.selOptDetails = [...DefaultSelect]
		},
		_reset() {
			const arr = []
			this.setOption.forEach(e => { //Don't worry about the order
				e.disabled = false
				e.delByDrag = false
				for (const item of this.selectOptions) {
					if (item === e.value) {
						arr.push(e)
					}
				}
			})
			this.selOptDetails = [...arr]
		},
		_ok() {
			this.dialogVisible = false
			const arr = []
			this.setOption.forEach(e => { //Don't worry about the order
				for (const item of this.selectOptions) {
					if (item === e.value && !e.delByDrag) {
						arr.push(e)
					}
				}
			})
			this.selOptDetails = [...arr]
		},
		_handleCheckedChange(val) {
			this.selectOptions = val
		},
		_openSetDialog() {
			this.dialogVisible = true
		},
		//drag-start
		_handleDragStart(e, item, i) {
			this.dragItem = item
			this.dragDom = document.getElementById('CharArea' + i)
		},
		// 首先把div变成可以放置的元素，即重写dragenter/dragover
		_handleDragOver(e, item) {
			e.dataTransfer.dropEffect = 'move' // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
		},
		_handleDragEnter(e, item, i) {
			if(this.dragItem) {
				e.dataTransfer.effectAllowed = 'move' // 为需要移动的元素设置dragstart事件
				if(item === this.dragItem) {
					return
				}
				this.dropDom = document.getElementById('CharArea' + i)
				this.dropItem = item
			}
		},
		_handleDragEnd(e) {
			if (this.dropDom) {
				//实时证明dom结构写的不好的，用框架得，尽量别用layerX之类
				const flag = isEdge(this.dragDom, this.dropDom, e)
				if (flag) {
					this._changeOrder()
				} else {
					if ((this.dragItem.canDropMerge && this.dropItem.canDropMerge) &&
					(this.dragItem.mergeKey === this.dropItem.mergeKey)) {
						this._charMerge(this.dragItem, this.dropItem, this.dropItem.mergeKey)
					} else {
						if (getLocKey('SHOW_TIPS') === null) {
							this.tipText = this.dragItem.name + ' - ' + this.dropItem.name
							this.$nextTick(() => {
						    	this.$refs['busTips'].dialogVisible = true
						    })
						} else {
							this._changeOrder()
						}
					}
				}
			}
			if(this.dragOverArr.length > 0) {
				this.selOptDetails = this.dragOverArr
			}
			this.dragItem = null
			this.dropItem = null
			this.dragDom = null
			this.dropDom = null
			this.dragOverArr = []
		},
		_charMerge(drag, drop, mergeKey) {
			this.setOption.forEach(e => { //先禁用选项
				if (e.name === drag.name || e.name === drop.name) {
					e.disabled = true
					if (e.name === drag.name) {
						e.delByDrag = true
					}
				}
			})
			//合并时去掉dragItem
			const i = this.selOptDetails.findIndex(e => e.name === drag.name)
			this.selOptDetails.splice(i, 1)
			let storeFnName = ''
			switch (mergeKey) {	//case mergeKey
				case 'mile-oil':
					storeFnName = 'SetMileOile'
					break
				case 'drive-idle':
					storeFnName = 'SetDriveIdle'
					break
				default:
					break
			}
			if (this.storeFnName !== '') {
				this.$nextTick(() => { //解决bug
			    	this.$store.dispatch(storeFnName)
			    })
			}
		},
		_changeOrder() {
			const newItems = [...this.selOptDetails]
			const src = newItems.indexOf(this.dragItem)
			const dst = newItems.indexOf(this.dropItem)
			newItems.splice(dst, 0, ...newItems.splice(src, 1))
			this.dragOverArr = newItems
		}
		//drag-end
	},
	computed: {
		...mapGetters(['allReset'])
    },
    watch: {
        allReset(n) {
        	if (n > 0) {
        		this._reset()
        	}
        }
    }
}
</script>

<style lang="scss" scoped>
.op-btn {
	padding: 8px 12px;
}
</style>