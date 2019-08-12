<template>
    <el-container class="im-container" style="height: 500px; border: 1px solid #eee">
        <el-aside class="im-aside" width="200px" style="background-color: rgb(238, 241, 246)">
            <p class="im-aside-header">群聊成员</p>
            <ul>
                <li v-for="(user, index) in userList" :key="index">{{user.username}}</li>
            </ul>
        </el-aside>
        <el-container class="im-body">
            <el-header style="text-align: right; font-size: 12px">
                <h3>{{userInfo.username}}</h3>
            </el-header>
            <el-main ref="chat">
                <ul>
                <li v-for="(item,index) in msgList" :key="index">
                    <template v-if="item.userInfo">
                        <p class="date">{{item.date}}</p>
                        <div class="user-info">
                            <div class="user-name" v-bind:class="[item.userInfo.userId == userInfo.userId ? 'right' : 'left']">{{item.userInfo.username}}</div>
                            <div class="msg" v-bind:class="[item.userInfo.userId == userInfo.userId ? 'right' : 'left']">{{item.msg}}</div>
                        </div>
                    </template>
                    <template v-else>
                        <p class="date">{{item}}</p>
                    </template>
                </li>
                </ul>
            </el-main>
            <el-footer>
                <el-row :gutter="20" type="flex" align="middle">
                <el-col :span="20">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="sendText"></el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click.native.prevent="send">发送</el-button>
                </el-col>
                </el-row>
            </el-footer>
        </el-container>
    </el-container>
</template>

<script>
    import { getUserInfo } from '@/api/chat'
    import { Message } from 'element-ui'
    import { mapState } from 'vuex'
    export default {
        data() {
            return {
                socket: null,
                sendText: '',
                msgList: [],
                userInfo: ''
            }
        },
        created: function() {
            if(this.$store.state.chat.socket) {
                getUserInfo(this.$store.state.chat.userId)
                .then(response => {
                    this.userInfo = response
                })
                .catch(error => {
					Message({ message: error, type: 'error' })
                })
            }else{
                this.$router.replace({ path: '/chat/login' })
            }
        },
        mounted: function() {
            if(this.$store.state.chat.socket) {
                this.$store.state.chat.socket.on('chat', user => {
                    this.msgList.push(user)
                    this.scroll()
                })
                this.$store.state.chat.socket.on('login', user => {
                    this.msgList.push(user.username + '上线了')
                })
                this.$store.state.chat.socket.on('logout', user => {
                    this.msgList.push(user.username + '离线了')
                })
                console.log(this.msgList)
            }
        },
        beforeDestroy: function() {
            //页面刷新暂时有问题
            console.log(this.userInfo)
            this.$store.dispatch('chatLogout', this.userInfo)
            .then(() => {
                console.log(this.$store.state.chat.socket)
            })
            .catch((err) => {
                console.log(err)
            })
        },
        computed: mapState({
            userList: state => state.chat.userList
        }),
        methods: {
            send() {
                if (this.sendText) {
                    const sendMsg = { msg: this.sendText, userInfo: this.userInfo, date: this.$moment().format('YYYY-MM-DD HH:mm:ss') }
                    this.$store.state.chat.socket.emit('chat', sendMsg)
                    this.msgList.push(sendMsg)
                    this.sendText = ''
                } else {
                    this.$message({
                        message: '请输入要发送的内容',
                        type: 'warning'
                    })
                }
            },
            scroll() {
                const me = this
                this.$nextTick(() => {
                    me.$refs.chat.$el.scrollTop = me.$refs.chat.$el.scrollHeight
                })
            }
        }
    }
</script>

<style lang="scss">
    .im-container{
        $border-color: #eee;
        $font-color: orange;
        .im-aside{
            .im-aside-header{
                margin-left: 10px;
            }
            ul{
                li{
                    list-style: none;
                    padding: 5px;
                }
            }
        }
        .im-body{
            border: 1px solid $border-color;
            .el-header{
                border-bottom: 1px solid $border-color;
                h3{
                    color: $font-color;
                }
            }
            .el-main{
                ul{
                    li{
                        list-style: none;
                        .date{
                            color: $font-color;
                            text-align: center;
                            font-size: 12px;
                        }
                        .user-info{
                            .user-name{
                                color: #999;
                                margin-bottom: 10px;
                            }
                            .msg{
                                width: 100%;
                                word-break: break-all;
                            }
                            .left{
                                text-align: left;
                            }
                            .right{
                                text-align: right;
                            }
                        }

                    }
                }
            }
        }
    }

</style>
