<template>
  <!-- <div class="home"> -->
  <!-- <img alt="Vue logo" :src = 'image'>
    <input type="file" @change = "fileChange">
    <button>submit</button>
  </div> -->

  <section class="vh-200" style="background-color: #eee">
    <div class="container h-200">
      <div class="row d-flex justify-content-center align-items-center h-200">
        <div class="col-lg-12 col-xl-11">
          <div
            class="card text-black"
            style="border-radius: 25px; background-color: #6793b8"
          >
            <div class="card-body p-md-5">
              <div class="row justify-content-center">
                <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                  <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                    Sign up
                  </p>

                  <form
                    class="mx-1 mx-md-4"
                    enctype="multipart/form-data"
                    @submit.prevent="signup"
                  >
                    <div class="d-flex flex-row align-items-center mb-4">
                      <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                      <div class="form-outline flex-fill mb-0">
                        <input
                          type="text"
                          id="username"
                          v-model="username"
                          class="form-control"
                          placeholder="Username.."
                          style="margin-left: 2.5px"
                        />
                        <!-- <label class="form-label" for="form3Example1c">Your Name</label> -->
                      </div>
                    </div>

                    <div class="d-flex flex-row align-items-center mb-4">
                      <!-- <i class="fas fa-user fa-lg me-3 fa-fw"></i> -->
                      <i
                        class="fas fa-solid fa-address-card fa-lg me-3 fa-fw"
                      ></i>
                      <!-- <font-awesome-icon icon="fa-sharp fa-solid fa-address-card" /> -->
                      <!-- <i class="fa fa-address-card-o"></i> -->

                      <div class="form-outline flex-fill mb-0">
                        <input
                          type="text"
                          id="displayname"
                          v-model="displayname"
                          class="form-control"
                          placeholder="Display Name.."
                          style="margin-left: 2.5px"
                        />
                        <!-- <label class="form-label" for="form3Example1c">Your Name</label> -->
                      </div>
                    </div>

                    <div class="d-flex flex-row align-items-center mb-4">
                      <i class="fas fa-envelope fa-lg me-3 fa-fw"></i>
                      <div class="form-outline flex-fill mb-0">
                        <input
                          type="email"
                          id="email"
                          class="form-control"
                          placeholder="Email address.."
                          v-model="email"
                          style="margin-left: 2.5px"
                        />
                        <!-- <label class="form-label" for="form3Example3c">Your Email</label> -->
                      </div>
                    </div>

                    <div class="d-flex flex-row align-items-center mb-4">
                      <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                      <div class="form-outline flex-fill mb-0">
                        <input
                          v-bind:type="showPassword1 ? 'text' : 'password'"
                          id="password"
                          class="form-control"
                          v-model="password"
                          placeholder="Password.."
                          style="margin-left: 2.5px"
                        />
                        <!-- <label class="form-label" for="form3Example4c">Password</label> -->
                      </div>
                      <i
                        class="fa-lg fa-lg aankh"
                        v-on:click="showPassword1 = !showPassword1"
                        v-bind:class="
                          showPassword1 ? 'fas fa-eye-slash' : 'fas fa-eye'
                        "
                      ></i>
                    </div>

                    <div class="d-flex flex-row align-items-center mb-4">
                      <i class="fas fa-key fa-lg me-3 fa-fw"></i>
                      <div class="form-outline flex-fill mb-0">
                        <input
                          v-bind:type="showPassword2 ? 'text' : 'password'"
                          id="cpassword"
                          v-model="cpassword"
                          class="form-control"
                          placeholder="Confirm Password.."
                          style="margin-left: 2.5px"
                          @input="validateForm"
                        />
                        <!-- <label class="form-label" for="form3Example1c">Your Name</label> -->
                      </div>
                      <i
                        class="fa-lg fa-lg aankh"
                        v-on:click="showPassword2 = !showPassword2"
                        v-bind:class="
                          showPassword2 ? 'fas fa-eye-slash' : 'fas fa-eye'
                        "
                      ></i>
                    </div>
                    <p v-if="errorMessage" class="text-center text-danger">
                      {{ errorMessage }}
                    </p>
                    <div class="d-flex flex-row align-items-center mb-4">
                      <!-- <i class="fas fa-key fa-lg me-3 fa-fw"></i> -->
                      <i
                        class="fas fa-solid fa-venus-mars fa-lg me-3 fa-fw"
                      ></i>
                      <div class="form-outline flex-fill mb-0">
                        <!-- <input type="password" id="cpassword" v-model = 'cpassword' class="form-control" placeholder = 'Confirm Password..' /> -->
                        <select
                          class="form-select"
                          v-model="gender"
                          style="margin-left: 2.5px"
                        >
                          <option value="" disabled>Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Others">Other</option>
                        </select>
                        <!-- <label class="form-label" for="form3Example1c">Your Name</label> -->
                      </div>
                    </div>

                    <!-- for dob functionality -->

                    <!-- <div class="d-flex flex-row align-items-center mb-4">
                      <div class="form-outline flex-fill mb-0">
                        
                        <i class="fas fa-calendar fa-lg me-3 fa-fw"></i>
                        <input
                          type="date"
                          id="dob"
                          class="form-control"
                          style="
                            margin-left: 45px;
                            width: 89%;
                            margin-top: -28px;
                          "
                          v-model="dob"
                          placeholder="Date of Birth.."
                        />
                        
                      </div>
                    </div> -->

                    <div class="d-flex flex-row align-items-center mb-4">
                      <div class="form-outline flex-fill mb-0">
                        <!-- <i class="fas fa-key fa-lg me-3 fa-fw"></i> -->
                        <i class="fas fa-solid fa-image fa-lg fa-fw me-3"></i>

                        <input
                          type="file"
                          id="userimage"
                          ref="fileInput"
                          class="form-control"
                          style="
                            margin-left: 45px;
                            width: 89%;
                            margin-top: -28px;
                          "
                          @change="fileChange"
                          name="fileImages"
                          placeholder="Profile Image..."
                        />

                        <div class="text-center">
                          <img
                            :src="image"
                            style="margin-top: 10px; max-width: 150px"
                            alt=""
                          />
                        </div>
                        <!-- <label class="form-label" for="form3Example4cd">Repeat your password</label> -->
                      </div>
                    </div>

                    <div class="form-check d-flex justify-content-center mb-5">
                      <input
                        class="form-check-input me-2"
                        type="checkbox"
                        value=""
                        id="form2Example3c"
                        @keyup.enter="signup"
                        v-model="checkone"
                      />
                      <label class="form-check-label" for="form2Example3">
                        I agree all statements in Terms of service
                      </label>
                    </div>

                    <div class="d-flex justify-content-center mx-4 mb-3">
                      <button
                        :disabled="!checkone"
                        type="submit"
                        class="btn btn-primary btn-lg"
                      >
                        Register
                      </button>
                    </div>
                  </form>
                  <router-link to="/login" class="text-center"
                    >Already Registered? Login</router-link
                  >
                </div>
                <div
                  class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2"
                  style="overflow: hidden"
                >
                  <img
                    src="../assets/twitter.jpeg"
                    class="img-fluid"
                    style="width: 1200px; height: 450px; margin-top: -100px"
                    alt="Sample image"
                    draggable="false"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import { authenticate } from "../services/AuthenticateUserLogin.js";
