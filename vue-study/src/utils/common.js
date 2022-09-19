import store from '../store';
import UserApi from '@/api/user';

export const setMenuRouter = async () => {
  const res = await UserApi.GetMenu();
  if (res.code == 200) {
    console.log("== menu", res.data);
    store.dispatch('setMenu', res.data || []);
  }
  
}