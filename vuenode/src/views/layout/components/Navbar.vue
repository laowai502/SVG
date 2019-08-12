<template>
	<el-menu class="navbar" mode="horizontal">
		<!--<span>新物流车管平台</span>-->
		<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
		<breadcrumb></breadcrumb>
		<ul class="header-right">
			<el-dropdown class="work-message" trigger="click">
				<el-badge is-dot class="item">
				  	<el-button class="share-button" icon="el-icon-bell" type="primary"></el-button>
				</el-badge>
				<el-dropdown-menu class="user-dropdown" slot="dropdown">
					<el-dropdown-item>待办事项</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
			<el-dropdown class="avatar-container" trigger="click">
				<div class="avatar-wrapper">
					<img class="user-avatar" :src="avatar">
				</div>
				<el-dropdown-menu class="user-dropdown" slot="dropdown">
					<el-dropdown-item>个人设置</el-dropdown-item>
					<el-dropdown-item divided>
						<!--<router-link to="/login"></router-link>-->
						<span @click="logout" style="display:block; text-align: center;">登出</span>
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</ul>
	</el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
	components: {
		Breadcrumb,
		Hamburger
	},
	computed: {
		...mapGetters([
			'sidebar',
			'avatar',
			'name'
		])
	},
	methods: {
		toggleSideBar() {
			this.$store.dispatch('ToggleSideBar')
		},
		logout() {
			this.$store.dispatch('LogOut').then(() => {
				this.$router.push({ path: '/login' }) //刷什么刷，为什么要刷你是服务端的吧，什么叫ue造吗
//				location.reload() // 为了重新实例化vue-router对象 避免bug
			})
		}
	},
	created() {
		console.info(this.name)
	}
}
</script>

<style lang="scss">
.header-right {
    position: absolute;
    right: 0;
    top: 0;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
	height: 50px;
	line-height: 50px;
	border-radius: 0px !important;
	z-index: 1002;
	.hamburger-container {
		line-height: 58px;
		height: 50px;
		float: left;
		padding: 0 5px 0 20px;
	}
	.screenfull {
		position: absolute;
		right: 90px;
		top: 16px;
		color: red;
	}
	.work-message {
		display: inline-block;
		position: absolute;
		right: 80px;
		height: 50px;
		.share-button {
			font-size: 18px;
			width: 35px;
			height: 100%;
			padding: 0 5px;
			position: absolute;
			top: 0px;
			right: 0px;
		}
		.item {
			height: 35px;
			margin-top: -3px;
		}
	}
	.avatar-container {
		height: 50px;
		display: inline-block;
		position: absolute;
		right: 25px;
		.avatar-wrapper {
			cursor: pointer;
			margin-top: 7px;
			position: relative;
			.user-avatar {
				width: 35px;
				height: 35px;
				border-radius: 4px;
			}
			.el-icon-caret-bottom {
				position: absolute;
				right: -20px;
				top: 25px;
				font-size: 12px;
			}
		}
	}
}
.mobile {
	.navbar {
		z-index: 0;
	}
}
</style>