// import { setToken } from '../services/TokenServices.js';
import axios from "axios";
export default {
  name: "HomeView",
  data: () => {
    return {
      showPassword1: false,
      showPassword2: false,
      image: null,
      file: "",
      username: "",
      displayname: "",
      gender: "",
      dob: "",
      email: "",
      password: "",
      cpassword: "",
      errorMessage: "",
      checkone: false,
    };
  },
  methods: {
    fileChange(e) {
      this.file = e.target.files[0];
      this.image = URL.createObjectURL(this.file);
      console.log(this.file);
      console.log(this.image);
      // this.images.push(this.file)
    },

    validateForm() {
      if (this.password !== this.cpassword) {
        this.errorMessage = "Passwords do not match";
        return false;
      }
      this.errorMessage = "";
      return true;
    },

    signup() {
      // checking if the email is available or not.
      const checkEmail = "http://localhost:3300/trial/user/check";
      const emailData = {
        email: this.email,
      };
      axios
        .post(checkEmail, emailData)
        .then((response) => {
          console.log(response.data);
          if (response.status == 200) {
            console.log("submitting the form");

            const data = {
              username: this.username,
              displayname: this.displayname,
              email: this.email,
              password: this.password,
              gender: this.gender,
              dob: this.dob,
              image: this.file,
            };

            console.log(data);

            let formData = new FormData();

            formData.append("info", JSON.stringify(data));
            for (let i = 0; i < this.$refs.fileInput.files.length; i++) {
              const file = this.$refs.fileInput.files[i];
              console.log(file);
              formData.append("images", file);
            }
            for (var pair of formData.entries()) {
              console.log(pair[0] + ", " + pair[1]);
            }
            console.log(formData);
            const url = "http://localhost:3300/trial/user/signup";
            axios
              .post(url, formData)
              .then((response) => {
                console.log(response.data);
                if (response.status == 200) {
                  // setTimeout()
                  this.$router.push("/login");
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else if (response.status == 203) {
            this.errorMessage = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.user = authenticate();
    if (this.user != null) {
      this.$router.push("/");
    }
  },
};
</script>
<style scoped>
.aankh {
  background-color: white;
  padding: 10px 5px;
  margin-left: 5px;
  border-radius: 0.375rem;
}
.img-fluid {
  transition: transform 0.4s;
  border-radius: 25px;
}
.img-fluid:hover {
  transform: scale(1.1);
}
</style>
