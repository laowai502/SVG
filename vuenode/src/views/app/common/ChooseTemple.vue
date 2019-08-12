<template>
	<div class="set-template-main">
		<div class="set-template-area" v-for="(item, index) in setArr" :key="index">
			<div class="template-items" v-for="(e, i) in item.childs" :key="i">
				<el-button style="min-width: 90px;" type="primary" v-if="item.template != 'bar,line'">{{e.name}}</el-button>
				<el-dropdown v-else @command="_handleCommand">
					<el-button type="primary">{{e.name}}{{e.typeName}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
				  	<el-dropdown-menu slot="dropdown">
					    <el-dropdown-item  v-for="(it, itIndex) in dropDownArr" :key="itIndex" :command="_commandParam(it, e)">{{it.name}}</el-dropdown-item>
				  	</el-dropdown-menu>
				</el-dropdown>
			</div>
			<el-select class="template-select" v-model="item.template" placeholder="请选择" :style="{'marginTop': item.childs.length > 3 ? '-50px' : '0px'}">
			    <el-option v-for="item in template" :key="item.value" :label="item.name" :value="item.value" :disabled="item.disabled"></el-option>
			</el-select>
		</div>
	</div>
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
			setArr: [],
			template: [
				{
					name: '柱状图',
					value: 'bar'
				},
				{
					name: '折线图',
					value: 'line'
				},
				{
					name: '柱+折线',
					value: 'bar,line'
				},
				{
					name: '饼图',
					value: 'pie',
					disabled: true
				},
				{
					name: '饼图（多个）',
					value: 'morePie',
					disabled: true
				},
				{
					name: '散点图',
					value: 'shandian',
					disabled: true
				},
				{
					name: '热力图',
					value: 'hot',
					disabled: true
				}
			],
			dropDownArr: [
				{
					name: '柱',
					value: 'bar'
				},
				{
					name: '线',
					value: 'line'
				}
			]
		}
	},
	mounted() {
		this.setArr = [...this.dataItem]
	},
	methods: {
		_handleCommand(val) {
			val.row.type = val.command.value
			val.row.typeName = '（' + val.command.name + '）'
		},
		_commandParam(item, row) {
			return {
				command: item,
				row: row
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.set-template-main {
	width: 600px;
	max-height: 320px;
	overflow-y: hidden;
	margin: 15px 0px;
	padding-top: 10px;
	display: inline-block;
	position: relative;
	border: dashed 1px #ddd;
	.set-template-area {
	    width: 550px;
	    padding-top: 10px;
	    margin-bottom: 10px;
	    margin-left: 25px;
	    padding-left: 20px;
	    padding-right: 120px;
		border-bottom: dashed 1px #ddd;
		position: relative;
		&:last-child {
			border-bottom: none;
		}
		.template-items {
			display: inline-block;
			button {
				margin-right: 15px;
				margin-bottom: 15px;
			}
		}
	}
	.template-select {
		width: 100px;
		position: absolute;
		left: 440px;
	}
	&:hover {
    	overflow-y: auto;
    }
    &::-webkit-scrollbar {
    	width: 4px;
    }
    &::-webkit-scrollbar-thumb {
    	border-radius: 4px;
		-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0);
		background-color: #c3c3c3;
    }
}
</style>