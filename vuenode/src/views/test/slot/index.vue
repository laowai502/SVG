<template>
	<el-container class="view-form">
		<el-row>
			<child-component>来了，老弟</child-component>
			<el-button type="primary" @click="_click">click</el-button>
			<el-button type="primary" @click="_click_one">click_one</el-button>
			<p>testArr: <span v-for="e in testArr">{{e}}</span></p>
			<p>testCopyArr: <span v-for="e in testCopyArr">{{e}}</span></p>
		</el-row>
		<el-row>
			<el-col :span="24" class="mb20">
				<el-card shadow="hover">
					<div slot="header"><span>Object.defineProperty</span></div>
					<el-row>
						<el-col :span="24">
							<el-button type="primary" @click.stop="_click_define">define</el-button>
						</el-col>
					</el-row>
				</el-card>
			</el-col>
			<el-col :span="24" class="mb20">
				<el-card shadow="hover">
					<div slot="header"><span>$set</span></div>
					<el-row>
						<el-col :span="24">
							<el-button type="primary" @click="_click_OB">click_OB</el-button>
							<el-button type="primary" @click="_click_OB_ADD">click_OB_ADD</el-button>
							<el-button type="primary" @click="_click_OB_DELETE">click_OB_DELETE</el-button>
							<p><span>{{ ob.lick }}</span></p>
							<p><span>{{ obCopy.lick }}</span></p>
							<p><span>{{ ob.deep.value }}</span></p>
							<p><span>{{ ob.deep.num }}</span></p>
						</el-col>
					</el-row>
				</el-card>
			</el-col>
		</el-row>
	</el-container>
</template>

<script>
import ChildComponent from './child'

export default {
	components: {
		'child-component': ChildComponent
	},
	data() {
		return {
			text: 'Pather Panzer',
			testArr: ['大饼', '二姨', '柚子', '挨打'],
			testCopyArr: [],
			ob: {
				lick: 'abstract',
				link: 'going',
				deep: {
					value: 'deep'
				}
			},
			obCopy: {}
		}
	},
	mounted() {
	},
	created() {
	},
	methods: {
		_click() {
//			this.testArr[1] = '波瑞'
			this.testArr.length = 0
			console.log(this.testArr)
		},
		_click_one() {
//			const arr = [1, 2, 3, 4, 5]
//			this.arr = [123, 345, 567, 222]
//			console.log(this.testArr)
//			console.log(this.arr)
//			console.log(arr)
			const arrDEMO = this.testArr
//			const arrDEMO = this.testArr.slice()
//			const arrDEMO = [...this.testArr]
			this.testCopyArr = this.testArr
//			this.testCopyArr = this.testArr.slice()
			arrDEMO.push('太子')
//			this.testArr = ['山寨']
			console.info(arrDEMO)
//			this.testCopyArr.push('太子')
		},
		_click_OB() {
//			this.obCopy = this.ob
//			this.obCopy = JSON.parse(JSON.stringify(this.ob))
//			this.ob.lick = 'specific'
			this.ob.deep.value = 'noDeep'
//			this.ob.deep.num = 500
			this.$set(this.ob.deep, 'num', 500)
		},
		_click_OB_ADD() {
			const desc = Object.getOwnPropertyDescriptor(this.ob.deep, 'num')
			if (!desc) {
//				this.ob.deep.num = 500
				this.$set(this.ob.deep, 'num', 500)
			} else {
				++this.ob.deep.num
			}
		},
		_click_OB_DELETE() {
			const desc = Object.getOwnPropertyDescriptor(this.ob.deep, 'num')
			if (desc && desc.configurable) {
//				delete this.ob.num
				this.$delete(this.ob.deep, 'num')
			}
			console.info(desc)
		},
		_click_define() {
//			const obj = {
//				data: {
//					str: 'string'
//				}
//			}
//			Object.defineProperty(obj, 'str', {
//				get() {
//					return this.data['str']
//				},
//				set(val) {
//					console.log('值改变了', val)
//					this.data['str'] = val
//				}
//			})
//			obj.str = 'str'
//			console.info(obj)

//			const obj = {
//				data: 'str'
//			}
			const desc = Object.getOwnPropertyDescriptors(this)
			console.info(desc)
			console.info(this)
		}
	}
}
</script>