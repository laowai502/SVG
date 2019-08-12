'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
	NODE_ENV: '"development"',
	BASE_API: '"http://10.30.50.167:2018"',
	MIDDLE_API: '"http://127.0.0.1:3010/api/middleware/"',
    UPLOAD_URL: '"http://sy.aerozhonghuan.com/fsm/fsevice/uploadFile?account=www"',
    SOCKET_URL: '"http://127.0.0.1:3010"'
})
