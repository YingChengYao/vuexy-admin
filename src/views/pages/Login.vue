<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="h-screen flex w-full vx-row items-center justify-center" id="page-login">
    <img class="img-left" src="@/assets/images/pages/vuexy-login-bg-left.png" />
    <div
      class="sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-2/3 sm:m-0 m-4 flex justify-between"
      style="z-index:99;"
    >
      <vx-card class="border-radius-size">
        <div slot="no-body" class="full-page-bg-color border-radius-size">
          <div
            class="vx-row no-gutter flex justify-center items-center d-theme-dark-bg border-radius-size"
          >
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
              <div class="mx-16">
                <div class="vx-card__title mt-8 flex justify-center">
                  <h4 class="mb-4 text-success">登陆账号</h4>
                </div>
                <div>
                  <vs-input
                    label="用户名"
                    v-validate="'required'"
                    data-vv-validate-on="blur"
                    icon-no-border
                    icon="icon icon-user"
                    icon-pack="feather"
                    v-model="username"
                    class="w-full"
                    name="用户名"
                  />
                  <span class="text-danger text-sm">{{ errors.first('用户名') }}</span>

                  <vs-input
                    label="密码"
                    v-validate="'required'"
                    data-vv-validate-on="blur"
                    icon-no-border
                    icon="icon icon-lock"
                    icon-pack="feather"
                    v-model="password"
                    type="password"
                    name="密码"
                    class="w-full"
                    style="margin-top:1rem"
                  />
                  <span class="text-danger text-sm">{{ errors.first('密码') }}</span>
                </div>
                <!-- sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-2/3 sm:m-0  -->
                <vs-row class="my-5 flex">
                  <vs-col class="flex-1 pr-4">
                    <vs-input
                      style="width:100%"
                      v-validate="'required'"
                      data-vv-validate-on="blur"
                      icon-no-border
                      icon="icon icon-lock"
                      icon-pack="feather"
                      v-model="captcha"
                      name="验证码"
                    />
                    <span class="text-danger text-sm">{{ errors.first('验证码') }}</span>
                  </vs-col>
                  <vs-col class="flex-1" vs-type="flex" vs-justify="flex-end">
                    <!-- <img style="height:38px" src="@/assets/images/logo/logo.png" alt="vuexy-logo" /> -->
                    <img
                      class="flex-1"
                      style="height:38px;"
                      :src="loginCode"
                      alt="vuexy-logo"
                      @click="codeImg"
                    />
                  </vs-col>
                </vs-row>

                <div style="margin-top:1rem;">
                  <div class="flex flex-wrap justify-center items-center my-5">
                    <vs-button :disabled="!validateForm" @click="handleLogin">登录</vs-button>
                    <!-- <router-link to="/pages/forgot-password">Forgot Password?</router-link> -->
                  </div>
                </div>
                <!-- <div class="flex flex-wrap justify-center items-center my-5">
                  <router-link to="/pages/forgot-password">Forgot Password?</router-link>
                </div>-->

                <!-- <div style="margin-top:1rem;position:absolute;bottom:0;right: 0;left: 0;">
                  <div class="flex flex-wrap justify-between items-center my-5">
                    <vs-button :disabled="!validateForm" @click="handleLogin">登录</vs-button>
                    <router-link to="/pages/forgot-password">Forgot Password?</router-link>
                  </div>
                </div>-->

                <div class="social-login-buttons flex flex-wrap items-center mt-4"></div>
              </div>
              <!-- </div> -->
            </div>
            <!-- <div class="vx-col hidden lg:block lg:w-1/2"> -->
            <!-- <img
              src="@/assets/images/pages/login.png"
              style="width:450px;height:auto"
              alt="login"
              class="mx-auto hidden lg:block lg:w-1/2 border-radius-size"
            />-->
            <img
              src="@/assets/images/pages/login.png"
              style="width:450px;height:auto"
              alt="login"
              class="mx-auto hidden lg:block lg:w-1/2 border-radius-size"
            />
            <!-- </div> -->
          </div>
        </div>
      </vx-card>
    </div>
    <!-- <div class="bg-img-right right"></div> -->
    <img class="img-right" src="@/assets/images/pages/vuexy-login-bg-right.png" />
    <!-- <img class="img-right" src="http://manage.qrtj.cn/api/mix/code??width=100&height=40" /> -->
  </div>
</template>

<script>
import "@/common/global";
import md5 from "@/common/utils/data/md5";
export default {
  data() {
    return {
      username: "",
      password: "",
      captcha: "",
      loginCode: "",
    };
  },
  computed: {
    validateForm() {
      return !this.errors.any() && this.username !== "" && this.password !== "";
    },
  },
  created() {
    this.codeImg();
  },
  methods: {
    checkLogin() {
      if (this.$store.state.auth.isUserLoggedIn()) {
        this.$vs.notify({
          title: "Login Attempt",
          text: "You are already logged in!",
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "warning",
        });

        return false;
      }
      return true;
    },
    handleLogin() {
      if (!this.checkLogin()) return;

      this.$vs.loading();

      const payload = {
        userDetails: {
          loginName: this.username,
          password: md5(this.password),
          code: this.captcha,
        },
      };

      this.$store
        .dispatch("auth/login", payload)
        .then(() => {
          this.$vs.loading.close();
        })
        .catch((error) => {
          this.$vs.loading.close();
          this.codeImg();
          // this.$vs.notify({
          //   title: "错误提示",
          //   text: error.message,
          //   iconPack: "feather",
          //   icon: "icon-alert-circle",
          //   color: "danger",
          // });
        });
    },
    codeImg() {
      let timestamp = new Date().getTime();
      this.loginCode =
        global.baseURL + "/api/mix/code?width=160&timestamp=" + timestamp;
    },
  },
};
</script>

<style lang="scss">
#page-login {
  .social-login-buttons {
    .bg-facebook {
      background-color: #1551b1;
    }
    .bg-twitter {
      background-color: #00aaff;
    }
    .bg-google {
      background-color: #4285f4;
    }
    .bg-github {
      background-color: #333;
    }
  }
  .border-radius-size {
    border-radius: 1.5rem;
  }
}
.login-tabs-container {
  min-height: 400px;
}
</style>
