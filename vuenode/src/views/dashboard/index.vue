<template>
	<el-container>
		<el-row :gutter="12">
			<el-col :sm="6" :xs="12" class="mb12">
				<el-card shadow="hover"><i class="fa fa-pie-chart fa-lg"></i>挂靠车辆数</el-card>
			</el-col>
			<el-col :sm="6" :xs="12" class="mb12">
				<el-card shadow="hover">挂靠车主</el-card>
			</el-col>
			<el-col :sm="6" :xs="12" class="mb12">
				<el-card shadow="hover">信贷总人数</el-card>
			</el-col>
			<el-col :sm="6" :xs="12" class="mb12">
				<el-card shadow="hover">当前逾期数</el-card>
			</el-col>
			<el-col :span="24" class="mb12">
				<el-card shadow="hover">
					<div slot="header">
						<span><i class="fa fa-line-chart"></i>月度车辆销售信息</span>
					</div>
					<line-char :data="lineData"></line-char>
				</el-card>
			</el-col>
			<el-col :sm="12" :xs="24" class="mb12">
				<el-card shadow="hover">
					<div slot="header">
						<span><i class="fa fa-bar-chart"></i>月度车辆异动信息</span>
					</div>
					<bar-char :data="barData"></bar-char>
				</el-card>
			</el-col>
			<el-col :sm="12" :xs="24" class="mb12">
				<el-card shadow="hover">
					<div slot="header">
						<span><i class="fa fa-pie-chart"></i>月度信贷信息</span>
					</div>
					<pie-char :data="pieData"></pie-char>
				</el-card>
			</el-col>
		</el-row>
	</el-container>
</template>

<script>
import BarChar from './components/BarChar'
import LineChar from './components/LineChar'
import PieChar from './components/PieChar'

const CharDataList = {
	BarChar: {
		x: ['新增挂靠', '车辆转出'],
		y: [23, 48]
	},
	PieChar: {
		a: {
			x: ['新车车贷', '二手车', '个人消费贷'],
			y: [
				{ name: '新车车贷', value: 10 },
				{ name: '二手车', value: 25 },
				{ name: '个人消费贷', value: 30 }
			]
		},
		b: {
			x: ['逾期用户数', '正常还款人数'],
			y: [
				{ name: '逾期用户数', value: 5 },
				{ name: '正常还款人数', value: 45 }
			]
		}
	},
	LineChar: {

	}
}

export default {
	name: 'dashboard',
	components: {
		'bar-char': BarChar,
		'line-char': LineChar,
		'pie-char': PieChar
	},
	mounted() {
		console.info(this.barData)
	},
	data() {
		return {
			barData: CharDataList.BarChar,
			pieData: CharDataList.PieChar,
			lineData: {}
		}
	}
}
</script>

<style lang="scss" scoped>
	i.fa {
		margin-right: 5px;
	}
</style>