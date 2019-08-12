import Vue from 'vue'
import store from '@/store'
import Moment from 'moment'

Vue.prototype.DATA_CYCLE = 'day' //统计时间周期，接口入参，组件导致这样定义

export default {
	data() {
		return {
			mx_childs: { //各个密集数据分类入参
//				vehicle: [
//					'mileage', 'fuel', 'work', 'idle', 'speed', 'temp',
//					'gas_open_percent', 'torque', 'rpm', 'iat', 'ip'
//				],
//				behavior: ['hsb', 'csb', 'clutch', 'fout', 'idle_bhv', 'ng'],
//				warning: ['so90', 'so120', 'sr', 'lrog']
				vehicle: ['vehicle'],
				behavior: ['behavior'],
				warning: ['warning']
			},
			mx_pickerOptions: { //通用日期范围配置
		        shortcuts: [
		        	{
			            text: '昨日',
			            onClick(picker) {
			              	picker.$emit('pick', [Moment().add('d', -1).toDate(), Moment().add('d', -1).toDate()])
			            }
			        }, {
			            text: '今日',
			            onClick(picker) {
			              	picker.$emit('pick', [Moment().toDate(), Moment().toDate()])
			            }
			        }, {
			            text: '上月',
			            onClick(picker) {
		            		const start = Moment().add('M', -1).startOf('M').toDate()
			              	const end = Moment().add('M', -1).endOf('M').toDate()
			              	Vue.prototype.DATA_CYCLE = 'month'
			              	picker.$emit('pick', [start, end])
			            }
			        }, {
			            text: '本月',
			            onClick(picker) {
			              	const end = Moment().toDate()
		              		const start = Moment().add('M', 0).startOf('M').toDate()
			              	Vue.prototype.DATA_CYCLE = 'month'
			              	picker.$emit('pick', [start, end])
			            }
			        }, {
			            text: '去年',
			            onClick(picker) {
			            	const start = Moment().add('Y', -1).startOf('Y').toDate()
			              	const end = Moment().add('Y', -1).endOf('Y').toDate()
			              	Vue.prototype.DATA_CYCLE = 'month'
			              	picker.$emit('pick', [start, end])
			            }
			        }, {
			            text: '今年',
			            onClick(picker) {
			              	Vue.prototype.DATA_CYCLE = 'month'
			              	picker.$emit('pick', [Moment().add('Y', 0).startOf('Y').toDate(), Moment().toDate()])
			            }
			        }, {
			            text: '最近七天',
			            onClick(picker) {
			              const end = new Date()
			              const start = new Date()
//			              Vue.prototype.DATA_CYCLE = 'day' //注意，因为每次查询完都把全局的DATA_CYCLE设置为day，所以日周期此处不赋值
			              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
			              picker.$emit('pick', [start, end])
			            }
			        }, {
			            text: '最近一个月',
			            onClick(picker) {
			              const end = new Date()
			              const start = new Date()
			              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
			              Vue.prototype.DATA_CYCLE = 'month'
			              picker.$emit('pick', [start, end])
			            }
			        }, {
			            text: '最近三个月',
			            onClick(picker) {
			              const end = new Date()
			              const start = new Date()
			              Vue.prototype.DATA_CYCLE = 'month'
			              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
			              picker.$emit('pick', [start, end])
			            }
			        }
	        	]
	        }
		}
	},
	methods: {
		/**
		 * @description 接口返回数据累加处理
		 * @param {Object} data 接口返回数据
		 * @param {String} type 密集数据分类，父分类
		 */
		_mx_saveVuexData(data, type) {
			const vuexData = {
				x: []
			}
			data.forEach(e => {
				if (this.DATA_CYCLE === 'day') {
					vuexData.x.push(e.day.substring(4))
				} else if (this.DATA_CYCLE === 'month') {
					var monthNum = e.day.substring(4).substring(0, 2) + '月'
					vuexData.x.push(monthNum.substring(0, 1) === '0' ? monthNum.replace('0', '') : monthNum)
				}
			})
			Vue.prototype.DATA_CYCLE = 'day' //统计周期重新初始化
			if (type.indexOf('vehicle') !== -1) {
				const vxData = Object.assign({}, vuexData, {
					mileage: {
						mileage: []
					},
					fuel: {
						fuel: []
					},
					work_duration: {
						work_duration: []
					},
					idle_duration: {
						idle_duration: []
					},
					speed: {
						avg_speed: []
					},
					temp: {
						avg_work_water: [],
						avg_idle_water_temp: []
					},
					gas_open_percent: {
						avg_gas_open_percent: []
					},
					torque: {
						avg_torque: []
					},
					rpm: {
						no_idle_avg_rpm: [],
						avg_rpm: []
					},
					iat: {
						avg_iat: []
					},
					ip: {
						avg_ip: []
					}
				})
				data.forEach(e => {
					vxData.mileage.mileage.push(e.mileage)
					vxData.fuel.fuel.push(e.fuel)
					vxData.work_duration.work_duration.push(e.work_duration)
					vxData.idle_duration.idle_duration.push(e.idle_duration)
					vxData.speed.avg_speed.push(e.avg_speed)
					//水温
					vxData.temp.avg_work_water.push(e.avg_work_water)
					vxData.temp.avg_idle_water_temp.push(e.avg_idle_water_temp)
					//油门开度
					vxData.gas_open_percent.avg_gas_open_percent.push(e.avg_gas_open_percent)
					//扭矩
					vxData.torque.avg_torque.push(e.avg_torque)
					//转速
					vxData.rpm.no_idle_avg_rpm.push(e.no_idle_avg_rpm)
					vxData.rpm.avg_rpm.push(e.avg_rpm)
					//进气温度
					vxData.iat.avg_iat.push(e.avg_iat)
					//进气压力
					vxData.ip.avg_ip.push(e.avg_ip)
				})
				store.dispatch('SetResData', vxData)
			}
			if (type.indexOf('behavior') !== -1) {
				const vxData = Object.assign({}, vuexData, {
					hsb: {
						hsb_times: [],
						hsb_duration: [],
						hsb_mileage: [],
						hsb_100km_times: [],
						hsb_duration_proportion: [],
						hsb_mileage_proportion: []
					},
					csb: {
						csb_times: [],
						csb_duration: [],
						csb_mileage: [],
						csb_100km_times: [],
						csb_duration_proportion: [],
						csb_mileage_proportion: []
					},
					clutch: {
						clutch_times: [],
						clutch_duration: [],
						clutch_mileage: [],
						clutch_100km_times: [],
						clutch_duration_proportion: [],
						clutch_mileage_proportion: []
					},
					fout: {
						fout_times: [],
						fout_duration: [],
						fout_100km_times: [],
						fout_duration_proportion: []
					},
					idle: {
						idle_times_bhv: [],
						idle_duration_bhv: [],
						idle_mileage_bhv: [],
						idle_100km_times: [],
						idle_duration_proportion: [],
						idle_mileage_proportion: []
					},
					ng: {
						ng_times: [],
						ng_duration: [],
						ng_mileage: [],
						ng_100km_times: [],
						ng_duration_proportion: [],
						ng_mileage_proportion: []
					}
				})
				data.forEach(e => {
					vxData.hsb.hsb_times.push(e.hsb_times)
					vxData.hsb.hsb_duration.push(e.hsb_duration)
					vxData.hsb.hsb_mileage.push(e.hsb_mileage)
					vxData.hsb.hsb_100km_times.push(e.hsb_100km_times)
//					vxData.hsb.hsb_duration_proportion.push(e.hsb_duration_proportion)
//					vxData.hsb.hsb_mileage_proportion.push(e.hsb_mileage_proportion)
					vxData.csb.csb_times.push(e.csb_times)
					vxData.csb.csb_duration.push(e.csb_duration)
					vxData.csb.csb_mileage.push(e.csb_mileage)
					vxData.csb.csb_100km_times.push(e.csb_100km_times)
//					vxData.csb.csb_duration_proportion.push(e.csb_duration_proportion)
//					vxData.csb.csb_mileage_proportion.push(e.csb_mileage_proportion)
					vxData.clutch.clutch_times.push(e.clutch_times)
					vxData.clutch.clutch_duration.push(e.clutch_duration)
					vxData.clutch.clutch_mileage.push(e.clutch_mileage)
					vxData.clutch.clutch_100km_times.push(e.clutch_100km_times)
//					vxData.clutch.clutch_duration_proportion.push(e.clutch_duration_proportion)
//					vxData.clutch.clutch_mileage_proportion.push(e.clutch_mileage_proportion)
					vxData.fout.fout_times.push(e.fout_times)
					vxData.fout.fout_duration.push(e.fout_duration)
					vxData.fout.fout_100km_times.push(e.fout_100km_times)
//					vxData.fout.fout_duration_proportion.push(e.fout_duration_proportion)
					vxData.idle.idle_times_bhv.push(e.idle_times_bhv)
					vxData.idle.idle_duration_bhv.push(e.idle_duration_bhv)
//					vxData.idle.idle_mileage_bhv.push(e.idle_mileage_bhv || 0) //速度为0，不统计怠速里程，确认需求删除
					vxData.idle.idle_100km_times.push(e.idle_100km_times)
//					vxData.idle_bhv.idle_duration_proportion.push(e.idle_duration_proportion)
//					vxData.idle_bhv.idle_mileage_proportion.push(e.idle_mileage_proportion) //确认需求删除
					vxData.ng.ng_times.push(e.ng_times)
					vxData.ng.ng_duration.push(e.ng_duration)
					vxData.ng.ng_mileage.push(e.ng_mileage)
					vxData.ng.ng_100km_times.push(e.ng_100km_times)
//					vxData.ng.ng_duration_proportion.push(e.ng_duration_proportion)
//					vxData.ng.ng_mileage_proportion.push(e.ng_mileage_proportion)
				})
				store.dispatch('SetBehaviorResData', vxData)
			}
			if (type.indexOf('warning') !== -1) {
				const vxData = Object.assign({}, vuexData, {
					so90: {
						so_90_times: [],
						so_90_duration: [],
						so_90_mileage: [],
						so_90_100km_times: [],
						so_90_duration_proportion: [],
						so_90_mileage_proportion: []
					},
					so120: {
						so_120_times: [],
						so_120_duration: [],
						so_120_mileage: [],
						so_120_100km_times: [],
						so_120_duration_proportion: [],
						so_120_mileage_proportion: []
					},
					sr: {
						sr_times: [],
						sr_duration: [],
						sr_mileage: [],
						sr_100km_times: [],
						sr_duration_proportion: [],
						sr_mileage_proportion: []
					},
					lrog: {
						lrog_times: [],
						lrog_duration: [],
						lrog_mileage: [],
						lrog_100km_times: [],
						lrog_duration_proportion: [],
						lrog_mileage_proportion: []
					}
				})
				data.forEach(e => {
					vxData.so90.so_90_times.push(e.so_90_times)
					vxData.so90.so_90_duration.push(e.so_90_duration)
					vxData.so90.so_90_mileage.push(e.so_90_mileage)
					vxData.so90.so_90_100km_times.push(e.so_90_100km_times)
//					vxData.so90.so_90_duration_proportion.push(e.so_90_duration_proportion)
//					vxData.so90.so_90_mileage_proportion.push(e.so_90_mileage_proportion)
					vxData.so120.so_120_times.push(e.so_120_times)
					vxData.so120.so_120_duration.push(e.so_120_duration)
					vxData.so120.so_120_mileage.push(e.so_120_mileage)
					vxData.so120.so_120_100km_times.push(e.so_120_100km_times)
//					vxData.so120.so_120_duration_proportion.push(e.so_120_duration_proportion)
//					vxData.so120.so_120_mileage_proportion.push(e.so_120_mileage_proportion)
					vxData.sr.sr_times.push(e.sr_times)
					vxData.sr.sr_duration.push(e.sr_duration)
					vxData.sr.sr_mileage.push(e.sr_mileage)
					vxData.sr.sr_100km_times.push(e.sr_100km_times)
//					vxData.sr.sr_duration_proportion.push(e.sr_duration_proportion)
//					vxData.sr.sr_mileage_proportion.push(e.sr_mileage_proportion)
					vxData.lrog.lrog_times.push(e.lrog_times)
					vxData.lrog.lrog_duration.push(e.lrog_duration)
					vxData.lrog.lrog_mileage.push(e.lrog_mileage)
					vxData.lrog.lrog_100km_times.push(e.lrog_100km_times)
//					vxData.lrog.lrog_duration_proportion.push(e.lrog_duration_proportion)
//					vxData.lrog.lrog_mileage_proportion.push(e.lrog_mileage_proportion)
				})
				store.dispatch('SetWarningResData', vxData)
			}
		}
	}
}
