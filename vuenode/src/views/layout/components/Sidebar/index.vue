<template>
	<el-scrollbar wrapClass="scrollbar-wrapper">
		<div class="top-logo">
			<a class="zh-top-logo"></a>
		</div>
		<!--unique-opened-->
		<el-menu mode="vertical" :show-timeout="200" :default-active="$route.path" :collapse="isCollapse" 
			background-color="#35404F" text-color="#8492A6" active-text-color="#FFFFFF">
			<sidebar-item :routes="routes"></sidebar-item>
		</el-menu>
	</el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
	components: {
		SidebarItem
	},
	computed: {
		...mapGetters([
			'sidebar'
		]),
		routes() {
			return this.$router.options.routes
		},
		isCollapse() {
			return !this.sidebar.opened
		}
	}
}
</script>

<style lang="scss">
.top-logo {
	position: fixed;
	top: 0px;
	left: 0px;
	width: 240px;
	background: #35404F;
	transition: width .2s;
	height: 60px;
	.zh-top-logo {	
		width: 130px;
	    height: 55px;
	    background: url("../../../../assets/images/logo.png") 0px center no-repeat;
	    background-size: 110px auto;
	    display: inline-block;
	    transform: scale(0.85);
	    transition: transform .3s;
	}
}
</style>