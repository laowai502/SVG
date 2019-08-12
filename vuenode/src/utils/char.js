/**
 * 设置动态echart图的y轴
 * @param {String} param y轴名称+单位
 */
export function setYAxis(param, i) {
	let position = null
	let nameGap = 15
	let offset = 0
	if(i === 0) {
		position = 'left'
	} else {
		position = i % 2 === 0 ? 'left' : 'right'
	}
	if(i >= 2) {
		nameGap = Math.floor(i / 2) * 20 + 15
		offset = Math.floor(i / 2) * 30
	}
	return {
		name: param,
		position: position,
		offset: offset,
		type: 'value',
		splitLine: {
			lineStyle: {
				type: 'dashed'
			}
		},
		//		axisTick: {
		//			show: false
		//		},
		axisLine: {
			lineStyle: {
				color: '#999'
			}
		},
		axisLabel: {
			//			inside: true,
			fontSize: 12,
			color: '#999'
		},
		nameGap: nameGap
	}
}
/**
 * 根据类型动态设置图标系列
 * @param {String} name 名字
 * @param {String} key  对应vuex中的key
 * @param {String} type 图表类型
 * @param {Object} data 展示数据
 * @param {Number} index 索引 对应那个Y轴
 * @param {String} fatherKey 用于刷新数据时使用
 */
export function setSeries(name, key, type, data, index, fatherKey) {
	const bar = {
		key: key,
		fatherKey: fatherKey,
		name: name,
		type: type,
		data: data,
		yAxisIndex: index,
		barMaxWidth: 30
	}
	const line = {
		key: key,
		fatherKey: fatherKey,
		name: name,
		type: type,
		data: data,
		smooth: true,
		yAxisIndex: index,
		markLine: {
			silent: true,
			label: {
				position: 'end',
				formatter: '{c}'
			},
			data: [{
				type: 'average',
				name: '平均值',
				lineStyle: {
					width: 1
				}
			}]
		}
	}
	return type === 'line' ? line : bar
}
/**
 * 设置图表
 */
export function setCharOption(title, time) {
	return {
		title: {
			text: title + '统计',
			textStyle: {
				fontSize: '15'
			},
			subtext: time
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			top: 30,
			width: '50%',
			data: []
		},
		grid: {
			top: '100',
			left: '35',
			right: '35',
			bottom: '20',
			containLabel: true
		},
//	    toolbox: {
//	        feature: {
//	            saveAsImage: {}
//	        }
//	    },
		xAxis: {
			name: '日期',
			type: 'category',
			boundaryGap: true,
			data: [],
			axisTick: {
				alignWithLabel: true
			},
			axisLine: {
				lineStyle: {
					color: '#999'
				}
			},
			axisLabel: {
				fontSize: 12,
				color: '#999'
			},
			nameGap: 25,
			nameLocation: 'middle'
		}
	}
}