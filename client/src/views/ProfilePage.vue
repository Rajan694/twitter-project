<template>
  <div class="container">
    <SideBar :currUser="currUser" />
    <div class="flexcontainer">
      <div class="middlecontainer">
        <section class="headsec">
          <router-link to="/">
            <i class="fa fa-arrow-left" id="fa-arrow-left"></i>
          </router-link>
          <div v-if="searchedUser != ''">
            <h3 v-if="searchedUser != ''">{{ searchedUser.username }}</h3>
            <span> {{ searchedUser.totaltweets }} Tweets </span>
          </div>
          <div v-else>
            <h3>{{ currUser.username }}</h3>
            <span> {{ currUser.totaltweets }} Tweets </span>
          </div>
        </section>
        <section class="twitterprofile">
          <div class="headerprofileimage">
            <!-- <img :src="getImage(searchedUser.profile_image)" alt="header" id="headerimage" v-if = "searchedUser != ''"/>
            <img :src="getImage(currUser.profile_image)" alt="header" id="headerimage" v-else/> -->
            <img
              :src = "getBackground(searchedUser.cover_image)"
              alt="header"
              id="headerimage"
              v-if="searchedUser != ''"
            />
            <img
              :src="getBackground(currUser.cover_image)"
              alt="header"
              id="headerimage"
              v-else
            />

            <img
              v-if="searchedUser != ''"
              :src="getImage(searchedUser.profile_image)"
              alt="profile pic"
              id="profilepic"
              draggable="false"
            />
            <img
              v-else
              :src="getImage(currUser.profile_image)"
              alt="profile pic"
              id="profilepic"
              draggable="false"
            />
            <router-link
              :to="'/editprofile/' + currUser.userid"
              draggable="false"
            >
              <div class="editprofilebutton" v-if="searchedUser == ''">
                Edit Profile
              </div></router-link
            >
          </div>
          <div class="bio">
            <div class="handle" v-if="searchedUser == ''">
              <h3>{{ currUser.username }}</h3>
              <span>@ {{ currUser.displayname }} </span>
            </div>
            <div class="handle" v-else>
              <h3>{{ searchedUser.username }}</h3>
              <span>@ {{ searchedUser.displayname }}</span>
            </div>
            <p v-if="searchedUser == ''">{{ currUser.bio }}</p>
            <p v-else>{{ searchedUser.bio }}</p>
            <!-- <p>Front-end web developer |</p>
            <p>Barça fan |</p>
            <span>@Awelagos @4topsports</span> <br /> -->
            <!-- <span>
              <i class="fa fa-location-arrow"></i> Lagos, Nigeria.
              <a href="#">
                <i class="fa fa-external-link" aria-hidden="true"></i
                >linkedin.com/in/segun-olani…
              </a>
              <i class="fa fa-birthday-cake" aria-hidden="true"></i> Born
              November 10</span
            > -->
            <!-- <br />
            <span><i class="fa fa-calendar"></i> Joined May 2013</span>
            <div class="nawa">
              <div class="followers">421 <span>Following</span></div>
              <div>1519<span> Followers</span></div>
            </div> -->
          </div>
        </section>

        <section class="feed">
          <!-- <template v-if = "tweets.length == 0">
            <div class="alert alert-info" role="alert">
                Post your first tweet..
            </div>
          </template> -->
          <template v-if="tweets.length == 0">
            <div
              class="alert alert-info text-center"
              style="
                margin-top: 23px;
                padding: 20px;
                font-size: 20px;
                font-weight: 400;
              "
              v-if="error"
              role="alert"
            >
              {{ error }}
            </div>
          </template>
          <template v-else>
            <div v-for="tweet in tweets" :key="tweet.tweetid">
              <TweetPost :tweet="tweet" :currUser="currUser" />
            </div>
          </template>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { authenticate } from "../services/AuthenticateUserLogin";
