<template>
	<div class="login-body">
		<header class="login-header zh-logo"></header>
		<div class="login-container">
			<div class="login-form-title">
		        <span><!--{en}login--><!--{cn}-->登录<!--/{cn}--></span>
		    </div>
			<el-form class="login-form" autoComplete="off" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
				<!--<h3 class="title">新物流管车平台</h3>-->
				<el-form-item prop="username">
					<span class="svg-container svg-container_login">
			          	<svg-icon icon-class="user" />
			        </span>
					<el-input name="username" type="text" v-model="loginForm.username" autoComplete="off" placeholder="请输入您的账号" />
				</el-form-item>
				<el-form-item prop="password">
					<span class="svg-container">
			          	<svg-icon icon-class="password"></svg-icon>
			        </span>
					<el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="off" placeholder="请输入您的密码"></el-input>
					<span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
				</el-form-item>
				<el-form-item class="login-btn">
					<el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
				</el-form-item>
				<div class="tips">
		           <el-checkbox v-model="saveName" label="">记住账号</el-checkbox>
		           <el-checkbox v-model="savePwd" label="">记住密码</el-checkbox>
		      </div>
			</el-form>
		</div>
		<footer data-module="copyright">© 中寰卫星导航通信有限公司　京ICP备12043574号-1 增值电信业务许可证B2-20130141</footer>
	</div>
</template>

<script>
import { setCookie, getCookie, removeCookie } from '@/utils/auth'
export default {
	data() {
		return {
			loginForm: {
				username: 'admin',
				password: 'admin'
			},
			loginRules: {
				username: [{
					required: true,
					trigger: 'blur',
					message: '请输入用户名'
				}],
				password: [{
					required: true,
					trigger: 'blur',
					message: '请输入密码'
				}]
			},
			loading: false,
			pwdType: 'password',
			saveName: false,
      		savePwd: false
		}
	},
	mounted: function() {
	    this.loadLoginInfo()
    },
	methods: {
		showPwd() {
			if (this.pwdType === 'password') {
				this.pwdType = 'text'
			} else {
				this.pwdType = 'password'
			}
		},
		handleLogin() {
			this.$refs.loginForm.validate(valid => {
				if (valid) {
					this.loading = true
					this.$store.dispatch('Login', this.loginForm).then(() => {
						this.loading = false
		              	if (this.saveName) {
		                	setCookie('account', this.loginForm.username)
		              	} else {
		                	removeCookie('account')
		                }
		              	if (this.savePwd) {
		                	setCookie('pwd', this.loginForm.password)
		              	} else {
		                	removeCookie('pwd')
		                }
						this.$router.push({ path: '/' })
//						this.$router.push({ path: '/drive' })
					}).catch(() => {
						this.loading = false
					})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		loadLoginInfo() {
	      	const account = getCookie('account')
	      	const pwd = getCookie('pwd')
	      	if (Boolean(account) === true) {
		        this.loginForm.username = account
		        this.saveName = true
	      	}
	      	if (Boolean(pwd) === true) {
		        this.loginForm.password = pwd
		        this.savePwd = true
	      	}
	    }
	}
}
</script>

<style lang="scss">
$bg: #2DCA93;
$light_gray:#eee;

.login-body {
	position: fixed;
	height: 100%;
	width: 100%;
	background-color: $bg;
	
	.login-header.zh-logo {
		width: 100%;
		height: 18vh;
		min-height: 80px;
		background: url("../../assets/images/logo.png") center center no-repeat;
		background-size: auto 60%;
		margin: 10px auto;
	}
	
	footer {
		color: #FFF;
		font-size: 12px;
		text-align: center;
		width: 100%;
	}
	
	.login-container {
		width: 460px;
		height: auto;
		min-height: 350px;
		margin: 8vh auto;
		background: #FFFFFF;
		box-shadow: 0 4px 20px rgba(0, 0, 0, .3);
		opacity: 1;
		transition: opacity .2s;
		
		.login-form {
			position: absolute;
			left: 0;
			right: 0;
			width: 440px;
			padding: 40px 40px 15px 40px;
			margin: 0px auto;
			
		}
		.login-form-title {
			font-size: 18px;
			color: #848c8a;
			background: #d6ebe4;
		    display: inline-block;
		    width: 100%;
		    height: 50px;
		    line-height: 50px;
		    position: relative;
		    padding: 0 20px;
		}
		.el-input {
			display: inline-block;
			height: 35px;
			width: 85%;
			input {
				background: transparent;
				border: 0px;
				-webkit-appearance: none;
				border-radius: 0px;
				padding: 12px 5px 12px 0px;
				color: #919595;
				height: 35px;
				&:-webkit-autofill {
					-webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
					-webkit-text-fill-color: #fff !important;
				}
			}
		}
		.el-form-item {
			border-bottom: 1px solid #abaeae;
			/*border: 1px solid rgba(255, 255, 255, 0.1);
			background: rgba(0, 0, 0, 0.1);*/
			border-radius: 0px;
			color: #454545;
			margin-bottom: 30px;
			.el-form-item__content {
				line-height: 35px;
			}
		}
		.login-btn {
			border-bottom-width: 0px;
			margin-top: 25px;
			float: right;
			width: 80px;
			.el-form-item__content {
				button {
					border-radius: 2px;
					padding: 10px 20px;
					background: $bg;
					border-color: $bg;
				}
			}
		}
	}
}
$dark_gray:#889aa4;
.login-container {
	.tips {
		font-size: 14px;
		color: #fff;
		position: absolute;
		margin-top: 35px;
		margin-bottom: 10px;
		
		.el-checkbox+.el-checkbox {
			margin-left: 10px;
		}
		.el-checkbox__input.is-checked+.el-checkbox__label {
			color: $bg;
		}
		
		.el-checkbox__input {
			margin-right: 0px !important;
			
			&.is-checked {
				.el-checkbox__inner {
					background-color: $bg;
					border-color: $bg;
				}
			}
			&.is-focus {
				.el-checkbox__inner {
					border-color: $bg;
				}
			}
			.el-checkbox__inner {
				margin-right: 0px !important;
			}
		}
		
		.el-checkbox {			
			color: #c3c3c3 !important;
		}
		span {
			&:first-of-type {
				margin-right: 16px;
			}
		}
	}
	.svg-container {
		padding: 4px 5px 6px 0px;
		color: $dark_gray;
		vertical-align: middle;
		width: 30px;
		display: inline-block;
		&_login {
			font-size: 20px;
		}
	}
/*	.title {
		font-size: 26px;
		font-weight: 400;
		color: $light_gray;
		margin: 0px auto 40px auto;
		text-align: center;
		font-weight: bold;
	}*/
	.show-pwd {
		position: absolute;
		right: 10px;
		top: 7px;
		font-size: 16px;
		color: $dark_gray;
		cursor: pointer;
		user-select: none;
	}
}
</style>