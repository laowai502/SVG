<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input @keyup.enter.native class="filter-item" style="width: 200px" placeholder="标题" v-model="listQuery.title"></el-input>
			<el-select @change='handleFilter' clearable class="filter-item" style="width: 90px;" placeholder="重要等级 " v-model="listQuery.importance">
				<el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"></el-option>
			</el-select>
			<el-select @change='handleFilter' clearable class="filter-item" style="width: 130px" placeholder="类型" v-model="listQuery.type">
				<el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
				</el-option>
			</el-select>
			<el-select @change='handleFilter' style="width: 140px" class="filter-item" v-model="listQuery.sort">
				<el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
				</el-option>
			</el-select>
			<el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查询</el-button>
			<el-button class="filter-item" type="primary" icon="el-icon-edit" style="margin-left: 10px;" @click="handleCreate">新增</el-button>
			<el-button class="filter-item" type="primary" v-waves :loading="downloadLoading" icon="el-icon-download" @click="handleDownload">导出</el-button>
			<el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showReviewer">审核人</el-checkbox>
		</div>

		<el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="加载中" border fit highlight-current-row style="width: 100%">
			<el-table-column align="center" label="序号" width='65px' fixed>
				<template slot-scope="scope">
					<span>{{scope.row.id}}</span>
				</template>
			</el-table-column>
			<el-table-column width="160px" align="center" label="时间" fixed>
				<template slot-scope="scope">
					<span>{{scope.row.timestamp}}</span>
				</template>
			</el-table-column>
			<el-table-column min-width="150px" label="标题" fixed>
				<template slot-scope="scope">
					<span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
					<el-tag>{{scope.row.type | typeFilter}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column width="110px" align="center" label="作者">
				<template slot-scope="scope">
					<span>{{scope.row.author}}</span>
				</template>
			</el-table-column>
			<el-table-column width="110px" v-if='showReviewer' align="center" label="审核人">
				<template slot-scope="scope">
					<span style='color:red;'>{{scope.row.reviewer}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" width="80px" label="重要等级">
				<template slot-scope="scope">
					<svg-icon v-for="n in +scope.row.importance" icon-class="star" class="meta-item__icon" :key="n"></svg-icon>
				</template>
			</el-table-column>
			<el-table-column align="center" label="阅读数量" width="95">
				<template slot-scope="scope">
					<span v-if="scope.row.pageviews" class="link-type" @click='handleFetchPv(scope.row.pageviews)'>{{scope.row.pageviews}}</span>
					<span v-else>0</span>
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="状态" width="100">
				<template slot-scope="scope">
					<el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width" fixed="right">
				<template slot-scope="scope">
					<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
					<el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">发布</el-button>
					<el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">草稿</el-button>
					<el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="pagination-container">
			<el-pagination background :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
		</div>

		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form :rules="rules" ref="dataForm" :model="temp" label-postion="left" label-width="70px" style="width: 400px; margin-left: 50px">
				<el-form-item label="类型" prop="type">
					<el-select class="filter-item" v-model="temp.type" placeholder="Please select">
						<el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="时间" prop="timestamp">
					<el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date"></el-date-picker>
				</el-form-item>
				<el-form-item label="标题" prop="title">
					<el-input v-model="temp.title"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-select class="filter-item" v-model="temp.status" placeholder="Please select">
						<el-option v-for="item in statusOptions" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="重要等级">
					<el-rate style="margin-top:8px;" v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max='3'></el-rate>
				</el-form-item>
				<el-form-item label="评级">
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="temp.remark">
					</el-input>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确认</el-button>
				<el-button v-else type="primary" @click="updateData">确认</el-button>
			</div>
		</el-dialog>

		<el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
			<el-table :data="pvData" border fit highlight-current-row style="width: 100%">
				<el-table-column prop="key" label="Channel"> </el-table-column>
				<el-table-column prop="pv" label="Pv"> </el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
		        <el-button type="primary" @click="dialogPvVisible = false">确认</el-button>
		      </span>
		</el-dialog>
	</div>
</template>

<script>
import { getList, getReadCount, add, update } from '@/api/test'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'test',
  directives: {
    waves
  },
  data() {
  	return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
//    console.info(this.listQuery)
      getList(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.timestamp = parseTime(this.temp.timestamp)
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'laowai'
          add(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
      	this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          update(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      getReadCount(pv).then(response => {
        this.pvData = response.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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