<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div
    class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center"
    id="page-login"
  >
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-1/2 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row no-gutter justify-center items-center">
            <div class="vx-col hidden lg:block lg:w-1/2">
              <img src="@/assets/images/pages/login.png" alt="login" class="mx-auto" />
            </div>

            <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
              <div class="p-8 pt-8 login-tabs-container">
                <div class="vx-card__title mb-8">
                  <h4 class="mb-4">Login</h4>
                  <p>Welcome back, please login to your account.</p>
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

                  <!-- <div>
                    <vs-input
                      label="验证码"
                      v-validate="'required'"
                      data-vv-validate-on="blur"
                      icon-no-border
                      icon="icon icon-lock"
                      icon-pack="feather"
                      v-model="captcha"
                      type="password"
                      name="验证码"
                      style="margin-top:1rem"
                    />
                    <span class="text-danger text-sm">{{ errors.first('验证码') }}</span>
                    <img
                      data-v-25e7a899
                      src="http://180.76.174.156:8888/base/captcha/pwOI4vGNZTP7wgxhD7TJ.png"
                      alt="请输入验证码"
                    />
                  </div> -->

                  <div class="flex flex-wrap justify-between my-5" style="margin-top:1rem">
                    <vs-button class="float-right" :disabled="!validateForm" @click="handleLogin">登录</vs-button>
                  </div>

                  <div class="social-login-buttons flex flex-wrap items-center mt-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      captcha: ""
    };
  },
  computed: {
    validateForm() {
      return !this.errors.any() && this.username !== "" && this.password !== "";
    }
  },
  methods: {
    checkLogin() {
      if (this.$store.state.auth.isUserLoggedIn()) {
        this.$vs.notify({
          title: "Login Attempt",
          text: "You are already logged in!",
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "warning"
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
          username: this.username,
          password: this.password
        }
      };

      this.$store
        .dispatch("auth/login", payload)
        .then(() => {
          this.$vs.loading.close();
        })
        .catch(error => {
          this.$vs.loading.close();
          this.$vs.notify({
            title: "Error",
            text: error.message,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger"
          });
        });
    }
  }
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
}
.login-tabs-container {
  min-height: 400px;
}
</style>
