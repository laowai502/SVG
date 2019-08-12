<template>
	<el-dialog append-to-body title="提示" :visible.sync="dialogVisible" :before-close="_closeModal" width="30%">
	  	<el-col :span="24">
	  		<p class="pl10"> <span style="color: #409EFF;">{{tipText}}</span> 不具合并查看功能，左下角选项选中后下次操作将会改变排列顺序</p>
	  	</el-col>
	  	<span slot="footer" class="dialog-footer">
	  		<el-checkbox class="footer-checkbox" v-model="checked">下次不再提示</el-checkbox>
	    	<el-button @click.native="_closeModal">关 闭</el-button>
	  	</span>
	</el-dialog>
</template>

<script>
import { setLocKey } from '@/utils/auth'

export default {
	props: {
		tipText: String
	},
	data() {
		return {
			checked: false,
			dialogVisible: false
		}
	},
	methods: {
		_showModal() {
			this.dialogVisible = true
		},
		_closeModal() {
			if (this.checked) {
				setLocKey('SHOW_TIPS', 'Mortar')
			}
			this.dialogVisible = false
			this.checked = false
		}
	}
}
</script>

<style scoped>
.footer-checkbox {
    margin-left: 25px;
    position: absolute;
    left: 0px;
    bottom: 20px;
}
</style>