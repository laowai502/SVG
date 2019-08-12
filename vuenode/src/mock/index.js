import Mock from 'mockjs'
import loginAPI from './login'
import testApi from './test'
import TreeApi from './tree'

Mock.setup({
  timeout: '100-500'
})

Mock.mock(/\/test\/tree/, 'post', TreeApi.getTreeDate)
Mock.mock(/\/test\/list/, 'post', testApi.getTestList)
Mock.mock(/\/test\/getById/, 'get', testApi.getById)
Mock.mock(/\/test\/getReadCount/, 'get', testApi.getPv)
Mock.mock(/\/test\/add/, 'post', testApi.createArticle)
Mock.mock(/\/test\/update/, 'post', testApi.updateArticle)

//接口模拟数据
Mock.mock(/\/single\/statisticschd/, 'post', testApi.localJson)
Mock.mock(/\/single\/statisticsparents/, 'post', testApi.localJson)

//登入相关
Mock.mock(/\/auth\/oauth\/token/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/auth\/oauth\/token/, 'delete', loginAPI.logout)
Mock.mock(/\/admin\/user\/front\/info/, 'get', loginAPI.getUserInfo)

export default Mock
