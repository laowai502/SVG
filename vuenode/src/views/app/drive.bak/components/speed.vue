<template>
	<pie-char :data="pieData"></pie-char>
</template>
<script>
import PieChar from '@/components/Chars/PieChar'
const CharDataList = {
	PieChar: {
		a: {
			x: ['0<=x<10KM/H', '0<=x<10KM/H', '0<=x<10KM/H'],
			y: [
				{ name: '0<=x<10KM/H', value: 10 },
				{ name: '10<=x<20KM/H', value: 25 },
				{ name: '20<=x<30KM/H', value: 30 }
			]
		},
		b: {
			x: ['0<=x<10KM/H', '0<=x<10KM/H', '0<=x<10KM/H'],
			y: [
				{ name: '0<=x<10KM/H', value: 10 },
				{ name: '10<=x<20KM/H', value: 25 },
				{ name: '20<=x<30KM/H', value: 30 }
			]
		}
	}
}

export default {
	components: {
		'pie-char': PieChar
	},
	data() {
		return {
			pieData: CharDataList.PieChar
		}
	},
	mounted() {
	},
	methods: {
	}
}
</script>

<style lang="scss" scoped>
.op-btn {
	padding: 8px 12px;
}
</style>