import store from "../store";
import UserApi from "@/api/user";

export const setMenuRouter = async () => {
  const res = await UserApi.GetMenu();
  if (res.code == 200) {
    store.dispatch("setMenu", res.data || []);
  }
};
