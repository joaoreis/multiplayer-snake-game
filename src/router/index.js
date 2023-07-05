import { createRouter, createWebHashHistory } from "vue-router";
import FirstPageVue from "@/views/FirstPage.vue";
import LoginPageVue from "@/views/LoginPage.vue";

import { useUserStore } from "@/storage/user";

const routes = [
  {
    path: "/",
    name: "login",
    displayName: "login",
    component: () => Promise.resolve(LoginPageVue),
  },
  {
    path: "/game",
    name: "game",
    displayName: "login",
    component: () => Promise.resolve(FirstPageVue),
    meta: {
      requiresAuth: true,
    },
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to) => {
  const redirectQuery = {};

  const { nickname } = useUserStore();

  redirectQuery.redirect = to.fullPath;
  // Checking if the route requires auth
  if (to.matched.some((record) => record.meta.requiresAuth) && !nickname) {
    router.push({ name: "login" });
  }
  window.scrollTo(0, 0);
});

export default router;
