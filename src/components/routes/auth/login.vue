<template>
  <!-- Form -->
  <b-form @submit="handleSubmit">
    <!-- Title -->
    <div class="mb-7">
      <h2 class="h3 text-primary font-weight-normal mb-0">Welcome <span class="font-weight-semi-bold">back</span></h2>
      <p>Login to manage your account.</p>
    </div>
    <!-- End Title -->

    <!-- Form Group -->
    <div class="js-form-message form-group">
      <b-form-group>
        <label class="form-label">
          Username
        </label>
        <b-form-input
          v-model="form.username"
          type="text"
          placeholder="Username"
          required
          class="form-control"
        ></b-form-input>
      </b-form-group>
    </div>
    <!-- End Form Group -->

    <!-- Form Group -->
    <div class="js-form-message form-group">
      <b-form-group>
        <label class="form-label">
          <span class="d-flex justify-content-between align-items-center">
            Password
            <b-link class="link-muted text-capitalize font-weight-normal" to="forgot-password">Forgot Password?</b-link>
          </span>
        </label>
        <b-form-input
          v-model="form.password"
          type="password"
          placeholder="********"
          required
          class="form-control"
        ></b-form-input>
      </b-form-group>
    </div>
    <!-- End Form Group -->

    <!-- Button -->
    <div class="row align-items-center mb-5">
      <div class="col-6">
        <span class="small text-muted">Don't have an account? </span>
        <b-link class="small" to="signup">Signup</b-link>
      </div>

      <div class="col-6 text-right">
        <b-button type="submit" class="btn btn-primary transition-3d-hover" variant="primary" >Get Started</b-button>
      </div>
    </div>
    <!-- End Button -->
  </b-form>
  <!-- End Form -->
</template>

<script>
import api from '@/api';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
    };
  },
  computed: {
    ...mapState({
      users: state => state.users.items,
    }),
  },
  methods: {
    handleSubmit(evt) {
      evt.preventDefault();
      api.postSignIn(this.form)
        .then((res) => {
          console.log(res); // eslint-disable-line no-console
          const getUserUuid = (currentUserName) => {
            const userUuid = this.users.find(u => u.subjectname === currentUserName) || {};
            return userUuid.uuid;
          };
          document.cookie = `abyss.session=${res.data.sessionid}; abyss.principal.uuid=${getUserUuid(res.data.username)}`;
          console.log(document.cookie);  // eslint-disable-line no-console
          // console.log(getUserUuid(res.data.username)); // eslint-disable-line no-console
        })
        .then(() => {
          this.$router.push('/app/dashboard');
        })
        // .then(() => {
        //   // check user cookie
        //   const userUuid = document.cookie.split('; ').filter((cookie) => {
        //     const [name] = cookie.split('=');
        //     return name === 'abyss.principal.uuid';
        //   }).map(cookie => cookie.split('=')[1]);
        //   if (userUuid.length > 0) {
        //     this.$store.commit('user/setUuid', userUuid[0]);
        //   } else {
        //     this.$store.commit('user/setUserUnauthorized', true);
        //   }
        // })
        .catch((error) => {
          console.log(error); // eslint-disable-line no-console
        });
    },
  },
  created() {
    this.$store.dispatch('users/getUsers', {});
  },
};
</script>
<style lang="scss" scoped>
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
</style>
