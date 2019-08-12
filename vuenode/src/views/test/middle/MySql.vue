<template>
  	<el-container class="view-form">
    	<el-row>
      		<el-col :span="24" class="mb20">
				<el-card shadow="hover">
					<div class="filter-container">
						<el-button
						class="filter-item"
						type="primary"
						icon="el-icon-edit"
						style="margin-left: 10px;"
						@click="handleCreate"
						>新建</el-button>
					</div>
					<el-table :data="tableData" style="width: 100%">
						<el-table-column label="司机" width="180">
							<template slot-scope="scope">
								<span v-show="currentRow !== scope.row">{{ scope.row.name }}</span>
								<el-input v-model="scope.row.name" v-show="currentRow === scope.row"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="城市" width="180">
							<template slot-scope="scope">
								<span v-show="currentRow !== scope.row">{{ scope.row.city }}</span>
								<el-input v-model="scope.row.city" v-show="currentRow === scope.row"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="车牌号" width="180">
							<template slot-scope="scope">
								<span v-show="currentRow !== scope.row">{{ scope.row.carNumber }}</span>
								<el-input v-model="scope.row.carNumber" v-show="currentRow === scope.row"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="联系方式" width="180">
							<template slot-scope="scope">
								<span v-show="currentRow !== scope.row">{{ scope.row.tel }}</span>
								<el-input v-model="scope.row.tel" v-show="currentRow === scope.row"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button size="mini" v-show="currentRow !== scope.row" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
								<el-button size="mini" v-show="currentRow === scope.row" @click="handleSave(scope.$index,scope.row)">保存</el-button>
								<el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
      		</el-col>
    	</el-row>
  	</el-container>
</template>
<script>
import { getDataFromSql, updateDataFromSql, insertDataToSql, deleteDataFromSql } from '@/api/middleware/test'

export default {
	directives: {
		focus(el) {
		    el.children[0].focus()
		}
	},
	data() {
		return {
            tableData: [],
            preLi: '',
            preIndex: '',
            currentRow: {}
		}
	},
	created() {
		this.handleGet()
	},
  	methods: {
		handleGet() {
			getDataFromSql()
			.then(data => {
				if (data) {
				    this.tableData = data
				}
			})
			.catch(err => {
				console.log(err)
			})
		},
		handleCreate() {
            //判断上一个是否被保存
            if(this.currentRow.new) { //新建
                this.$message({
                    message: '请保存填好的项再进行新建！！！',
                    type: 'warning'
                })
                return
            } else if(this.preLi) { //编辑
                this.tableData[this.preIndex] = JSON.parse(this.preLi)
            }
            this.preLi = ''
            this.currentRow = { new: true }
            this.tableData.push(this.currentRow)
		},
		handleEdit(index, row) {
            //判断上一个是否被保存
            if(this.currentRow.new) { //新建
                this.tableData.pop()
            } else if(this.preLi) { //编辑
                this.tableData[this.preIndex] = JSON.parse(this.preLi)
            }
            this.preLi = JSON.stringify(row)
            this.currentRow = row
            this.preIndex = index
		},
		handleSave(index, row) {
            const keys = Object.keys(row)
            const isAllRequire = keys.some(item => {
                return row[item] === ''
            })
            if(isAllRequire) {
                this.$message({
                    message: '请完整填写该项再进行保存！！！',
                    type: 'warning'
                })
                return
            }
            if(row.new) {
                insertDataToSql(row)
                .then(data => {
                    this.preLi = ''
                    this.currentRow = ''
                    this.handleGet()
                })
                .catch(err => {
                    console.log(err)
                })
            } else {
                updateDataFromSql(row)
                .then(data => {
                    this.preLi = ''
                    this.currentRow = ''
                    this.handleGet()
                })
                .catch(err => {
                    console.log(err)
                })
            }
		},
		handleDelete(id) {
            if(!id) {
                this.tableData.pop()
                this.preLi = ''
                this.currentRow = ''
                return
            }
            deleteDataFromSql({ id: id })
            .then(data => {
                this.preLi = ''
                this.currentRow = ''
                this.handleGet()
            })
            .catch(err => {
                console.log(err)
            })
		}
  	}
}
</script>
<style lang="scss" scoped>
.filter-container {
	.el-button {
		float: right;
	}
}
</style>
