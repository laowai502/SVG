<template>
	<el-container class="view-container">
		<el-row>
			<el-button type="primary" @click.native.prevent="dyncDom">动态添加组件</el-button>
			<el-button type="primary" @click.native.prevent="repeatDom">循环添加组件</el-button>
			<el-button type="primary" @click.native.prevent="removeDom">循环删除组件</el-button>
			<div id="MainArea" style="display: block; width: 100%; height: 300px;"></div>
			<div style="display: inline-block; width: 300px; height: 300px;" v-for="(item, index) in componentsArr">
				 <component :is="item"></component>
			</div>
		</el-row>
	</el-container>
</template>

<script>
import Vue from 'vue'
import BMap from './BMap'

export default {
	data() {
		return {
			componentsArr: []
		}
	},
	mounted() {
	},
	methods: {
		dyncDom() {
			const Profile = Vue.extend(BMap)
			const components = new Profile().$mount()
			document.getElementById('MainArea').appendChild(components.$el)
		},
		repeatDom() {
			this.componentsArr.push(BMap)
			console.info(this.componentsArr)
		},
		removeDom() {
			if (this.componentsArr.length > 0) {
				this.componentsArr.splice(0, 1)
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