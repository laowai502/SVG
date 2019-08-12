<template>
	<div class="WeTreeMenu">
		<ul class="tree">
			<tree-item v-if='hasChildNodes' v-for='(item, index) in data' :layout='layout' :index='index' :key="index"
					:model='item' :renderContent='renderContent' :options='defaultOptions' :onlyKey='onlyKey'>
			</tree-item>
		</ul>
	</div>
</template>

<script>
import './Tree.scss'
import TreeItem from './TreeItem'

export default {
	components: {
		'tree-item': TreeItem
	},
	props: {
		data: {
			required: true,
			type: Array,
			default: []
		},
		options: {
			required: true,
			type: Object
		},
		onlyKey: {
			type: String,
			required: true
		},
		renderContent: Function
	},
	data() {
		return {
			layout: this,
			defaultOptions: {
				label: 'label',
				children: 'children',
				isUnfold: true,
				isCheckbox: true
			},
			checkedAarry: []
		}
	},
	create() {
		this.defaultOptions = Object.assign({}, this.defaultOptions, this.options)
	},
	methods: {
		getCheckedNodes() {
			this.checkedArray.splice(0, this.checkedArray.length)
			return this._getCheckedNodes(this.data)
		},
		_getCheckedNodes(treeModel) {
			const children = treeModel[this.defaultOptions.children] || treeModel
			if (treeModel.checkState !== 'unchecked') {
				if (children && children.length > 0) {
					children.forEach(function(item) {
						if (item.checkState === 'checked') {
							this.checkedArray.push(item)
						}
						this._getCheckedNodes(item)
					}.bind(this))
				}
			}
			return this.checkedArray
		},
		filter(value) {
			let _childNode
			if (this.$children && this.$children.length > 0) {
				this.$children.forEach(function(item) {
					if (item.$children && item.$children.length > 0) {
						_childNode = item
					}
				})
			}
			this.openUnfold(_childNode)
			this._filter(this.data, value)
		},
		_filter(treeModel, value) {
			const childNodes = treeModel[this.defaultOptions.children] || treeModel
			if (!this.isArray(treeModel)) {
				if (!treeModel.visible && childNodes.length) {
					let allHidden = true
					childNodes.forEach((child) => {
						if (child.visible) {
							allHidden = false
						}
					})
					treeModel.visible = allHidden === true
				}
			}
			if (!value) {
				return false
			}
		},
		isArray(arr) {
			return Object.prototype.toString.call(arr) === '[object Array]'
		},
		openUnfold(childNode) {
			var _childNodeList = childNode.$children
			if (_childNodeList && _childNodeList.length > 0) {
				childNode.options['isUnfold'] = true
				_childNodeList.forEach(function(item) {
					this.openUnfold(item)
				}.bind(this))
			}
		}
	},
	computed: {
		hasChildNodes() {
			return this.data && this.data.length > 0
		}
	}
}
</script>