<template>
	<el-container class="view-form">
		<el-row>
			<el-col :span="24" class="mb20">
				<el-card shadow="hover">
					<div slot="header"><span>中间层测试</span></div>
					<el-row>
						<el-col :span="24">
							<el-button type="primary" @click.stop="_testClick">测 试</el-button>
							<el-button type="primary" @click.stop="_testJSON">测 试 JSONFILE</el-button>
						</el-col>
						<el-col :span="24" class="mt20">
							<el-button type="primary" @click.stop="_testHttp">HTTP</el-button>
						</el-col>
						<el-col :span="24" class="mt20">
							<el-button type="primary" @click.stop="_testDB">DB_POST</el-button>
							<el-button type="primary" @click.stop="_testDB_GET">DB_GET</el-button>
						</el-col>
					</el-row>
				</el-card>
			</el-col>
		</el-row>
	</el-container>
</template>

<script>
import { getTestList, getTestJsonFile, getHttpData, getDataByDB, getDataByDB_GET } from '@/api/middleware/test'

export default {
	data() {
		return {
		}
	},
	mounted() {
	},
	created() {
	},
	methods: {
		_testClick() {
			getTestList().then(data => {
				console.log(data)
			}).catch(err => {
				console.log(err)
			})
		},
		_testJSON() {
			getTestJsonFile().then(data => {
				console.log(data)
			}).catch(err => {
				console.log(err)
			})
		},
		_testHttp() {
//			const param = {
//				engineType: -1,
//				carType: -1,
//				aakSalesStatus: -1,
//				stdSalesStatus: -1,
//				carStauts: 61,
//				token: 'd80aead8cad74c4dbbf5658872cc56f8'
//			}
			getHttpData().then(data => {
				console.log(data)
			}).catch(err => {
				console.log(err)
			})
		},
		_testDB() {
			getDataByDB({ field: 'name', value: 'lao' }).then(data => {
				console.log(data)
			}).catch(err => {
				console.log(err)
			})
		},
		_testDB_GET() {
			getDataByDB_GET({ field: 'name', value: 'lao' }).then(data => {
				console.log(data)
			}).catch(err => {
				console.log(err)
			})
		}
	}
}
</script>