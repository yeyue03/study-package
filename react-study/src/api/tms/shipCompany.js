import request from '@/service/request';

const ShipCompanyAPI = {
  // 船公司列表
  ShipCompanyList: (params) => {
    return request.post(`/tms/shippingCompany/list`, params);
  },
  // 新增船公司
  AddShipCompany: (params) => {
    return request.post(`/tms/shippingCompany/add`, params);
  },
  // 编辑船公司
  EditShipCompany: (params) => {
    return request.post(`/tms/shippingCompany/edit`, params);
  },
  // 删除船公司
  DeleteShipCompany: (params) => {
    return request.get(`/tms/shippingCompany/delete?id=` + params);
  },
  // 根据id获取船公司详情
  GetShipCompanyDetail: (params) => {
    return request.get(`/tms/shippingCompany/getById?id=` + params);
  },

  // 获取船公司下拉选项
  GetAllShippingCompany: (params) => {
    return request.get(`/tms/shippingCompany/getAllShippingCompany`);
  },
};

export default ShipCompanyAPI;
