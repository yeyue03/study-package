import request from '@/service/request';

const UserAPI = {
  // 获取用户信息与菜单列表
  GetLoginInfo: () => {
    return request.get(`/system/login/ignore/getLoginInfo`);
  },
};

export default UserAPI;