import TweetPost from "../components/post.vue";
import SideBar from "../components/sidebar.vue";
import axios from "axios";
export default {
  name: "ProfilePage",
  components: {
    TweetPost,
    SideBar,
  },
  data: () => {
    return {
      currUser: "",
      searchedUser: "",
      tweets: [],
      error: "",
      id: "",
      profileError: "",
      userTweets: "",
      totaltweets: "0",
    };
  },
  methods: {
    getImage(url) {
      // console.log(url);
      try {
        return require(`../assets/images/${url}`);
      } catch {
        return require("../assets/images/default.jpeg");
      }
    },

    getBackground(url)
    {
      try{
        return require('../assets/images/' + url);
      }
      catch{
        return require('../assets/images/blue.png');
      }
    },
  },
  created() {
    this.id = this.$route.params.id; // in case of user search.
    this.currUser = "";
    this.userTweets = this.id;
    let urlTweets = "";

    this.currUser =
      JSON.parse(authenticate("users")) || JSON.parse(authenticate("admin"));

    if (this.currUser == null) {
      this.$router.push("/login");
    }
    console.log(this.currUser);

    if (this.id != "") {
      // means by user search
      console.log(this.id);

      if (this.id != this.currUser.userid) {
        // searched user is not the currently logged in user
        const url =
          "http://localhost:3300/trial/auser/" + JSON.stringify(this.id);

        urlTweets =
          "http://localhost:3300/trial/user/tweets/" +
          JSON.stringify({ id: this.id, status: "search" });
        axios
          .get(url)
          .then((response) => {
            if (response.status == 200) {
              this.searchedUser = response.data[0];
              this.userTweets = this.id;
              console.log(this.searchedUser);
            } else {
              this.profileError = response.data;
            }
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        // searched user is the currently logged in user;
        console.log("opened profile page from post");
        this.userTweets = "";
        // this.$router.push('/profilepage')
      }
      console.log(this.userTweets);
    }

    if (this.userTweets == "") {
      this.userTweets = this.currUser.userid;
      urlTweets =
        "http://localhost:3300/trial/user/tweets/" +
        JSON.stringify(this.userTweets);
      console.log(urlTweets);
    }
    console.log("logged in");
    axios
      .get(urlTweets)
      .then((response) => {
        if (response.status == 200) {
          this.tweets = response.data;
        } else {
          this.error = response.data;
        }
        // console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
body {
  color: white;
  font-family: "Roboto", sans-serif;
  scroll-behavior: smooth;
}
.container {
  margin-left: 200px;
  margin-right: 200px;
}
.flexcontainer {
  /* position: relative;*/
  margin-left: 270px;
  display: flex;
}
.middlecontainer {
  width: 900px;
  height: 100%;
  margin-left: 20px;
  position: absolute;
}
#headerimage {
  width: 898px;
  height: 200px;
}
.headsec {
  display: flex;
  padding-top: 10px;
  border-left: 1px solid rgb(155, 157, 160);
  border-right: 1px solid rgb(155, 157, 160);
}
#fa-arrow-left {
  color: #50b7f5;
  filter: brightness(70%);
  font-size: 20px;
  margin: 10px 20px 0 20px;
  cursor: pointer;
}
.twitterprofile {
  display: block;
  border-left: 1px solid rgb(155, 157, 160);
  border-right: 1px solid rgb(155, 157, 160);
  border-bottom: 1px solid rgb(155, 157, 160);
}
.headerprofileimage {
  padding-top: 10px;
  position: relative;
}
#profilepic {
  border-radius: 50%;
  width: 137px;
  height: 137px;
  position: absolute;
  top: 130px;
  left: 20px;
  border: 4px solid white;
  transition: transform 0.4s;
}
#profilepic:hover {
  transform: scale(1.5);
  border-radius: 0%;
}
.handle {
  line-height: 19px;
  margin-bottom: 10px;
}
.editprofilebutton {
  margin-top: 5px;
  float: right;
  background-color: black;
  color: white;
  border: 1px solid;
  border-radius: 30px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  margin-right: 10px;
}
.bio {
  margin-top: 65px;
  margin-left: 20px;
  margin-bottom: 20px;
  line-height: 40px;
  font-size: 15px;
  padding-bottom: 30px;
}
.followers {
  margin-right: 15px;
}
.nawa {
  display: flex;
}
</style>
