/**
 * @description 基于权限中心进行迁移的所有接口
 * @author laowai
 */
import RequestService from '@/utils/request'

export const getDepartTree = () => RequestService.get('/admin/depart/tree')
