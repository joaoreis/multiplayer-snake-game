import { createRouter, createWebHashHistory } from "vue-router";
// import HomeView from "../views/HomeView.vue";
import FirstPageVue from "@/views/FirstPage.vue";
import LoginPageVue from "@/views/LoginPage.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: () => LoginPageVue,
  },
  {
    path: "/game",
    name: "game",
    component: () => FirstPageVue,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
