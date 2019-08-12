<template>
	<div>
		<blockquote class="explain-txt">show</blockquote>
		<!--<div style="position: relative; height: 28px; margin-bottom: 5px;">
			<input type="text" placeholder="search" v-model="filterText">
		</div>-->
		<we-tree ref="tree" :data="treeData" :options="treeOptions" onlyKey="shopId" @node-click="handleNodeClick"></we-tree>
		<!--<a href="javascript:void(0);" class="btn btn-success" @click="getInfo">获取选中项</a>-->
		<el-container class="view-form">
			<el-row>
				<el-col :span="24" class="mb20">
					<el-card shadow="hover">
						<div slot="header">
							<span>父子组件数据绑定</span>
						</div>
						<el-col :span="24">
							<input type="text" v-model="name">
							<input type="text" v-model="childObj.money">
							<son :_name="name" :_child-obj="childObj"></son>
						</el-col>
						<el-col :span="24" class="mt20">
							{{testObj.a}}
							<input type="text" v-model="testObj.a">
							<el-button type="primary" @click="_test">click</el-button>
						</el-col>
					</el-card>
				</el-col>
				<el-col :span="18">
					<tree-select v-model="value" :options="options"></tree-select>
					选择key值：{{value}}
				</el-col>
			</el-row>
		</el-container>
	</div>
</template>

<script>
import { getTreeData } from '@/api/test'
import Tree from '@/components/WeTree/Tree'
import Son from './Son'

export default {
	name: 'weTree',
	components: {
		'we-tree': Tree,
		'son': Son
	},
	data() {
		return {
			treeData: [],
			filterText: '',
			treeOptions: {
				label: 'label',
				children: 'children',
				isUnfold: false
			},
			name: 'aaa',
			childObj: {
				money: 10000,
				dollar: 300
			},
			value: null,
			options: [{
	          id: '1',
	          label: 'a',
	          children: [{
	            	id: '11',
	           		label: 'aa'
	          	}, {
	            	id: '12',
	            	label: 'ab'
	          	}]
	        }, {
	          	id: '2',
	          	label: 'b'
	        }, {
	          	id: '3',
	          	label: 'c'
	        }],
	        testObj: {}
		}
	},
	mounted() {
		getTreeData().then(res => {
			this.treeData = res.list
		})
	},
	created() {
		this.testObj.a = 111
		this._initTest()
//		this.$set(this.testObj, 'a')
	},
	methods: {
		handleNodeClick(model) {
			console.log(model)
		},
		getInfo() {
			console.log(this.$refs.tree.getCheckedNodes())
		},
		renderContent(h, { node, model }) {
			return (
				<div class={'tree-label'} style={{ display: 'inline-block' }}>
					<span>{model.label}</span>
					<span>
		              	<a onClick={() => this.remove(node, model)}>Delete</a>
		            </span>
		        </div>
			)
		},
		remove() {},
		_initTest() {
			this.testObj.a = 222
		},
		_test() {
			this.testObj.a = 333
		}
	},
	watch: {
		filterText(txt) {
			this.$ref.tree.filter(txt)
		}
	}
}

</script>

<style lang="scss" scoped="">

</style>