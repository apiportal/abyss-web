<template>
  <!-- Form -->
  <b-form @submit="handleSubmit">
    <!-- Title -->
    <div class="mb-7">
      <h2 class="h3 text-primary font-weight-normal mb-0">Welcome <span class="font-weight-semi-bold">back</span></h2>
      <p>Login to manage your account.</p>
    </div>
    <!-- End Title -->

    <!-- Alert -->
        <Alert
          v-if="isAlertVisible"
          :text="this.alertResponse.message"
          :hideFooter="true"
          :hideHeader="true"
          :dismissable="true"
        />
    <!-- End Alert -->

    <!-- Form Group -->
    <div class="js-form-message form-group">
      <b-form-group
        :invalid-feedback="userNameInvalidFeedback"
        :state="userNameState"
      >
        <label class="form-label">
          Username
        </label>
        <b-form-input
          v-model="formLogin.username"
          type="text"
          placeholder="Username"
          :state="userNameState"
          required
          class="form-control"
          id="username"
          data-qa="formUsername"
        ></b-form-input>
      </b-form-group>
    </div>
    <!-- End Form Group -->

    <!-- Form Group -->
    <div class="js-form-message form-group">
      <b-form-group
        :invalid-feedback="passwordInvalidFeedback"
        :state="passwordState"
      >
        <label class="form-label">
          <span class="d-flex justify-content-between align-items-center">
            Password
            <b-link class="link-muted text-capitalize font-weight-normal" to="forgot-password" tabindex="5" data-qa="linkForgotPassword">Forgot Password?</b-link>
          </span>
        </label>
        <b-form-input
          v-model="formLogin.password"
          type="password"
          placeholder="********"
          :state="passwordState"
          required
          class="form-control"
          data-qa="formPassword"
        ></b-form-input>
      </b-form-group>
    </div>
    <!-- End Form Group -->

    <!-- Button -->
    <div class="row align-items-center mb-5">
      <div class="col-6">
        <span class="small text-muted">Don't have an account? </span>
        <b-link class="small" to="signup" data-qa="linkSignup">Signup</b-link>
      </div>

      <div class="col-6 text-right">
        <b-button type="submit" class="btn btn-primary transition-3d-hover" variant="primary" data-qa="btnGetStarted">Get Started <Icon v-if="isLoading" icon="spinner" spin /></b-button>
      </div>
    </div>
    <!-- End Button -->
  </b-form>
  <!-- End Form -->
</template>

<script>
import api from '@/api';
import Icon from '@/components/shared/Icon';
import Alert from '@/components/shared/Alert';
import { mapState } from 'vuex';

export default {
  components: {
    Icon,
    Alert,
  },
  data() {
    return {
      isAlertVisible: false,
      alertResponse: {
        message: '',
        moreinfo: '',
        recommendation: '',
      },
      formLogin: {
        username: '',
        password: '',
      },
    };
  },
  computed: {
    ...mapState({
      users: state => state.users.items,
      isLoading: state => state.traffic.isLoading,
    }),
    userNameState() {
      const { username } = this.formLogin;
      return username.length > 0;
    },
    userNameInvalidFeedback() {
      // const { username } = this.formLogin;
      // return (username.length === 0) ? 'Please enter username' : '';
    },
    passwordState() {
      const { password } = this.formLogin;
      return password.length >= 3;
    },
    passwordInvalidFeedback() {
      // const { password } = this.formLogin;
      // return (password.length < 3) ? 'Password must be at least 3 characters.' : '';
    },
  },
  methods: {
    handleSubmit(evt) {
      evt.preventDefault();
      api.postSignIn(this.formLogin)
        .then((response) => {
          const { principalid, sessionid, organizationid, organizationname } = response.data;
          this.$store.dispatch('user/getUser', { principalid, sessionid, organizationid, organizationname });
          setTimeout(function () { this.$router.push('/app/dashboard'); }.bind(this), 1000); // eslint-disable-line
        })
        .catch((error) => {
          this.isAlertVisible = true;
          this.alertResponse.message = error.data.usermessage;
        });
    },
  },
  mounted() {
    document.getElementById('username').focus();
  },
};
</script>
<style lang="scss" scoped>
.auth-container {
  h2 {
    margin-top: 0;
    margin-bottom: .5rem
  }
  .h3,
  h2 {
    margin-bottom: .5rem;
    font-family: inherit;
    font-weight: 300;
    line-height: 1.5;
    color: inherit
  }
  .mb-0,
  .my-0 {
    margin-bottom: 0 !important
  } 
  .mb-5,
  .my-5 {
    margin-bottom: 3rem !important
  }
  .mb-7,
  .my-7 {
    margin-bottom: 3rem !important
  }
  .text-primary {
    color: #007bff !important
  }
  .font-weight-normal {
    font-weight: 400 !important
  }
  .font-weight-semi-bold {
    font-weight: 600 !important
  }
  .form-group {
    margin-bottom: 1rem
  }
  .form-label {
    display: block;
    text-transform: uppercase;
    font-size: 80%;
    font-weight: 500
  }
  .d-flex {
    display: flex !important
  }
  .justify-content-between {
    justify-content: space-between !important
  }
  .align-items-center {
    align-items: center !important
  }
  .link-muted {
    color: #8c98a4;
    border-bottom: 1px dashed #97a4af
  }
  .text-capitalize {
    text-transform: capitalize !important
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px
  }
  .col-6 {
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px
  }
  .col-6 {
    flex: 0 0 50%;
    max-width: 50%
  }
  .small,
  small {
    font-size: 80%;
    font-weight: 400
  }
  .text-right {
    text-align: right !important
  }
  .transition-3d-hover {
    transition: all .2s ease-in-out
  }
  .form-control {
    display: block;
    width: 100%;
    height: calc(3rem + 2px) !important;
    padding: .75rem 1rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #1e2022;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #d5dae2;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out
  }

  @media (prefers-reduced-motion:reduce) {
    .form-control {
      transition: none
    }
  }

  .form-control::-ms-expand {
    background-color: transparent;
    border: 0
  }

  .form-control:focus {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 .2rem rgba(0, 123, 255, .25)
  }

  .form-control::-webkit-input-placeholder {
    color: #6c757d;
    opacity: 1
  }

  .form-control:-ms-input-placeholder {
    color: #6c757d;
    opacity: 1
  }

  .form-control::-ms-input-placeholder {
    color: #6c757d;
    opacity: 1
  }

  .form-control::placeholder {
    color: #6c757d;
    opacity: 1
  }

  .form-control:disabled,
  .form-control[readonly] {
    background-color: #e9ecef;
    opacity: 1
  }

  select.form-control:focus::-ms-value {
    color: #495057;
    background-color: #fff
  }
}
</style>
