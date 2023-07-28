<template>
  <div class="container">
    <div class="comment__avatar">
      <img
        :src="getImage(user.profile_image)"
        alt=""
      />
    </div>
    <div class="comment__headerText">
      <h3>
        <!-- {{ comment.username }} -->
        <a
          :href="'http://localhost:8080/profilepage/' + user.userid"
          style="text-decoration: none; color: black"
        >
          {{ user.username }}
        </a>
        <span class="comment__headerSpecial"
          ><span class="material-icons comment__badge"> verified </span> @{{
            user.displayname
          }}
          <!-- @displayname -->
          <!-- {{ comment.displayname }} -->
        </span>
          <!-- <button class="btn btn-danger justify-right" @click = "deleteUser(user.userid)">Delete</button> -->
      </h3>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBox",
  props: ["user"],
  created() {
    console.log(this.user);
  },
  methods: {
    getImage(url)
    {
      try{
        return require('../assets/images/' + url);
      }
      catch{
        return require('../assets/images/default.jpeg');
      }
    },
    deleteUser(email)
    {
      console.log('deleting - ' + email);
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  border: 1px solid #dde0e2;
  border-radius: 10px;
  padding: 4px;
  margin: 8px 4px;
}
.comment__avatar {
  padding-left: 5px;
  margin-right: 4px;
}
.comment__avatar img {
  border-radius: 50%;
  height: 50px;
  width: 50px;
}
.comment__badge {
  font-size: 14px !important;
  color: #4caf50;
  margin-right: 5px;
}
.comment__headerSpecial {
  font-weight: 600;
  font-size: 12px;
  color: gray;
}
.comment__headerText {
  padding-top: 5px;
  margin-left: 10px;
}
.comment__headerText h3 {
  font-size: 15px;
}
</style>
