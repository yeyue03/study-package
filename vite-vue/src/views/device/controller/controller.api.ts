// import { defHttp } from '/@/utils/http/axios';
import defHttp from '@/request/http';

enum Api {
  deviceList = '/device/myList',
  deviceEdit = '/device/edit',
  planDetal = '/plan/getByDeviceId',
  planAdd = '/plan/add',
  planDataAdd = '/planData/add',
  planDisable = '/plan/disable',
  planEnable = '/plan/enable',
  planTemplateAdd = '/planTemplate/add',
  planTemplateEdit = '/planTemplate/edit',
  planTemplateList = '/planTemplate/list',
  planTemplateDelete = '/planTemplate/delete',
  realChartData = '/deviceData/lineChart',
}
/**
 * 设备列表接口
 * @param params
 */
export const getDeviceList = () => defHttp.get({ url: Api.deviceList });
/**
 * 设备编辑
 * @param params
 */
export const deviceEdit = (params) => defHttp.post({ url: Api.deviceEdit, params });

/**
 * 计划 详情
 * @param params
 */
export const planDetal = (params) => defHttp.get({ url: Api.planDetal, params });
/**
 * 计划 新增保存
 * @param params
 */
export const planAdd = (params) => defHttp.post({ url: Api.planAdd, params });

export const planDataAdd = (params) => defHttp.post({ url: Api.planDataAdd, params });
/**
 * 计划 暂停
 * @param params
 */
export const planDisable = (params) => defHttp.post({ url: Api.planDisable, params });
/**
 * 计划 启动
 * @param params
 */
export const planEnable = (params) => defHttp.post({ url: Api.planEnable, params });

/**
 * 计划模板 新增
 * @param params
 */
export const planTemplateAdd = (params) => defHttp.post({ url: Api.planTemplateAdd, params });
/**
 * 计划模板 编辑（暂无用）
 * @param params
 */
export const planTemplateEdit = (params) => defHttp.put({ url: Api.planTemplateEdit, params });
/**
 * 计划模板 获取列表
 * @param params
 */
export const planTemplateList = (params) => defHttp.get({ url: Api.planTemplateList, params });
/**
 * 计划模板 删除
 * @param params
 */
export const planTemplateDelete = (id) => defHttp.delete({ url: Api.planTemplateDelete + `?id=${id}` });

/**
 * 获取设备实际数据
 * @param params
 */
export const realChartData = (params) => defHttp.get({ url: Api.realChartData, params });
