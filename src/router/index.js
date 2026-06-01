import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/projects",
    name: "projects",
    component: () => import("../views/ProjectsView.vue"),
  },
  {
    path: "/projects/geojson-tool/demo",
    name: "geojson-demo",
    component: () => import("../views/GeoJsonDemoView.vue"),
  },
  {
    path: "/projects/:id",
    name: "project-detail",
    component: () => import("../views/ProjectDetailView.vue"),
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("../views/ContactView.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
