import { post } from "@/request/http.js";

const UserApi = {
  GetMenu: () => {
    return post("/mock/user/getMenu");
  },
};

export default UserApi;
