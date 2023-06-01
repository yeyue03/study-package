import request from "@/request/http";

const UserApi = {
  GetMenu: () => {
    return request.get("/user/menu");
  },
};

export default UserApi;
