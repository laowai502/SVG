<template>
	<div class="app-container">
		<button @click="clickAdd">add</button>
		<el-table :data="list" border fit highlight-current-row style="width: 100%">
			<el-table-column align="center" label="序号" width='65px' fixed>
				<template slot-scope="scope">
					<span>{{scope.row.id}}</span>
				</template>
			</el-table-column>
			<el-table-column width="160px" align="center" label="时间" fixed>
				<template slot-scope="scope">
					<span>{{scope.row.time}}</span>
				</template>
			</el-table-column>
			<el-table-column width="110px" align="center" label="作者">
				<template slot-scope="scope">
					<div v-for="(item, index) in scope.row.item1">
						<span>{{item.name}}</span>
						<span>{{item.value}}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column width="110px" align="center" label="作者">
				<template slot-scope="scope">
					<div v-for="(item, index) in scope.row.item2">
						<span>{{item.name}}</span>
						<span>{{item.value}}</span>
					</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
export default {
	data() {
		return {
			list: [
				{
					id: 1,
					time: '2018-02-01',
					item1: [
						{ name: 'laowai', value: '100' },
						{ name: 'laoli', value: '99' }
					],
					item2: [
						{ name: 'laoxiang', value: '101' },
						{ name: 'laoding', value: '102' }
					]
				},
				{
					id: 2,
					time: '2018-02-01',
					item1: [
						{ name: 'laowai', value: '100' },
						{ name: 'laoli', value: '99' }
					],
					item2: [
						{ name: 'laoxiang', value: '101' },
						{ name: 'laoding', value: '102' }
					]
				}
			]
		}
	},
	created() {
	},
	methods: {
		clickAdd() {
			console.info(this.list)
			this.list[0].item1.push({ name: 'laowai2', value: '1001' })
			this.list[0].item2.push({ name: 'laowai3', value: '10021' })
		}
	}
}
</script>

<style scoped lang="scss">
	.app-container {
		padding: 20px;
		.components-container {
			margin: 30px 50px;
			position: relative;
		}
		.pagination-container {
			margin-top: 30px;
		}
		.text-center {
			text-align: center
		}
		.sub-navbar {
			height: 50px;
			line-height: 50px;
			position: relative;
			width: 100%;
			text-align: right;
			padding-right: 20px;
			transition: 600ms ease position;
			background: linear-gradient(90deg, rgba(32, 182, 249, 1) 0%, rgba(32, 182, 249, 1) 0%, rgba(33, 120, 241, 1) 100%, rgba(33, 120, 241, 1) 100%);
			.subtitle {
				font-size: 20px;
				color: #fff;
			}
			&.draft {
				background: #d0d0d0;
			}
			&.deleted {
				background: #d0d0d0;
			}
		}
		.link-type,
		.link-type:focus {
			color: #337ab7;
			cursor: pointer;
			&:hover {
				color: rgb(32, 160, 255);
			}
		}
		.filter-container {
			padding-bottom: 10px;
			.filter-item {
				display: inline-block;
				vertical-align: middle;
				margin-bottom: 10px;
			}
		}
		//refine vue-multiselect plugin
		.multiselect {
			line-height: 16px;
		}
		.multiselect--active {
			z-index: 1000 !important;
		}
	}
	
	.app-test {
		justify-content: center;
		.app-test-first {
			align-items: auto;
		}
	}
</style>