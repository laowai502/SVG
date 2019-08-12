/**
 * @description 自定义表单校验方法 && 基于element-ui 封装的全局自定义校验规则
 * @author laowai
 */
export function checkIdNum(rule, value, callback) { //校验身份证
 	const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
 	if (!value) {
 		return callback(new Error('请输入身份证'))
 	} else if (!reg.test(value)) {
 		return callback(new Error('证件号码格式不正确'))
 	} else {
 		callback()
 	}
}
export function checkCreditCode(rule, value, callback) { // 统一社会信用代码格式校验  大写字母和数字
	const reg = /^[A-Z\d]+$/
	if (value && !reg.test(value)) {
		return callback(new Error('统一社会信用代码格式不正确'))
	} else {
		callback()
	}
}
export function checkString(rule, value, callback) { //校验非法字符
	const reg = /[@#\$%\^&\*\!~`'",:+=?\\]+/g
	if (reg.test(value)) {
		return callback(new Error('含有非法字符，请重新输入'))
	} else {
		callback()
	}
}
export function checkPhone(rule, value, callback) { //移动电话
	if (value && !(/^[1][3,4,5,7,8][0-9]{9}$/.test(value))) {
		return callback(new Error('请输入正确格式的移动电话号'))
	} else {
		callback()
	}
}
export function checkFixedPhone(rule, value, callback) { //校验固话
	if (value && !/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value)) {
		return callback(new Error('请输入正确格式固定电话'))
	} else {
		callback()
	}
}
export function checkNumber(rule, value, callback) { //校验非法数字
	const reg = /^[0-9]*$/
	if (value && !reg.test(value)) {
		return callback(new Error('请输入正确的数字'))
	} else {
		callback()
	}
}
export function checkInvoice(rule, value, callback) { //发票信息编号格式校验
	const reg = /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/
	if (value && !reg.test(value)) {
		return callback(new Error('发票信息编号格式不正确'))
	} else {
		callback()
	}
}

export default {
	//非法字符串校验
	illegalString: [{ required: false, validator: checkString, trigger: 'change' }],
	//非法数字校验
	illegalNumber: [{ required: false, validator: checkNumber, trigger: 'change' }],
	//必填身份证
  	idCard: [
  		{ required: true, validator: checkIdNum, trigger: 'change' },
  		{ min: 18, max: 18, message: '请输入18位身份证号', trigger: 'change' }
	],
	//必填发票信息编号格式校验
  	invoice: [{ required: false, validator: checkInvoice, trigger: 'change' }]
}
