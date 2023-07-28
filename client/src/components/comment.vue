<template>
  <div class="comment">
    <div class="comment__avatar">
      <img :src="getImage(comment.profile_image)" alt="" />
    </div>
    <div class="comment__body">
      <div class="comment__header">
        <i class="fas fa-solid fa-ellipsis-vertical"></i>
        <div class="comment__headerText">
          <h3>
            <!-- {{ tweet.username }} -->
            <a
              :href="'http://localhost:8080/profilepage/' + comment.userid"
              style="text-decoration: none; color: black"
            >
              {{ comment.username }}
            </a>
            <!-- Usernames -->
            <span class="comment__headerSpecial"
              ><span class="material-icons comment__badge"> verified </span>
              <!-- @{{tweet.displayname}} -->
              <!-- @displayname -->
              {{ comment.displayname }}
            </span>
          </h3>
        </div>
        <div class="comment__headerDescription">
          <p
            style="min-width: 370px; max-width: 370px; word-wrap: break-word"
            v-if="!allowEdit"
          >
            <!-- {{ tweet.content }} -->
            {{ comment.comment }}
            <!-- comment -->
          </p>
          <textarea
            v-else
            type="text"
            style="overflow: hidden; min-width: 370px"
            class="form-control"
            maxlength="100"
            id="comment"
            v-model="newComment.comment"
            placeholder="Say something..."
          ></textarea>

          <p class="text-center text-danger">{{ commentError }}</p>
          <div v-if="user.userid == comment.userid">
            <span
              class="material-icons"
              v-if="!allowEdit"
              @click="showComment()"
              style="cursor: pointer"
              >edit</span
            >
            <span
              class="material-icons"
              style="cursor: pointer; color: green"
              v-else
              @click="editComment()"
              >check</span
            >
            <span
              class="material-icons"
              style="cursor: pointer; color: rgb(197, 4, 4)"
              @click="deleteComment()"
              >delete_outline</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "CommentBox",
  props: ["comment", "user"],

  data() {
    return {
      newComment: "",
      allowEdit: false,
      commentError: "",
    };
  },
  methods: {
    getImage(url) {
      try {
        return require("../assets/images/" + url);
      } catch {
        return require("../assets/images/default.jpeg");
      }
    },

    showComment() {
      this.allowEdit = !this.allowEdit;
    },

    editComment() {
      console.log(this.newComment);
      if (this.newComment.comment.length == 0) {
        this.commentError = "comment cannot be empty";
      } else {
        this.showComment();
        const url =
          "http://localhost:3300/trial/editComment/" +
          this.newComment.commentid;
        axios
          .post(url, this.newComment)
          .then((response) => {
            console.log(response.data);
            if (response.status == 200) {
              console.log("updated");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    deleteComment() {
      console.log("comment to be deleted - " + this.comment.commentid);
      this.$emit("deleteComment");
    },
  },
  created() {
    // console.log(this.comment);
    this.newComment = this.comment;
    // console.log(this.newComment);
    // console.log(this.user);
  },
};
</script>

<style scoped>
.comment {
  display: flex;

  border: 1px solid #e6ecf0;
  padding-bottom: 10px;
  margin-bottom: 10px;
  /* margin-top: 30px; */
  padding-top: 10px;
  /* justify-content: flex-end; */
}
.comment__avatar {
  padding-left: 5px;
}
.comment__avatar img {
  border-radius: 50%;
  height: 40px;
  width: 40px;
}
.comment__body img {
  width: 400px;
  /* object-fit: contain; */
  border-radius: 20px;
}
.comment__badge {
  font-size: 14px !important;
  color: #4caf50;
  margin-right: 5px;
}
.comment__header {
  display: grid;
}
.comment__headerSpecial {
  font-weight: 600;
  font-size: 12px;
  color: gray;
}

.comment__headerText h3 {
  font-size: 15px;
  margin-bottom: 5px;
}

.comment__headerDescription {
  display: flex;

  font-size: 15px;
}

.comment__body {
  padding: 10px;
  min-width: 400px;
}
</style>
