<template>
  <div class="home">
    <!-- sidebar starts -->

    <SideBar :currUser="currUser" />

    <!-- sidebar ends -->

    <!-- feed starts -->
    <div class="feed">
      <!-- tweetbox starts -->
      <TweetBox />
      <!-- tweetbox ends -->

      <!-- post starts -->
      <template v-if = "tweets.length == 0">
        <div class="alert alert-info text-center" role="alert">
          No tweets found.. 
        </div>
      </template>
      <div v-for="tweet in tweets" :key="tweet.tweetid">
        <TweetPost :tweet="tweet" :currUser="currUser" />
      </div>
      <!-- <TweetPost /> -->

      <!--<div class="post">
        <div class="post__avatar">
          <img
            src="https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
            alt=""
          />
        </div>

        <div class="post__body">
          <div class="post__header">
            <div class="post__headerText">
              <h3>
                Somanath Goudar
                <span class="post__headerSpecial"
                  ><span class="material-icons post__badge"> verified </span>@somanathg</span
                >
              </h3>
            </div>
            <div class="post__headerDescription">
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
            </div>
          </div>
          <img
            src="https://www.focus2move.com/wp-content/uploads/2020/01/Tesla-Roadster-2020-1024-03.jpg"
            alt=""
          />
          <div class="post__footer">
            <span class="material-icons"> repeat </span>
            <span class="material-icons"> favorite_border </span>
            <span class="material-icons"> publish </span>
          </div>
        </div>
      </div>
       post ends -->

      <!-- post starts -->
      <!-- post ends -->
    </div>
    <!-- feed ends -->

    <!-- widgets starts -->
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
          placeholder="Search Twitter"
          v-model="searchedUser"
          @keyup.enter="searchUser"
        />
      </div>
      <template v-if = "searchedUser != '' && searchedResult.length == 0">
        <div class="alert alert-info" role="alert">
          No User found..
        </div>
      </template>
      <template v-for="user in searchedResult" :key="user.userid">
        <SearchBox :user="user" />
      </template>
      <!-- <SearchBox /><SearchBox /><SearchBox /><SearchBox /><SearchBox /><SearchBox /><SearchBox /><SearchBox /> -->

      <h4 v-if="searchedError">{{ searchedError }}</h4>
    </div>

    <!-- <div class="widgets__widgetContainer">
      <h2>What's happening?</h2>
      <blockquote class="twitter-tweet">
        <p lang="en" dir="ltr">
          Sunsets don&#39;t get much better than this one over
          <a href="https://twitter.com/GrandTetonNPS?ref_src=twsrc%5Etfw"
            >@GrandTetonNPS</a
          >.
          <a
            href="https://twitter.com/hashtag/nature?src=hash&amp;ref_src=twsrc%5Etfw"
            >#nature</a
          >
          <a
            href="https://twitter.com/hashtag/sunset?src=hash&amp;ref_src=twsrc%5Etfw"
            >#sunset</a
          >
          <a href="http://t.co/YuKy2rcjyU">pic.twitter.com/YuKy2rcjyU</a>
        </p>
        &mdash; US Department of the Interior (@Interior)
        <a
          href="https://twitter.com/Interior/status/463440424141459456?ref_src=twsrc%5Etfw"
          >May 5, 2014</a
        >
      </blockquote>
    </div> -->
  </div>
</template>
<script>
import TweetPost from "../components/post.vue";
import SideBar from "../components/sidebar.vue";
import TweetBox from "../components/tweetbox.vue";
import SearchBox from "../components/search.vue";
import { authenticate } from "../services/AuthenticateUserLogin.js";
import axios from "axios";
export default {
  name: "AboutView",
  components: {
    TweetPost,
    TweetBox,
    SideBar,
    SearchBox,
  },
  data: () => {
    return {
      currUser: "",
      tweets: [],
      error: "",
      searchedUser: "",
      searchedResult: "",
      searchedError: "",
    };
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
  created() {
    this.currUser =
      JSON.parse(authenticate("users")) || JSON.parse(authenticate("admin"));
    if (this.currUser == null) {
      this.$router.push("/login");
    } else {
      console.log(this.currUser);

      const url = "http://localhost:3300/trial/tweets/all";
      console.log(url);
      axios
        .get(url)
        .then((response) => {
          console.log(response.data);
          if (response.status == 200) {
            this.tweets = response.data;
          } else {
            this.error = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    console.log(this.currUser);
  },
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

body {
  --twitter-color: #50b7f5;
  --twitter-background: #e6ecf0;
}

/* feed */
.feed {
  /* flex: 0.5; */
  /* display: flex;
  flex-direction: column; */
  border-right: 1px solid #e6ecf0;
  /* min-width: fit-content; */
  width: 80%;
  padding-right: 10px;
  overflow-y: scroll;
  overflow: hidden;
  margin-left: 270px;
}

.feed::-webkit-scrollbar {
  display: none;
}

.feed {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* post */

/* widgets */
.widget {
  width: 20%;
  margin-right: 10px;
  margin-top: 5px;
  padding: 3px;
  border: 1px solid #e6ecf0;
  /* margin-left: auto;
  flex: 0.3;
  display: flex;
  flex-direction: row;

  height: 200px; */
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
  margin-top: 10px;
  margin-left: 15px;
}

.widget__input input {
  border: none;
  background-color: #e6ecf0;
}
</style>
