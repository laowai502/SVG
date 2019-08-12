import Mileage from './components/mileage'
import Drive from './components/drive'
import Idling from './components/idling'
import Speed from './components/speed'
import Oil from './components/oil'
import Temp from './components/temp'
import GasOpenPercent from './components/gasOpenPercent'
import Torque from './components/torque'
import Rpm from './components/rpm'
import Iat from './components/iat'
import Ip from './components/ip'

export const DefaultSelect = [
	{
		name: '里程',
		value: Mileage,
		canDropMerge: true,
		mergeKey: 'mile-oil',
		disabled: false,
		delByDrag: false
	},
	{
		name: '油耗',
		value: Oil,
		canDropMerge: true,
		mergeKey: 'mile-oil',
		disabled: false,
		delByDrag: false
	},
	{
		name: '运行',
		value: Drive,
		canDropMerge: true,
		mergeKey: 'drive-idle',
		disabled: false,
		delByDrag: false
	},
	{
		name: '怠速',
		value: Idling,
		canDropMerge: true,
		mergeKey: 'drive-idle',
		disabled: false,
		delByDrag: false
	}
]

export const ComponentConfig = [
	{
		name: '里程',
		value: Mileage,
		canDropMerge: true,
		mergeKey: 'mile-oil',
		disabled: false,
		delByDrag: false
	},
	{
		name: '油耗',
		value: Oil,
		canDropMerge: true,
		mergeKey: 'mile-oil',
		disabled: false,
		delByDrag: false
	},
	{
		name: '运行',
		value: Drive,
		canDropMerge: true,
		mergeKey: 'drive-idle',
		disabled: false,
		delByDrag: false
	},
	{
		name: '怠速',
		value: Idling,
		canDropMerge: true,
		mergeKey: 'drive-idle',
		disabled: false,
		delByDrag: false
	},
	{
		name: '车速',
		value: Speed,
		canDropMerge: false,
		disabled: false
	},
	{
		name: '水温',
		value: Temp,
		canDropMerge: false,
		disabled: false
	},
	{
		name: '油门开度',
		value: GasOpenPercent,
		canDropMerge: false,
		disabled: false
	},
	{
		name: '扭矩',
		value: Torque,
		canDropMerge: false,
		disabled: false
	},
	{
		name: '转速',
		value: Rpm,
		canDropMerge: false,
		disabled: false
	},
	{
		name: '进气温度',
		value: Ip,
		canDropMerge: false,
		disabled: false
	},
	{
		name: '进气压力',
		value: Iat,
		canDropMerge: false,
		disabled: false
	}
]