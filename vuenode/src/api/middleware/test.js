/**
 * @description node中间层测试接口
 * @author laowai
 */
import RequestService from '@/utils/request'

const makeUrl = url => process.env.MIDDLE_API + url

export const getTestList = () => RequestService.get(makeUrl('getTestList'))
//测试koa-compress
export const getTestJsonFile = () => RequestService.get(makeUrl('getTestJsonFile'))
//测试操作数据库
export const getDataByDB = params => RequestService.post(makeUrl('getDataByDB'), params)

export const getDataByDB_GET = params => RequestService.get(makeUrl('getDataByDB_GET'), params)
//http
export const getHttpData = params => RequestService.get(makeUrl('getHttpData'), params)

export const getMuliteAPIs = () => RequestService.get(makeUrl('getMuliteAPIs'))

export const getDataFromSql = () => RequestService.get(makeUrl('getDataFromSql'))

export const updateDataFromSql = params => RequestService.post(makeUrl('updateDataFromSql'), params)

export const insertDataToSql = params => RequestService.post(makeUrl('insertDataToSql'), params)

export const deleteDataFromSql = params => RequestService.post(makeUrl('deleteDataFromSql'), params)
