<template>
	<div class="wh p20">
		<div class="il mr12">Props(String): {{ _name }}</div>
		<div class="il mr12">Data(String): {{ name }}</div>
		<div class="il mr12">Props(Object): {{ _childObj.money }}</div>
		<div class="il mr12">Data(Object): {{ childObj.money }}</div>
	</div>
</template>

<script>
export default {
	props: {
		_name: {
			type: String,
			required: true
		},
		_childObj: {
			type: Object
		}
	},
	data() {
		return {
			name: this._name,
			childObj: this._childObj
		}
	}
}
</script>

<style>
</style>