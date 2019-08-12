<template>
	<el-container class="app-wrapper" :class="classObj" v-flexible>
		<el-header height="50px">
			<navbar></navbar>
		</el-header>
		<el-container>
			<div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
			<sidebar class="sidebar-container"></sidebar>
			<app-main class="main-container"></app-main>
		</el-container>
	</el-container>
</template>

<script>
import Vue from 'vue'
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

Vue.prototype.flexible = 'lg'

export default {
	name: 'layout',
	components: {
		Navbar,
		Sidebar,
		AppMain
	},
	mixins: [ResizeMixin],
	directives: {
		flexible(el) {
			const allWidth = document.body.clientWidth
			if (allWidth <= 1920 && allWidth > 1400) {
				Vue.prototype.flexible = 'lg'
			} else if (allWidth <= 1400 && allWidth > 1080) {
				Vue.prototype.flexible = 'md'
				el.className += ' laptop'
			} else {
				Vue.prototype.flexible = 'sm'
			}
		}
	},
	computed: {
		sidebar() {
			return this.$store.state.app.sidebar
		},
		device() {
			return this.$store.state.app.device
		},
		classObj() {
			return {
				hideSidebar: !this.sidebar.opened,
				withoutAnimation: this.sidebar.withoutAnimation,
				mobile: this.device === 'mobile'
			}
		}
	},
	methods: {
		handleClickOutside() {
			this.$store.dispatch('CloseSideBar', {
				withoutAnimation: false
			})
		}
	}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
	@include clearfix;
	position: relative;
	height: auto;
	width: 100%;
	min-height: 100%;
}
.drawer-bg {
	background: #000;
	opacity: 0.3;
	width: 100%;
	top: 0;
	height: 100%;
	position: absolute;
	z-index: 999;
}
.el-header {
	padding: 0;
	position: fixed;
	overflow: hidden;
	top: 0;
	right: 0;
	left: 240px;
	z-index: 1002;
	transition: left .2s;
}
.mobile {
	.el-header {
		z-index: 7;
	}
}
</style>