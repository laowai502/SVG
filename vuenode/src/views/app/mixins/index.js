export default {
	data() {
		return {
			mx_showCharArr: [],	//展示的项
			mx_dragOverArr: [],
			mx_dragKey: null,
			mx_dropkey: null
		}
	},
	methods: {
		//drag-start
		_mx_handleDragStart(e, key) {
			this.mx_dragKey = key
		},
		// 首先把div变成可以放置的元素，即重写dragenter/dragover
		_mx_handleDragOver(e) {
			e.dataTransfer.dropEffect = 'move' // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
		},
		_mx_handleDragEnter(e, key) {
			if(this.mx_dragKey) {
				e.dataTransfer.effectAllowed = 'move' // 为需要移动的元素设置dragstart事件
				if(key === this.mx_dragKey) {
					return
				}
				this.mx_dropkey = key
			}
		},
		_mx_handleDragEnd(e) {
			this._mx_changeOrder()
			if(this.mx_dragOverArr.length > 0) {
				this.mx_showCharArr = this.mx_dragOverArr
			}
			this.mx_dragKey = null
			this.mx_dropkey = null
			this.mx_dragOverArr = []
		},
		_mx_changeOrder() {
			const newItems = [...this.mx_showCharArr]
			const src = newItems.findIndex(e => e.id === this.mx_dragKey)
			const dst = newItems.findIndex(e => e.id === this.mx_dropkey)
			newItems.splice(dst, 0, ...newItems.splice(src, 1))
			this.mx_dragOverArr = newItems
		}
		//drag-end
	}
}
