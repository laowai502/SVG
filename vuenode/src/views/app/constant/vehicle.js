export const vehicleOption = [
	{
		name: '里程',
		key: 'mileage',
		childs: [
			{
				name: '里程',
				key: 'mileage',
				fatherKey: 'mileage',
				unit: 'Km',
				cycle: 'DYM',
				type: null,
				typeName: null,
				yAxis: null
			}
		]
	},
	{
		name: '油耗',
		key: 'fuel',
		childs: [
			{
				name: '油耗',
				key: 'fuel',
				fatherKey: 'fuel',
				unit: 'L',
				cycle: 'DYM',
				type: null,
				typeName: null,
				yAxis: null
			}
		]
	},
	{
		name: '运行时长',
		key: 'work_duration',
		childs: [
			{
				name: '运行时长',
				key: 'work_duration',
				fatherKey: 'work_duration',
				unit: '秒',
				cycle: 'DYM',
				type: null,
				typeName: null,
				yAxis: null
			}
		]
	},
	{
		name: '怠速时长',
		key: 'idle_duration',
		childs: [
			{
				name: '怠速时长',
				key: 'idle_duration',
				fatherKey: 'idle_duration',
				unit: '秒',
				cycle: 'DYM',
				type: null,
				typeName: null,
				yAxis: null
			}
		]
	},
	{
		name: '车速',
		key: 'speed',
		childs: [
			{
				name: '平均车速',
				key: 'avg_speed',
				fatherKey: 'speed',
				unit: 'km/h',
				cycle: 'DYM',
				type: null,
				typeName: null,
				yAxis: null,
				series: null
			}
		]
	},
	{
		name: '水温',
		key: 'temp',
		childs: [
			{
				name: '平均运行水温',
				key: 'avg_work_water',
				fatherKey: 'temp',
				unit: '℃',
				cycle: 'DYM',
				type: null,
				typeName: null,
				yAxis: null,
				series: null
			},
			{
				name: '平均怠速水温',
				key: 'avg_idle_water_temp',
				fatherKey: 'temp',
				unit: 'km/h',
				cycle: 'DYM',
				type: null,
				typeName: null,
				yAxis: null,
				series: null
			}
		]
	},
	{
		name: '油门开度',
		key: 'gas_open_percent',
		childs: [
			{
				name: '平均油门开度',
				key: 'avg_gas_open_percent',
				fatherKey: 'gas_open_percent',
				unit: '%',
				cycle: 'DYM',
				type: null,
				typeName: null,
				yAxis: null,
				series: null
			}
		]
	},
	{
		name: '扭矩',
		key: 'torque',
		childs: [
			{
				name: '平均负荷',
				key: 'avg_torque',
				fatherKey: 'torque',
				unit: 'N·m',
				cycle: 'DYM',
				type: null,
				typeName: null,
				yAxis: null,
				series: null
			}
		]
	},
	{
		name: '转速',
		key: 'rpm',
		childs: [
			{
				name: '运行时平均转速',
				key: 'no_idle_avg_rpm',
				fatherKey: 'rpm',
				unit: 'r/min',
				cycle: 'DYM',
				type: null,
				typeName: null,
				yAxis: null,
				series: null
			},
			{
				name: '平均转速',
				key: 'avg_rpm',
				fatherKey: 'rpm',
				unit: 'r/min',
				cycle: 'DYM',
				type: null,
				typeName: null,
				yAxis: null,
				series: null
			}
		]
	},
	{
		name: '进气温度',
		key: 'iat',
		childs: [
			{
				name: '平均进气温度',
				key: 'avg_iat',
				fatherKey: 'iat',
				unit: '℃',
				cycle: 'DYM',
				type: null,
				typeName: null,
				yAxis: null,
				series: null
			}
		]
	},
	{
		name: '进气压力',
		key: 'ip',
		childs: [
			{
				name: '平均进气压力',
				key: 'avg_ip',
				fatherKey: 'ip',
				unit: '℃',
				cycle: 'DYM',
				type: null,
				typeName: null,
				yAxis: null,
				series: null
			}
		]
	}
]
