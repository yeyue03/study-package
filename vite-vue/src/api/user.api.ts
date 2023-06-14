import request from "@/request/http";

const UserApi = {
  GetMenu: () => {
    return request.get({url: "/tms/tmsSysWarehouse/ignore/selectAllWarehouseCode"});
  },
};

export default UserApi;
