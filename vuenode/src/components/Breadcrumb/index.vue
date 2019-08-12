<template>
	<el-breadcrumb class="app-breadcrumb" separator="/">
		<transition-group name="breadcrumb">
			<el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if="item.meta.title">
				<span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{item.meta.title}}</span>
				<router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
			</el-breadcrumb-item>
		</transition-group>
	</el-breadcrumb>
</template>

<script>
	export default {
		created() {
			this.getBreadcrumb()
		},
		data() {
			return {
				levelList: null
			}
		},
		watch: {
			$route() {
				this.getBreadcrumb()
			}
		},
		methods: {
			getBreadcrumb() {
				let matched = this.$route.matched.filter(e => e.name)
				const first = matched[0]
				if (first && first.name === 'Dashboard') {
					matched = [{ path: '/dashboard', meta: { title: '首页' }}].concat(matched)
				} else {
					matched.forEach((e, i) => {
						if (e.meta.father_path && e.meta.father_title) {
							matched = matched.slice(0, i)
//								.concat([{ path: e.meta['grandPa_path'], meta: { title: e.meta['grandPa_title'] }}])
	            				.concat([{ path: e.meta.father_path, meta: { title: e.meta.father_title }}])
	            				.concat(matched.slice(i))
						}
					})
				}
				this.levelList = matched
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.app-breadcrumb.el-breadcrumb {
		display: inline-block;
		font-size: 14px;
		line-height: 50px;
		margin-left: 10px;
		.no-redirect {
			color: #97a8be;
			cursor: text;
		}
	}
</style>