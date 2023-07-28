<template>
  <div class="sidebar">
    <i class="fab fa-twitter"></i>
    <router-link
      class="sidebarOption"
      :class="$route.name == 'homepage' ? 'active' : 'notactive'"
      aria-current="page"
      to="/"
      draggable="false"
    >
      <div class="sidebarOption">
        <span class="material-icons"> home </span>
        <h2>Home</h2>
      </div>
    </router-link>

    <!-- <div class="sidebarOption">
        <span class="material-icons"> search </span>
        <h2>Explore</h2>
      </div>

      <div class="sidebarOption">
        <span class="material-icons"> notifications_none </span>
        <h2>Notifications</h2>
      </div>

      <div class="sidebarOption">
        <span class="material-icons"> mail_outline </span>
        <h2>Messages</h2>
      </div>

      <div class="sidebarOption">
        <span class="material-icons"> bookmark_border </span>
        <h2>Bookmarks</h2>
      </div>

      <div class="sidebarOption">
        <span class="material-icons"> list_alt </span>
        <h2>Lists</h2>
      </div> -->

    <a
      class="sidebarOption"
      href="/profilepage"
      :class="$route.name == 'profilepage' ? 'active' : 'notactive'"
      aria-current="page"
      draggable="false"
    >
      <div class="sidebarOption">
        <span class="material-icons"> perm_identity </span>
        <h2>Profile</h2>
      </div>
    </a>
    <router-link
      class="sidebarOption"
      to="/tweets"
      v-if="currUser.role == 'admin'"
      :class="$route.name == 'tweets' ? 'active' : 'notactive'"
      aria-current="page"
      draggable="false"
    >
      <div class="sidebarOption">
        <span class="material-symbols-outlined material-icons">view_list</span>
        <h2>Tweets</h2>
      </div>
    </router-link>

    <router-link
      class="sidebarOption"
      to="/allusers"
      v-if="currUser.role == 'admin'"
      :class="$route.name == 'allusers' ? 'active' : 'notactive'"
      aria-current="page"
      draggable="false"
    >
      <div class="sidebarOption">
        <span class="material-symbols-outlined material-icons">group</span>
        <h2>All Users</h2>
      </div>
    </router-link>

    <div class="sidebarOption notactive" @click="logout">
      <!-- <span class="material-icons"> more_horiz </span> -->
      <!-- <i class="material-icons fas fa-power-off fa-lg"></i> -->
      <span class="material-symbols-outlined material-icons"> logout </span>
      <h2>Logout</h2>
    </div>
    <button @click="reload" class="sidebar__tweet">Tweet</button>
  </div>
  <!-- <div>
        <button class="sidebar__tweet">Tweet</button>

    </div> -->
  <!-- </div> -->
  <!-- </div> -->
</template>

<script>
import { clearToken } from "../services/TokenServices.js";

export default {
  name: "SideBar",
  props: ["currUser"],

  methods: {
    logout() {
      const role = this.currUser.role;
      console.log(this.currUser);
      console.log("logging out" + role);
      clearToken(role);
      if (role == "admin") this.$router.push("/admin/login");
      else this.$router.push("/login");
    },
    reload() {
      window.location.reload();
    },
  },
  created() {
    console.log("from the sidebar = " + this.currUser);
  },
};
</script>

<style scoped>
.sidebarOption {
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
}

.sidebarOption .material-icons,
.fa-twitter {
  padding: 20px;
}

.sidebarOption h2 {
  font-weight: 800;
  font-size: 20px;
  margin-right: 20px;
  margin-top: 10px;
}

.sidebarOption:hover {
  background-color: #e6ecf0;
  border-radius: 30px;
  color: #50b7f5;
  transition: color 100ms ease-out;
}

.active {
  color: #fff;
  border-radius: 30px;
  background-color: #50b7f5;
}
.notactive {
  color: #000;
}

.sidebar__tweet {
  width: 100%;
  background-color: #50b7f5;
  border: none;
  color: white;
  font-weight: 900;
  border-radius: 30px;
  height: 50px;
  margin-top: 20px;
}

body {
  display: flex;
  height: 100vh;
  max-width: 1300px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 10px;
}

.sidebar {
  border-right: 1px solid rgb(155, 156, 160);
  border-left: 1px solid rgb(155, 157, 160);
  border-bottom: 1px solid rgb(155, 157, 160);
  flex: 0.2;
  float: left;
  min-width: 250px;
  padding: 20px;
  position: fixed;
}

.fa-twitter {
  color: #50b7f5;
  font-size: 30px;
}
</style>
