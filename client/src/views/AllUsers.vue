<template>
  <div class="home">
    <SideBar :currUser="currUser" />

    <div class="body">
      <div class="widget">
        <div class="widget__input">
          <span
            class="material-icons widgets__searchIcon"
            style="cursor: pointer"
            @click="searchUser"
          >
            search
          </span>
          <input
            type="text"
            class="widget__searchInput"
            placeholder="Search"
            v-model="searchedUser"
            @keyup.enter="searchUser"
          />
        </div>
      </div>
      <div class="userlist">
        <template v-for="user in searchedResult" :key="user.userid">
          <SearchBox :user="user" />
        </template>
        <div class="alert alert-info" role="alert" v-if = "searchedError">
          {{ searchedError }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authenticate } from "../services/AuthenticateUserLogin.js";
import SideBar from "../components/sidebar.vue";
import SearchBox from "../components/search.vue";
import axios from "axios";

export default {
  name: "AlllUsers",
  data: () => {
    return {
      searchedUser: "",
      searchedResult: "",
      searchedError: "",
      currUser: ''
    };
  },
  components: {
    SideBar,
    SearchBox,
  },
  metainfo: {
    script: [
      {
        src: "https://platform.twitter.com/widgets.js",
        async: true,
        defer: true,
      },
    ],
  },
  methods: {
    searchUser() {
      this.searchedError = "";
      this.searchedResult = "";
      this.searchedUser = this.searchedUser.trim().toLowerCase();
      const data = {
        name: this.searchedUser,
      };
      console.log(data);
      const url = "http://localhost:3300/trial/user";
      axios
        .post(url, data)
        .then((response) => {
          if (response.status == 200) {
            this.searchedResult = response.data;
          } else {
            this.searchedError = response.data;
          }
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created()
  {
    this.currUser = JSON.parse(authenticate('admin'));
    if(this.currUser == '')
    {
      this.$router.push('/admin/login');
    }
    const url = "http://localhost:3300/trial/admin/allusers";
    axios.get(url)
    .then(response => {
      if(response.status == 200)
      {
        this.searchedResult = response.data;
      }
      else
      {
        this.searchedError = response.data;
      }
    })
    .catch(error => {
      console.log(error);
    })
  }
};
</script>

<style scoped>
.home {
  margin-left: 200px;
  margin-right: auto;

  box-sizing: border-box;
  display: flex;

  flex-direction: row;
}
.body {
  width: 60%;
  padding-top: 10px;
  overflow-y: scroll;
  overflow: hidden;
  margin-left: 270px;
}
.widget {
  width: 100%;

  margin-top: 5px;
  padding: 3px;
  border: 1px solid #e6ecf0;
  border-radius: 10px;
}
.widget__searchInput {
  outline: none;
  width: 98%;
}
.widget__input {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #e6ecf0;
  padding: 10px;
  border-radius: 20px;
  margin: 15px;
}

.widget__input input {
  border: none;
  background-color: #e6ecf0;
}
.userlist {
  margin-top: 5px;
  border: 1px solid #e6ecf0;
  border-radius: 10px;
}
.comment__avatar img {
  border-radius: 50%;
  height: 65px;
}
.comment__headerSpecial {
  font-weight: 600;
  font-size: 14px;
  color: gray;
}
.comment__headerText {
  padding-top: 25px;
  margin-left: 10px;
}
.comment__headerText h3 {
  font-size: 17px;
}
</style>
