<template>
	<el-container class="view-form">
		<el-row>
			<el-col :span="24" class="mb20">
				<el-card shadow="hover">
					<div slot="header"><span>文件上传</span></div>
					<el-row>
						<el-upload
                            class="upload-demo"
                            ref="upload"
                            :action="this.UPLOAD_URL"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :file-list="fileList"
                            :auto-upload="false">
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
					</el-row>
				</el-card>
			</el-col>
		</el-row>
	</el-container>
</template>

<script>
export default {
	data() {
		return {
            headers: { 'Content-Type': 'multipart/form-data' },
            fileList: []
		}
	},
	mounted() {
	},
	created() {
	},
	methods: {
        submitUpload() {
            this.$refs.upload.submit()
        },
        handleRemove(file, fileList) {
            console.log(file, fileList)
        },
        handlePreview(file) {
            console.log(file)
        }
	}
}
</script>
