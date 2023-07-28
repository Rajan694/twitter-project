<template>
  <section class="vh-100" style="background-color: #eee">
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-lg-12 col-xl-11">
          <div
            class="card text-black"
            style="border-radius: 25px; background-color: #6793b8"
          >
            <div class="card-body p-md-5">
              <div class="row justify-content-center">
                <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                  <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                    Admin Login
                  </p>

                  <form class="mx-1 mx-md-4">
                    <div class="d-flex flex-row align-items-center mb-4">
                      <i class="fas fa-envelope fa-lg fa-fw"></i>
                      <div class="form-outline flex-fill mb-0">
                        <input
                          type="email"
                          id="email"
                          class="form-control"
                          placeholder="Email address.."
                          v-model="email"
                          style="margin-left: 2.5px"
                        />
                      </div>
                    </div>

                    <div class="d-flex flex-row align-items-center mb-4">
                      <i class="fas fa-lock fa-lg fa-fw"></i>

                      <div class="form-outline flex-fill mb-0">
                        <input
                          v-bind:type="showPassword ? 'text' : 'password'"
                          id="password"
                          class="form-control"
                          v-model="password"
                          placeholder="Password.."
                          @keyup.enter="login"
                          style="margin-left: 2.5px"
                        />
                      </div>
                      <i
                        class="fa-lg fa-lg aankh"
                        v-on:click="showPassword = !showPassword"
                        v-bind:class="
                          showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                        "
                      ></i>
                    </div>

                    <div class="text-center text-danger">
                      {{ errorMsg }}
                    </div>
                    <div
                      class="d-flex justify-content-center mx-4 mb-3 mb-lg-4"
                    >
                      <button
                        type="button"
                        @click="login"
                        class="btn btn-primary btn-lg"
                      >
                        Login
                      </button>
                    </div>
                  </form>
                </div>
                <div
                  class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2"
                  style="overflow: hidden"
                >
                  <img
                    src="../assets/twitter.jpeg"
                    class="img-fluid"
                    style="width: 1200px; height: 350px"
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
import { setToken } from "../services/TokenServices.js";
import axios from "axios";
export default {
  name: "HomeView",
  data: () => {
    return {
      showPassword: false,
      email: "",
      password: "",
      errorMsg: "",
    };
  },
  methods: {
    fileChange(e) {
      this.file = e.target.files[0];
      this.image = URL.createObjectURL(this.file);
      console.log(this.file);
      console.log(this.image);
    },
    login() {
      //   console.log("logging in the user");
      if (this.email == "" || this.password == "") {
        this.errorMsg = "Please enter the credentials";
      } else {
        const data = {
          email: this.email,
          password: this.password,
        };
        const url = "http://localhost:3300/trial/admin/login";
        // console.log(data);
        axios
          .post(url, data)
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              response.data.role = "admin";
              setToken(JSON.stringify(response.data), "admin");
              this.$router.push("/");
            } else if (response.status == 203) {
              this.errorMsg = response.data;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
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
