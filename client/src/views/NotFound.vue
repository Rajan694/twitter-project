<template>
  <section class="page_404">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="four_zero_four_bg">
            <h1 class="text-center">404</h1>
          </div>

          <div class="contant_box_404">
            <h3 class="h2">Look like you're lost</h3>

            <p>the page you are looking for not avaible!</p>
            <router-link :to="'/'">
              <p class="link_404">Go to Home</p></router-link
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style scoped>
.page_404 {
  padding: 40px 0;
  background: #fff;
  font-family: "Arvo", serif;
}
.container {
  align-items: center;
  text-align: center;
}
.page_404 img {
  width: 100%;
}

.four_zero_four_bg {
  background-image: url(../assets/dribbble_1.gif);
  height: 400px;
  background-position: center;
}

.four_zero_four_bg h1 {
  font-size: 80px;
}

.four_zero_four_bg h3 {
  font-size: 80px;
}

.link_404 {
  color: #fff !important;
  padding: 10px 20px;
  background: #50b7f5;
  margin: 20px 0;
  display: inline-block;
  border-radius: 10px;
}
.contant_box_404 {
  margin-top: -50px;
}
</style>
