<template>
  <div class="tweetBox">
    <form>
      <div class="tweetbox__input">
        <img :src="getImage(currUser.profile_image)" alt="" draggable="false" />
        <textarea
          type="text"
          ref="myInput"
          placeholder="What's happening?"
          v-model="content"
          maxlength="300"
        ></textarea>
      </div>
      <div class="text-danger text-center">{{ error }}</div>
      <button type="button" class="tweetBox__tweetButton" @click="postTweet">
        Tweet
      </button>
    </form>
  </div>
</template>

<script>
import { getToken } from "../services/TokenServices.js";
import { ref, nextTick, onMounted } from "vue";
import axios from "axios";
export default {
  name: "TweetBox",
  data: () => {
    return {
      content: "",
      error: "",
      currUser: "",
    };
  },
  setup() {
    const myInput = ref(null);

    const setFocus = () => {
      nextTick(() => {
        myInput.value.focus();
      });
    };

    onMounted(() => {
      setFocus();
    });

    return {
      myInput,
      setFocus,
    };
  },
  methods: {
    getImage(url) {
      console.log(url);
      try {
        return require("../assets/images/" + url);
      } catch {
        return require("../assets/images/default.jpeg");
      }
    },
    postTweet() {
      this.content = this.content.trim();
      this.content = this.content.replace("'", "''");
      if (this.content == "") {
        this.error = "nothing to post..";
        setTimeout(() => {
          this.error = "";
        }, 2000);
      } else {
        const date = new Date();
        console.log(this.currUser);
        if (this.currUser != null) {
          const data = {
            postedAt: date,
            userid: this.currUser.userid,
            content: this.content,
          };
          // console.log(data);
          const url = "http://localhost:3300/trial/tweet/post";
          axios
            .post(url, data)
            .then((response) => {
              if (response.status == 200) {
                console.log(response.data);
                // this.$router.push('/');
                location.reload();
              } else {
                this.error = response.data;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          this.$router.push("/login");
        }
        // console.log(user, date);
      }
    },
  },
  created() {
    this.currUser =
      JSON.parse(getToken("users")) || JSON.parse(getToken("admin"));
    if (this.currUser == "" || this.currUser == null) {
      this.$router.push("/login");
    }
  },
};
</script>

<style scoped>
/* tweet box */
.tweetbox__input img {
  border-radius: 50%;
  height: 40px;
  width: 40px;
}

.tweetBox {
  padding-bottom: 10px;
  border-bottom: 8px solid #e6ecf0;
  padding-right: 10px;
  border-right: 1px solid #e6ecf0;
  border-left: 1px solid #e6ecf0;
  border-top: 1px solid #e6ecf0;
  margin-top: 10px;
}

.tweetBox form {
  display: flex;
  flex-direction: column;
}

.tweetbox__input {
  display: flex;
  padding: 20px;
}

.tweetbox__input textarea {
  flex: 1;
  overflow: hidden;
  margin-left: 20px;
  font-size: 20px;
  border: none;
  outline: none;
}

.tweetBox__tweetButton {
  background-color: #50b7f5;
  border: none;
  color: white;
  font-weight: 900;

  border-radius: 30px;
  width: 80px;
  height: 40px;
  margin-top: 20px;
  margin-left: auto;
}
</style>
