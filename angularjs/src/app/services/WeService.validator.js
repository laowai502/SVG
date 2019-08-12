(function () {
    'use strict';
    angular
        .module('WeServices')
        .factory('FieldValidators', function () {
            var validators = {
                // 身份证校验
                id: {
                    regex: /^[A-Z0-9]{18}$/,//正则表达式
                    message: '身份证校验失败',// 错误提示
                    messageStuff: '校验失败'
                },
                // 车牌号
                carNumber: {
                    regex:/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z]{1}[a-zA-Z_0-9_\\u4e00-\\u9fa5]{5}$/,
                    message:'车牌号格式不正确'
                },
                // 16位数字或字母组合校验
                letterOrNumber16: {
                    regex: /^[a-zA-Z0-9]{1,16}$/,
                    message: '1-16位，支持字母、数字组合'
                },
                // 18位数字或字母组合校验
                any18: {
                    regex: /^.{1,18}$/,
                    message: '支持1-18位字符'
                },
                // 18位数字或字母组合校验
                letterOrNumber18: {
                    regex: /^[a-zA-Z0-9]{1,18}$/,
                    message: '1-18位，支持字母、数字组合'
                },
                // 36位字符
                letterOrNumber36: {
                    regex: /^(.{1,36})$/,
                    message: '1-36位字符组成'
                },
                // 36位字符
                letterOrNumber200: {
                    regex: /^(.{1,200})$/,
                    message: '1-200位字符'
                },
                // 联系人
                contact: {
                    regex: /^[a-zA-Z0-9\u4E00-\u9FA5]{1,16}$/,
                    message: '1-16位，支持汉字、字母、数字组合'
                },
                // 联系人电话
                contactTel: {
                    regex: /^[0-9-]{1,18}$/,
                    message: '1-18字符，由数字，横线组成'
                },         // 联系人电话
                contactTel36: {
                    regex: /^[0-9-,]{1,36}$/,
                    message: '1-36字符，由数字，横线组成'
                },
                // 通用密码校验
                password: {
                    regex: /^([a-zA-Z0-9\.\@\!\#\$\%\^\&\*\(\)\,\<\>\?\/\{\[\}\]\|\\\-\=\_\+]){6,20}$/i,
                    message: '密码长度6~20位，建议数字、字母、符号组合！'
                },
                // 11位手机号
                mobilePhone: {
	                // regex: /^[1][345789][0-9]{9}$/,   //新增19...的手机号码20171219
	                regex: /^[1][0-9]{10}$/,   //校验“1”开头的，11位数字。无需增加号段限制
                    message: '手机号码格式错误，请重新输入'
                },
                // 16位数字或字母组合校验，用户名
                userNameReg20: {
                    regex: /^[a-zA-Z0-9]{6,20}$/,
                    message: '6-20位大小写字母及数字，可组合'
                },
                //14位汉字数字字母组合校验
                userName14:{
                    regex: /^([a-zA-Z0-9]{1,14}|[\u4E00-\u9FA5]{1,7})$/,
                    message: '姓名格式不正确，请输入7个汉字或14个字符'
                },
                // 24位数字或字母组合校验
                letterOrNumber24: {
                    regex: /^[a-zA-Z0-9]{1,24}$/,
                    message: '1-24位，支持字母、数字组合'
                },
                // 52位汉字数字字母组合校验
                charLetterNumber52: {
                    regex: /^[a-zA-Z0-9\u4E00-\u9FA5]{1,52}$/,
                    message: '1-52位，支持汉字、字母、数字组合'
                },
                //邮箱校验
                email: {
                    regex: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
                    message: '邮箱格式不正确'
                },
                //汉字校验
                CnReg: {
                    regex:  /^[\u4e00-\u9fa5]+$/,
                    message: '只能输入汉字'
                },
                //数字(int/float)校验
                NumReg: {
                 // regex:  /^([^0]|(\d+\.))[\d]+$/,
                    regex:  /^(([^0]\d*)|(\d+\.\d+)|(0))$/,
                    message: '只能输入数字'
                },
                //图片验证码
                imgCode: {
                    regex: /^[a-zA-Z0-9]{4}$/,
                    message: '验证码格式不正确'
                },
                //短信验证码
                msgCode: {
                    regex: /^[0-9]{6}$/,
                    message: '验证码格式不正确'
                },
                //汉字字母数字组合
                CnEnNnReg: {
                    regex: /^[a-zA-Z0-9\u4E00-\u9FA5]+$/,
                    message: '请输入汉字，字母和数字组合'
                },
                //字母数字组合
                EnNnReg: {
                    regex: /^[a-zA-Z0-9]+$/,
                    message: '格式不正确'
                },
                //0-1000正整数
                Num1000: {
                    regex: /^(?:[0-9]|[1-9]\d|[1-9]\d{2}|1000)$/,
                    message: '请输入小于1000的正整数'
                },
                //保留一位小数正数,且小于100w
                NumFloat100w: {
                    regex:  /^(?:(?:[0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-9]\d{4}|[1-9]\d{5})(\.[0-9])?|1000000)$/,
                    message: '请输入小于100w且最多允许一位小数的正数'
                }
            };
            return {
                validators: validators
            };
        })
})();
