<template>
  <div class="post">
    <!-- {{ tweet }} -->
    <!-- :src = 'tweet.image_path' -->

    <div class="post__avatar">
      <img :src="getImage(tweet.profile_image)" alt="" draggable="false" />
    </div>

    <div class="post__body">
      <div class="post__header">
        <i class="fas fa-solid fa-ellipsis-vertical"></i>
        <div class="post__headerText">
          <h3>
            <a
              :href="'http://localhost:8080/profilepage/' + tweet.userid"
              style="text-decoration: none; color: black"
              draggable="false"
            >
              {{ tweet.username }}
            </a>
            <span class="post__headerSpecial"
              ><span class="material-icons post__badge"> verified </span>@{{
                tweet.displayname
              }}</span
            >
            <span class="post__badge" v-if="tweet.action == 'hide'">
              Hidden
            </span>
          </h3>
        </div>
        <div class="post__headerDescription">
          <p v-if="!showEdit">{{ tweet.content }}</p>
          <div v-if="showEdit">
            <textarea
              maxlength="100"
              type="text"
              v-model="editableTweet"
              ref="name"
            ></textarea>

            <button @click="toggleEditOption(), confirmTweetEdit()">
              Confirm Edit
            </button>
          </div>
        </div>
      </div>

      <div class="post__footer">
        <!-- <button></button> -->
        <div>
          <button
            :id="'commentButton' + tweet.tweetid"
            type="button"
            style="padding-top: 7px"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            data-bs-auto-close="outside"
          >
            <img src="../assets/comment.png" draggable="false" />
          </button>
          <div class="dropdown-menu" style="padding: 1.09rem">
            <div class="mb-3">
              <label class="form-label">Comment</label>
              <textarea
                type="text"
                style="overflow: hidden"
                class="form-control"
                maxlength="100"
                id="comment"
                v-model="comment"
                placeholder="Say something..."
              ></textarea>
              <p class="text-center text-danger">{{ commentError }}</p>
            </div>

            <div class="commentbutton">
              <button>
                <span class="material-icons" @click="postComment"> send </span>
              </button>

              <button
                type="button"
                class="allcomment"
                data-bs-toggle="modal"
                :data-bs-target="'#commentModal' + tweet.tweetid"
                @click="getAllComments()"
              >
                Show All
              </button>
            </div>
          </div>
          <div
            class="modal fade"
            :id="'commentModal' + tweet.tweetid"
            tabindex="-1"
            :aria-labelledby="'commentModalLabel' + tweet.tweetid"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5
                    class="modal-title"
                    :id="'exampleModalLabel' + tweet.tweetid"
                  >
                    All Comments
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    @click="show = !show"
                  ></button>
                </div>
                <div class="modal-body" v-if="show" :key="comments">
                  <CommentHolder :comments="comments" />
                </div>
              </div>
            </div>
          </div>
        </div>

          <!-- v-on:click="(ishidden = !ishidden), savelike()" -->
        <button
          @click = "(ishidden = !ishidden), giveLike()"
          v-if="!ishidden"
        >
          <img src="../assets/love.png" draggable="false" />
        </button>
        <button v-on:click="(ishidden = !ishidden), giveLike()" v-if="ishidden">
          <img src="../assets/heart.png" draggable="false" />
        </button>
        <div class="time">
          <!-- <p>{{ tweet.postedat }}</p> -->
          <p>{{ duration }} ago</p>
        </div>
      </div>
    </div>

    <div class="dropdown" v-if="currUser.userid == tweet.userid">
      <button
        class="btn"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img src="../assets/three-dots-vertical.svg" draggable="false" />
      </button>

      <ul class="dropdown-menu">
        <li>
          <a class="dropdown-item" @click="toggleEditOption">Edit</a>
        </li>
        <li>
          <a
            class="dropdown-item"
            v-if="tweet.action == 'show'"
            @click="changeAction('hide'), confirmTweetEdit()"
            >Hide</a
          >
        </li>
        <li>
          <a
            class="dropdown-item"
            v-if="tweet.action == 'hide'"
            @click="changeAction('show'), confirmTweetEdit()"
            >Show</a
          >
        </li>
        <li>
          <a
            class="dropdown-item"
            data-bs-toggle="modal"
            :data-bs-target="'#deleteModal' + tweet.tweetid"
            @click="changeAction('delete')"
            >Delete</a
          >
        </li>
      </ul>
      <div
        class="modal fade"
        :id="'deleteModal' + tweet.tweetid"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Remove Post!!
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">Are you sure to delete this post?</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                No
              </button>
              <button
                type="button"
                @click="changeAction('delete'), confirmTweetEdit()"
                class="btn btn-primary"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

// import CommentBox from "./comment.vue";
import CommentHolder from "../components/CommentHolder.vue";
import { getToken } from "../services/TokenServices.js";

