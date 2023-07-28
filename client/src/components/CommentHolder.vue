<template>
  <div v-if="comm.length == 0" :key = 'comm'>
    <div class="alert alert-info" role="alert">
      No Comments yet...
    </div>
  </div>
  <template v-if="comm.length != 0">
    <div v-for="comment in comm" :key="comment.commentid">
      <CommentBox :comment="comment" :user = "currUser" @deleteComment = "deleteComment(comment.commentid)"/>
    </div>
  </template>
  <!-- <div>
        m sdkjfsdfksdfhsdkj skdfjsfksdhfsdkhkg
    </div> -->
</template>

<script>
import axios from 'axios';
import CommentBox from "./comment.vue";
import { getToken } from '../services/TokenServices.js';
export default {
  name: "CommentHolder",
  props: ["comments"],
  components: {
    CommentBox,
  },
  data: () => {
    return{
        currUser: '',
        comm: []
    }
  },
  methods: {
    deleteComment(id)
    {
        console.log('deleting commentid - ' + id);
        const url = 'http://localhost:3300/trial/comment/del/' + id;
        axios.get(url)
        .then(response => {
            if(response.status == 200)
            {
                this.comm = this.comm.filter(comment => comment.commentid != id);
                console.log(this.comm);
            }   
        })
        .catch(error => {
            console.log(error);
        })

    }
  },
  mounted() {
    console.log(this.comments);
    this.comm = this.comments;
    console.log(this.comm.length);
    
    // console.log(typeof(this.comments));
  },
  created(){
    // console.log('checking');
    this.currUser = JSON.parse(getToken('users')) || JSON.parse(getToken('admin'));
    if(this.currUser == null || typeof(this.currUser) == 'undefined')
    {
        this.$router.push('/login');
    }
  }
};
</script>

<style scoped></style>
