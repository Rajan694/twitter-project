import { createRouter, createWebHistory } from "vue-router";

import NotFound from "../views/NotFound.vue";
import ProfilePage from "../views/ProfilePage.vue";

import UserSignupPage from "../views/UserSignup.vue";
import HomePage from "../views/HomePage.vue";
import UserLogin from "../views/UserLogin.vue";
import AdminLogin from "../views/AdminLogin.vue";
import EditProfile from "../views/EditProfile.vue";
import AllUsers from "../views/AllUsers.vue";
import AllTweets from "../views/AllTweets.vue";

const routes = [
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
  },

  {
    path: "/",
    name: "homepage",
    component: HomePage,
  },
  {
    path: "/signup",
    name: "signup",
    component: UserSignupPage,

    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/HomePage.vue')
  },

  {
    path: "/profilepage/:id?",
    name: "profilepage",
    component: ProfilePage,
  },
  {
    path: "/editprofile/:id",
    name: "editprofile",
    component: EditProfile,
  },

  {
    path: "/login",
    name: "userLogin",
    component: UserLogin,
  },
  {
    path: "/admin/login",
    name: "adminLogin",
    component: AdminLogin,
  },
  {
    path: "/allusers",
    name: "allusers",
    component: AllUsers,
  },
  {
    path: "/tweets",
    name: "tweets",
    component: AllTweets,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
