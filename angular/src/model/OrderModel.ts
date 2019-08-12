/**
 *  历史工单列表实体类
 */
export interface OrderModel{
    //服务站Id
    stationId: string;
    //车牌号或底盘号
    carId?: string;
    //第几页
    page_number?: number;
    //每页条数
    page_size?: number;
}

/**
 *  新建工单 --> 提交
 */
export interface SubmitNewOrder{
    //预约方式
    orderWay: string;
    //服务站ID
    serviceStationId: string;
    //服务站code
    stationCode: string;
    //服务站地址
    serviceStationAdd: string;
    //服务站名
    serviceStationName: string;
    //服务站经度
    serviceStationLon: string;
    //服务站纬度
    serviceStationLat: string;
    //服务站电话
    serviceStationTel?: string;
    //工单类型
    woType: number;
    //报修人
    repairName: string;
    //手机
    repairTel: string;
    //预约时间
    orderTime: string;
    //车辆位置
    repairAdd: string;
    //车辆经度
    repairLon: string;
    //车辆纬度
    repairLat: string;
    //报修地的行政编码
    areaCode?: string;
    //服务站类型大分类（车辆保养）
    serviceCarmaintainBtype?: number;
    //保养code
    matainCode: string;
    //保养名称
    matainName: string;
    //服务站类型大分类（车辆维修）
    serviceCarrepairBtype?: string;
    //维修code
    repairItemCode: string;
    //维修名称
    repairItemName: string;
    //故障描述
    userFeedback?: string;
    //图片地址
    fileUrls: string;
    //指派人员
    assignPersion?: string;
    //vin码
    vinCode: string;
}