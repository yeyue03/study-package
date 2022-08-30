import { createRouter, createWebHistory } from "vue-router";
// import Home from "@/views/Home.vue";
import Layout from "@/layouts/index.vue";

const routes = [
  {
    path: "/",
    name: "Layout",
    component: Layout,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
