<template>
	<el-container class="view-form">
		<el-row>
			<el-col :span="24" class="mb20">
				<el-card shadow="hover">
					<div slot="header"><span>示例</span></div>
					<el-row>
						<el-col :span="24" class="mt20">
							<el-button type="primary" @click.stop="_testHttpMerge">HTTPMerge</el-button>
						</el-col>
					</el-row>
				</el-card>
			</el-col>
		</el-row>
	</el-container>
</template>

<script>
import { getMuliteAPIs } from '@/api/middleware/test'

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
		_testHttpMerge() {
			getMuliteAPIs().then(data => {
				console.log(data)
			}).catch(err => {
				console.log(err)
			})
		}
	}
}
</script>