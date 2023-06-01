import request from "@/request/http";

const UserApi = {
  GetMenu: () => {
    return request.get("/mock/user/getMenu");
  },
};

export default UserApi;
