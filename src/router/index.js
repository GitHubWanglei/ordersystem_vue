import { createRouter, createWebHistory } from "vue-router";
import OrderList from "@/components/order/OrderList.vue";
import OrderAdd from "@/components/order/OrderAdd.vue";
import Layout from "../components/Layout.vue";
import Login from "@/components/Login.vue";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/home",
    component: Layout,
    children: [
      {
        path: "",
        name: "list",
        component: OrderList,
      },
      {
        path: "add",
        component: OrderAdd,
        props: true,
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/home",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (token != null) {
    if (to.path == "/login") {
      return next("/home");
    }
  } else {
    if (to.path == "/home/add") {
      return next("/home");
    }
  }
  next();
});

export default router;
