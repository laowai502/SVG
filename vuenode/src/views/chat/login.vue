<template>
        <el-card class="box-card">
            <div slot="header" class="header">
                <span class="title">IM</span>
            </div>
            <div  class="login-body">
                <el-form class="login-form" autoComplete="off" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
                    <el-form-item prop="username">
                        <el-input
                            placeholder="账号"
                            prefix-icon="fa fa-user-o"
                            v-model="loginForm.username">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input
                            placeholder="密码"
                            prefix-icon="fa fa-lock"
                            show-password
                            v-model="loginForm.password">
                        </el-input>
                    </el-form-item>
                    <el-form-item class="login-btn">
                        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
                    </el-form-item>
                    <div class="tips">
                    <el-checkbox v-model="savePwd" label="">记住密码</el-checkbox>
                    <el-button type="text">注册账号</el-button>
                    <el-button type="text">找回密码</el-button>
                </div>
                </el-form>
            </div>
        </el-card>
</template>

<script>
import { setCookie, getCookie, removeCookie } from '@/utils/auth'
export default {
	data() {
		return {
			loginForm: {
				username: 'admin',
				password: '123456'
			},
			loginRules: {
				username: [{
					required: true,
					trigger: 'blur',
					message: '请输入账号'
				}],
				password: [{
					required: true,
					trigger: 'blur',
					message: '请输入密码'
				}]
			},
			loading: false,
      		savePwd: false
		}
	},
	mounted: function() {
	    this.loadLoginInfo()
    },
	methods: {
		handleLogin() {
			this.$refs.loginForm.validate(valid => {
				if (valid) {
					this.loading = true
					this.$store.dispatch('chatLogin', this.loginForm).then(() => {
						this.loading = false
		                setCookie('username', this.loginForm.username)
		              	if (this.savePwd) {
		                	setCookie('userkey', this.loginForm.password)
		              	} else {
                            removeCookie('userkey')
                        }
						this.$router.replace({ path: '/chat/im' })
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
	      	const username = getCookie('username')
	      	const userkey = getCookie('userkey')
	      	if (Boolean(username) === true) {
		        this.loginForm.username = username
	      	}
	      	if (Boolean(userkey) === true) {
		        this.loginForm.password = userkey
		        this.savePwd = true
	      	}
	    }
	}
}
</script>

<style lang="scss">
    .box-card{
        width: 480px;
        height: 480px;
        overflow: hidden;
        position: fixed;
        top: 50%;
        margin-top: -240px;
        left: 50%;
        margin-left: -240px;
        .el-card__header{
            padding: 0;
            height: 40%;
            .header{
                background: linear-gradient(to bottom right,red, blue);
                text-align: center;
                height: 100%;
                padding: 0 10px;
                .title{
                    font-size: 36px;
                    color: #fff;
                    font-weight: bold;
                    height: 100%;
                    display: inline-block;
                    transform: translate(0,80px);
                }
            }
        }
        .el-card__body{
            padding: 30px;
            .login-body{
                .tips{
                    label{
                        float: left;
                    }
                    button{
                        float: right;
                        margin-left: 10px;
                    }
                }
            }
        }
    }
</style>
