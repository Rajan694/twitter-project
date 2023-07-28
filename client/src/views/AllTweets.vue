<template>
  <div class="home">
    <SideBar :currUser="currUser" />
    <div class="body">
      <ul class="nav nav-pills nav-fill navbar" style="padding: 3px">
        <li class="nav-item">
          <a
            class="nav-link"
            :class="navvar == 1 ? 'active' : ''"
            href="#"
            aria-current="page"
            @click="
              (var1 = 'true'),
                (var2 = 'false'),
                (var3 = 'false'),
                (navvar = 1),
                getTweets('show')
            "
            >All Tweets</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="navvar == 2 ? 'active' : ''"
            href="#"
            aria-current="page"
            @click="
              (var1 = 'false'),
                (var2 = 'true'),
                (var3 = 'false'),
                (navvar = 2),
                getTweets('hide')
            "
            >Hidden Tweets</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="navvar == 3 ? 'active' : ''"
            href="#"
            aria-current="page"
            @click="
              (var1 = 'false'),
                (var2 = 'false'),
                (var3 = 'true'),
                (navvar = 3),
                getTweets('delete')
            "
            >Deleted Tweets</a
          >
        </li>
      </ul>

      <div v-if="var1 == 'true'" class="alltweets">

        <div class="alert alert-info text-center" role="alert" v-if = "error">

          {{ error }}
        </div>
        <div v-for="tweet in tweets" :key="tweet.tweetid">
          <TweetPost :tweet="tweet" :currUser="currUser" />
        </div>
      </div>
      <div v-if="var2 == 'true'" class="hiddentweets">

        <div class="alert alert-info text-center" role="alert" v-if = "error">
          {{ error }}
        </div>
        <div v-for="tweet in tweets" :key="tweet.tweetid">
          <TweetPost :tweet="tweet" :currUser="currUser" />
        </div>
      </div>
      <div v-if="var3 == 'true'" class="deletedtweets">

        <div class="alert alert-info text-center" role="alert" v-if = "error">

          {{ error }}
        </div>
        <div v-for="tweet in tweets" :key="tweet.tweetid">
          <TweetPost :tweet="tweet" :currUser="currUser" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SideBar from "../components/sidebar.vue";
import TweetPost from "../components/post.vue";
import { authenticate } from "../services/AuthenticateUserLogin.js";
export default {
  name: "AllTweets",
  // props: ["tweets"],
  data: () => {
    return {
      tweets: [],

      navvar: 1,
      var1: "true",
      var2: "false",
      var3: "false",
      error: "",
    };
  },
  components: {
    SideBar,
    TweetPost,
  },
  methods: {
    getTweets(action) {
      this.tweets = [];
      this.error = "";
      const url = "http://localhost:3300/trial/getTweet";
      const data = {
        action: action,
      };
      console.log(data);
      axios
        .post(url, data)
        .then((response) => {
          if (response.status == 200) {
            this.tweets = response.data;
          } else {
            this.error = response.data;
          }
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.currUser = JSON.parse(authenticate("admin"));
    if (this.currUser == null) {
      this.$router.push("/admin/login");
    }
    this.getTweets("show");
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
.body {
  width: 60%;
  padding-top: 10px;
  overflow-y: scroll;
  overflow: hidden;
  margin-left: 270px;
}
.navbar {
  border: 1px solid #e6ecf0;
  border-radius: 10px;
}
</style>
