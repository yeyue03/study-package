import request from "@/request/http";

const UserApi = {
  GetMenu: () => {
    return request.get({url: "/user/menu"});
  },
};

export default UserApi;
