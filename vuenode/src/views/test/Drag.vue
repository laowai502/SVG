<template>
	<el-container class="view-container">
		<el-row>
			<div class="item" v-for="(item, index) in items" :key="index" draggable="true"
				@dragstart="handleDragStart($event, item)" 
				@dragover.prevent="handleDragOver($event, item)" 
				@dragenter="handleDragEnter($event, item)" 
				@dragend="handleDragEnd($event, item)">
				<p class="trans-btn">
					<span v-if="item.problemId">
			            <b class="id">
			                {{item.problemId}}
			            </b>
			              {{item.key}}
			          </span>
					<span v-else>
			              {{item.key}}
			       </span>
				</p>
			</div>
		</el-row>
	</el-container>
</template>

<script>
export default {
	props: {
		dataSource: {
			type: Array,
			default() {
				return [
					{ key: 1, problemId: 'war' },
					{ key: 2, problemId: 'car' }
				]
			}
		}
	},
	data() {
		return {
			items: [],
			newItems: [],
			dragging: null
		}
	},
	watch: {
		dataSource(val) {
			this.items = val
		},
		dragging(val) {
			if(this.dataSource.includes(val)) {
				this.dragging = val
			} else {
				this.dragging = null
			}
		}
	},
	mounted() {
		this.items = this.dataSource
	},
	methods: {
		handleDragStart(e, item) {
			console.info(item)
			this.dragging = item
		},
		handleDragEnd() {
			this.dragging = null
			this.items = this.newItems
		},
		// 首先把div变成可以放置的元素，即重写dragenter/dragover
		handleDragOver(e) {
			e.dataTransfer.dropEffect = 'move' // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
		},
		handleDragEnter(e, item) {
			if(this.dragging) {
				e.dataTransfer.effectAllowed = 'move' // 为需要移动的元素设置dragstart事件
				if(item === this.dragging) {
					return
				}
				const newItems = [...this.items]
				console.log(newItems)
				const src = newItems.indexOf(this.dragging)
				const dst = newItems.indexOf(item)
				newItems.splice(dst, 0, ...newItems.splice(src, 1))
				this.newItems = newItems
			}
		}
	}
}
</script>