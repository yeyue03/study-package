import request from '@/service/request';

const UserAPI = {
  // 获取用户信息
  GetLoginInfo: () => {
    return request.get(`/system/login/ignore/getLoginInfo`);
  },
  // 获取菜单列表
  GetMenu: () => {
    return request.post('/mock/user/getMenu');
  }
};

export default UserAPI;
