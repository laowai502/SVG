<template>
	<el-col :span="24">
		<el-col :span="12" class="p7">
			<el-radio-group class="set-cycle-group" v-model="statisticsCycle" @change="_changeCycle($event, statisticsCycle)">
				<el-radio :label="0">日</el-radio>
				<el-radio :label="1">周</el-radio>
				<el-radio :label="2">月</el-radio>
			</el-radio-group>
			<div class="set-tag-group">
				<div class="set-tag-item" v-for="item in infoSetOption" :key="item.name">
					<p title="拖动全部" style="cursor: move; margin: 0px; margin-top: 5px;" draggable="true" @dragstart="_dragStart($event, item.childs, 'parent')">{{ item.name }}</p>
					<div v-for="tag in item.childs" :key="tag.key" draggable="true" @dragstart="_dragStart($event, tag, 'childs')">
						<!-- el-tag 无法拖拽 -->
						<el-tag>{{tag.name}}</el-tag>
					</div>
				</div>
			</div>
		</el-col>
		<el-col :span="12">
			<div class="is-set-area">
				<div class="set-area" v-for="(item, index) in setArr" @dragover.prevent @drop="_drop($event, item.childs, index)">
					<el-tag v-for="(i, ci) in item.childs" :key="i.name" closable @close.stop="_removeSetTags($event, ci, item.childs)">{{i.name}}</el-tag>
					<i v-if="index == setArr.length-1" class="fa fa-plus" @click.stop="_addSetArr"></i>
					<i v-else class="fa fa-minus" @click.stop="_delSetArr($event, index)"></i>
				</div>
			</div>
		</el-col>
	</el-col>
</template>

<script>
	export default {
		props: {
			dataItem: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				statisticsCycle: 0,
				infoSetOption: [],
				dragItem: null,
				dragItemType: null,
				setArr: [{
					title: [],
					legend: [],
					yAxis: [],
					series: [],
					childs: [],
					template: null
				}]
			}
		},
		mounted() {
			this.infoSetOption = [...this.dataItem]
		},
		methods: {
			_changeCycle(event, val) {
				console.info(val)
			},
			_removeSetTags(event, ci, item) {
				item.splice(ci, 1)
			},
			_addSetArr() {
				this.setArr.push({
					title: [],
					legend: [],
					yAxis: [],
					series: [],
					childs: [],
					template: null
				})
			},
			_delSetArr(event, index) {
				this.setArr.splice(index, 1)
			},
			_dragStart(event, item, type) {
				this.dragItem = item
				this.dragItemType = type
			},
			_drop(event, item, index) {
				if(item.length === 6) {
					this.$message.warning('可配置选项最多不超过六项')
					return
				}
				let differenceSet = null
				if (this.dragItemType === 'parent') {
					const itemKey = new Set(item.map(e => e.key))
					differenceSet = [...this.dragItem].filter(e => !itemKey.has(e.key)) //求差集
					if (item.length + differenceSet.length > 6) {
						this.$message.warning('可配置选项最多不超过六项')
					} else {
						differenceSet.forEach(e => {
							item.push(e)
						})
					}
				} else {
					for(const e of item) {
						if(e.key === this.dragItem.key) {
							return
						}
					}
					item.push(this.dragItem)
				}
				this.dragItem = null
				this.dragItemType = null
			}
		},
        watch: {
            dataItem(val, oldVal) {
                this.infoSetOption = val
            }
        }
	}
</script>

<style lang="scss">
	.set-tag-group {
		padding: 0px 10px 5px;
		border: solid 1px #ddd;
		height: 320px;
		@media screen and (min-width: 800px) and (max-width: 1366px) and (max-height: 650px){
	        height: 260px;
	    }
		overflow-y: hidden;
		border-radius: 4px;
		div {
			display: inline-block;
			.el-tag {
				cursor: move;
				margin: 8px 0 8px 14px;
				min-width: 80px;
				text-align: center;
			}
		}
		.set-tag-item {
			width: 100%;
		}
		&:hover {
			overflow-y: auto;
		}
		&::-webkit-scrollbar {
			width: 4px;
		}
		&::-webkit-scrollbar-thumb {
			border-radius: 4px;
			-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
			background-color: #c3c3c3;
		}
	}

	.set-area {
		.el-tag {
			margin: 5px 10px 5px 0;
			min-width: 80px;
			text-align: center;
		}
	}
</style>

<style lang="scss" scoped>
	.set-cycle-group {
		display: flex;
		justify-content: center;
		padding: 10px;
		margin-bottom: 10px;
		width: 100%;
	}

	.is-set-area {
		padding: 0 15px 10px;
		border: solid 1px #ddd;
		height: 320px;
		@media screen and (min-width: 800px) and (max-width: 1366px) and (max-height: 650px){
	        height: 260px;
	    }
		margin-top: 52px;
		overflow-y: hidden;
		border-radius: 4px;
		.set-area {
			width: 90%;
			position: relative;
			min-height: 40px;
			margin: 18px 2% 0 0;
			padding: 3px 3px 3px 15px;
			border: solid 1px #ddd;
			border-radius: 4px;
		}
		i {
			cursor: pointer;
			top: 0px;
			left: 100%;
			margin-left: 15px;
			margin-top: 13px;
			position: absolute;
		}
		&:hover {
			overflow-y: auto;
		}
		&::-webkit-scrollbar {
			width: 4px;
		}
		&::-webkit-scrollbar-thumb {
			border-radius: 4px;
			-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
			background-color: #c3c3c3;
		}
	}

	.has-close {
		.fa-close {
			display: none;
		}
		&:hover {
			.fa-close {
				display: block;
				cursor: pointer;
				color: #32c3b8;
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