export default {
  name: "TweetPost",
  components: {
    CommentHolder,
  },
  props: ["tweet", "currUser"],
  data: () => {
    return {
      comments: [], // to store all the comments on a particular post
      error: "",
      showEdit: false, // toggle the edit option
      ishidden: "", // toggle like unlike button
      editableTweet: "", // to store the new edit of the post
      action: "", // to store the current action('show', 'hide', 'delete') of the post
      comment: "", // to store the comment to be posted on the post.
      commentError: "",
      duration: null,
      show: false,
      likeCount: ''

    };
  },

  mounted() {
    this.calculateDuration();
  },
  methods: {
    calculateDuration() {
      const start = new Date();
      const end = new Date(this.tweet.postedat);
      const diff = Math.abs(end - start) - 5.5 * 3600000; // 5.5 hours to miliseconds
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      if (days > 0) {
        this.duration = `${days} day`;
      } else if (hours > 0) {
        this.duration = `${hours} hours`;
      } else if (minutes > 0) {
        this.duration = `${minutes} minutes`;
      } else {
        this.duration = `Few seconds`;
      }
    },

    getImage(url) {
      try {
        return require("../assets/images/" + url);
      } catch {
        return require("../assets/images/default.jpeg");
      }
    },

    focusInput() {
      this.$refs.name.focus();
    },
    editingTweet() {
      this.editableTweet = this.tweet.content;
      console.log(this.editableTweet);
    },
    changeAction(status) {
      this.action = status;
      // console.log(this.tweet.tweetid);
    },
    toggleEditOption() {
      this.showEdit = !this.showEdit;
    },
    confirmTweetEdit() {
      // this.showEdit = !this.showEdit;
      if (this.editableTweet != "") {
        console.log(this.editableTweet);
        const user =
          JSON.parse(getToken("users")) || JSON.parse(getToken("admin"));
        const url =
          "http://localhost:3300/trial/tweet/edit/" + this.tweet.tweetid;
        this.editableTweet = this.editableTweet.replace("'", "''");
        console.log(url);

        const data = {
          content: this.editableTweet,
          action: this.action,
          userid: user.userid,
        };

        console.log(data);
        axios
          .post(url, data)
          .then((response) => {
            if (response.status == 200) {
              console.log(response.data);
              location.reload();
            } else {
              console.log(response.data);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    getAllComments() {
      this.show = true;
      console.log(this.show);
      console.log(this.tweet.tweetid);
      const url = "http://localhost:3300/trial/comments/" + this.tweet.tweetid;

      axios
        .get(url)
        .then((response) => {
          if (response.status == 200) {
            this.comments = response.data;
            console.log(this.comments);
          } else if (response.status == 203) {
            this.comments = [];
          } else {
            this.error = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    postComment() {
      this.comment = this.comment.trim();
      if (this.comment != "") {
        console.log(this.comment);
        const date = new Date();
        const users =
          JSON.parse(getToken("users")) || JSON.parse(getToken("admin"));
        this.comment = this.comment.replace("'", "''");
        const data = {
          tweetid: this.tweet.tweetid,
          userid: users.userid,
          comment: this.comment,
          postedAt: date,
        };
        // console.log(data);
        const url = "http://localhost:3300/trial/postcomment";

        axios
          .post(url, data)
          .then((response) => {
            if (response.status == 200) {
              const id = "commentButton" + this.tweet.tweetid;
              console.log(response.data);
              this.comment = "";
              document.getElementById(id).click();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.commentError = "no comment added";
        setTimeout(() => {
          this.commentError = "";
        }, 1500);
      }
    },

    giveLike(){
      if(this.likeCount.includes(this.currUser.userid))
      {
        this.likeCount = this.likeCount.filter(id => id != this.currUser.userid);
      }
      else
      {
        this.likeCount.push(this.currUser.userid);
      }
      console.log('post id - ' + this.tweet.tweetid + 'likes- '+this.likeCount);

      const url = "http://localhost:3300/trial/like/" + this.tweet.tweetid;

      axios.post(url, this.likeCount)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      })
    }
  },
  created() {
    // console.log(this.tweet);
    this.editableTweet = this.tweet.content;
    this.action = this.tweet.action;
    this.ishidden = this.tweet.likes;
    if(this.tweet.liked_users === null)
      this.likeCount = [];
    else
    {
      this.likeCount = this.tweet.liked_users;
      if(this.likeCount.includes(this.currUser.userid))
      {
        this.ishidden = true;
      }
      else
      {
        this.ishidden = false;
      }
    }
    console.log(this.likeCount);
    // console.log(this.editableTweet + 'edit this');
  },
};
</script>

<style scoped>
.post {
  display: flex;

  border: 1px solid #e6ecf0;
  padding-bottom: 10px;
  margin-bottom: 10px;
  margin-top: 30px;
  padding-top: 10px;
  /* justify-content: flex-end; */
}

.post__avatar img {
  border-radius: 50%;
  height: 40px;
  width: 40px;
}
.post__body img {
  width: 450px;
  /* object-fit: contain; */
  border-radius: 20px;
}

.post__footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.post__footer img {
  height: 25px;
  width: 25px;
}
.post__badge {
  font-size: 15px !important;
  color: #4caf50;
  margin-left: auto;
}

.post__headerSpecial {
  font-weight: 600;
  font-size: 12px;
  color: gray;
}

.post__headerText h3 {
  display: flex;
  font-size: 15px;
  margin-bottom: 5px;
}

.post__headerDescription {
  margin-bottom: 10px;
  font-size: 15px;
  width: 100%;
}
.post__headerDescription button {
  outline: "none";
  border: none;
  background-color: #50b7f5;
  color: white;
  border-radius: 30px;
  margin-left: 5px;
}
.post__headerDescription textarea {
  width: 130%;
  border: none;
  outline: none;
  color: #5e5e61;
  font-weight: 400;
  overflow: hidden;
}

.post__body {
  min-width: 450px;
}

.post__avatar {
  padding: 20px;
}
.dropdown {
  /* position: relative; */
  /* justify-content: end; */
  margin-left: auto;
}
.dropdown-item {
  cursor: pointer;
}
.time {
  font-size: small;
  color: grey;
  margin-top: inherit;
}
.post__footer button {
  border: none;
  background-color: white;
  margin: 0px 0px;
}
.allcomment {
  background-color: white;
  color: black;
}
.allcomment:hover {
  text-decoration: underline;
}
.commentbutton {
  display: flex;
  justify-content: space-between;
}
</style>
