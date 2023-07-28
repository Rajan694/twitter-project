<template>
  <div class="container rounded bg-white mt-5 mb-5">
    <div class="row">
      <div class="col-md-3 border-right">
        <div class="d-flex flex-column align-items-center text-center p-3 py-5">
          <img :src="image" class="rounded-circle mt-5" name="profileImage" />
          <span
            ><button type="button" class="btn btn-link" @click="showUpload">
              Change profile photo
            </button>
            <div>
              <input
                type="file"
                id="newimage"
                @change="fileChange"
                name="fileInput"
              />
            </div>
          </span>
        </div>
      </div>
      <div class="col-md-5 border-right">
        <div class="p-3 py-5">
          <router-link to="/profilepage">
            <i class="fa fa-arrow-left" id="fa-arrow-left"></i>
          </router-link>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-right">Profile Settings</h4>
          </div>

          <div class="col-md-12">
            <label class="labels">User Name</label
            ><input
              type="text"
              class="form-control"
              placeholder="Username.."
              :value="currUser.username"
              disabled
            />
          </div>

          <div class="col-md-12">
            <label class="labels">Display name</label
            ><input
              type="text"
              class="form-control"
              placeholder="Display name"
              v-model="currUser.displayname"
              required
            />
          </div>
          <div class="col-md-12">
            <label class="labels">Email Id</label
            ><input
              type="text"
              class="form-control"
              placeholder="Email Id"
              :value="currUser.email"
              disabled
            />
          </div>
          <!-- <div class="col-md-12">
            <label class="labels">Date of Birth</label
            ><input type="date" class="form-control" :value="currUser.dob" disabled />
          </div> -->
          <div class="col-md-12">
            <label class="labels">Gender</label>
            <input
              type="text"
              class="form-control"
              placeholder=""
              v-model="currUser.gender"
              disabled
            />
          </div>
          <div class="col-md-12">
            <label class="labels">Bio</label>
            <textarea
              type="text"
              style="flex: 1; overflow: hidden; outline: none"
              class="form-control"
              placeholder=""
              v-model="currUser.bio"
              maxlength="300"
            ></textarea>
          </div>
          <div class="row mt-3">
            <div class="col-md-10">
              <label class="labels">Password</label
              ><input
                class="form-control"
                placeholder="Password"
                v-bind:type="showPassword ? 'text' : 'password'"
                v-model="currUser.password"
              />
            </div>
            <div class="col-md-2">
              <label class="labels"></label
              ><button
                class="form-control"
                v-on:click="showPassword = !showPassword"
              >
                <i
                  v-bind:class="
                    showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                  "
                ></i>
              </button>
            </div>
          </div>
          <div class="mt-5 text-center">
            <button
              class="btn btn-primary profile-button"
              type="submit"
              @click="confirmEdit"
            >
              Save Profile
            </button>
            <div
              class="alert alert-info"
              style="display: none; margin-top: 40px"
              id="editResult"
              role="alert"
            >
              {{ response }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3 border-right">
        <div class="d-flex flex-column align-items-center text-center p-3 py-5">
          <img
            :src="image1"
            style="width: 300px; height: 150px"
            class="rounded mt-5"
            name = "coverImage"
          />

          <span
            ><button type="button" class="btn btn-link" @click="showUpload1">
              Change Background photo
            </button>
            <div>
              <input
                type="file"
                id="newimage1"
                @change="fileChange1"
                name="fileInput"
              />
            </div>
            <!-- <button @click = 'changeBackground()'>Upload</button> -->
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { authenticate } from "../services/AuthenticateUserLogin.js";
import { setToken, clearToken } from "../services/TokenServices.js";
export default {
  name: "EditProfile",
  data() {
    return {
      showPassword: false,
      image: "",
      file: "",
      image1: "",
      file1: "",
      showFile: false,
      id: "",
      currUser: "",
      response: "",
    };
  },
  methods: {
    fileChange(e) {
      this.file = e.target.files[0];

      this.image = URL.createObjectURL(this.file);

      console.log(this.file);
      console.log(this.image);
    },
    fileChange1(e) {
      this.file1 = e.target.files[0];
      this.image1 = URL.createObjectURL(this.file1);
      console.log(this.file1);
      console.log(this.image1);
    },

    getImage(url) {
      try {
        return require("../assets/images/" + url);
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


    showUpload() {
      document.getElementById("newimage").click();
    },
    showUpload1() {
      document.getElementById("newimage1").click();
    },

    
    changeBackground(){
      const url = 'http://localhost:3300/trial/user/background/' + JSON.stringify(this.currUser.userid);
    
      console.log(url);
      let formdata = new FormData();
      let tokenName = '';
      if(this.currUser.userid.includes('am'))
      {
        tokenName = 'admin';
      }
      else
      {
        tokenName = 'users';
      }
      formdata.append('coverImage', this.file1);
             axios
          .post(url, formdata)
          .then((response) => {
            if (response.status == 200) {
              this.response = response.data;
  
              // getting the updated data:
              const newData =
                "http://localhost:3300/trial/auser/" +
                JSON.stringify(this.currUser.userid);
              axios
                .get(newData)
                .then((response) => {
                  if (response.status == 200) {
                    this.currUser = response.data[0];
                    this.currUser.role = tokenName;
                    console.log(this.currUser);
                    clearToken(tokenName);
                    setToken(JSON.stringify(this.currUser), tokenName);
                    document.getElementById("editResult").style.display = "block";
                    setTimeout(() => {
                      this.$router.push("/profilepage");
                    }, 2000);
                  } else {
                    this.$router.push("/");
                  }
                })
                .catch((error) => {
                  console.log("some error occured." + error);
                  this.$router.push("/login");
                });
            } else {
              this.response = response.data;
            }
          })
    },


    confirmEdit() {
      if(this.file1)
      {
        this.changeBackground();
      }
      
        console.log(this.currUser);
        const url =
          "http://localhost:3300/trial/user/edit/" +
          JSON.stringify(this.currUser.userid);
  
        let formData = new FormData();
  
        let tokenName = '';
        if(this.currUser.userid.includes('am'))
        {
          tokenName = 'admin';
        }
        else
        {
          tokenName = 'users';
        }
  
        formData.append("user", JSON.stringify(this.currUser));
        formData.append("profileImage", this.file);
        // formData.append("images", this.file1);
        for (var pair of formData.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }
        axios
          .post(url, formData)
          .then((response) => {
            if (response.status == 200) {
              this.response = response.data;
  
              // getting the updated data:
              const newData =
                "http://localhost:3300/trial/auser/" +
                JSON.stringify(this.currUser.userid);
              axios
                .get(newData)
                .then((response) => {
                  if (response.status == 200) {
                    this.currUser = response.data[0];
                    console.log(this.currUser);
                    this.currUser.role = tokenName;
                    clearToken(tokenName);
                    setToken(JSON.stringify(this.currUser), tokenName);
                    document.getElementById("editResult").style.display = "block";
                    setTimeout(() => {
                      this.$router.push("/profilepage");
                    }, 2000);
                  } else {
                    this.$router.push("/");
                  }
                })
                .catch((error) => {
                  console.log("some error occured." + error);
                  this.$router.push("/login");
                });
            } else {
              this.response = response.data;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      
      
    },
  },
  created() {
    // console.log(this.$route.params.id);
    this.id = this.$route.params.id;
    this.currUser = JSON.parse(authenticate("users")) || JSON.parse(authenticate('admin'));
    if (this.currUser == null || this.currUser.userid != this.id) {
      this.$router.push("/login");
    }

    this.image = this.getImage(this.currUser.profile_image);
    this.image1 = this.getBackground(this.currUser.cover_image);

  },
};
</script>

<style scoped>
body {
  background: #26a1ee;
}
#fa-arrow-left {
  color: #50b7f5;
  filter: brightness(70%);
  font-size: 20px;
  padding: 20px 20px 20px 10px;
  cursor: pointer;

  border-radius: 7%;
}
#fa-arrow-left:hover {
  background-color: rgba(255, 255, 255, 0.932);
}
.form-control:focus {
  box-shadow: none;
  border-color: #26a1ee;
}
img.rounded-circle.mt-5 {
  width: 150px;
  height: 150px;
}
.profile-button {
  background: #26a1ee;
  box-shadow: none;
  border: none;
}

.profile-button:hover {
  background: #88d0fd;
}

.profile-button:focus {
  background: #ffffff;
  box-shadow: none;
  color: black;
  border: 1px solid #000000;
}

.profile-button:active {
  background: #682773;
  box-shadow: none;
}

.back:hover {
  color: #682773;
  cursor: pointer;
}

.labels {
  font-size: 11px;
}

#newimage {
  display: none;
}
#newimage1 {
  display: none;
}
</style>
