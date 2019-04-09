<template>
  <div>
  <!-- Form -->
  <b-form v-if="!this.redirect" @submit="handleSubmit">
    <!-- Title -->
    <div class="mb-7">
      <h1 class="h3 text-primary font-weight-normal mb-0">Forgot your <span class="font-weight-semi-bold">password?</span></h1>
      <p>Enter your email address below and we'll get you back on track.</p>
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
        ></b-form-input>
      </b-form-group>
    </div>
    <!-- End Form Group -->

    <!-- Button -->
    <div class="row align-items-center mb-5">
      <div class="col-6">
        <b-link class="small link-muted" to="login">Back to sign in</b-link>
      </div>

      <div class="col-6 text-right">
        <b-button type="submit" class="btn btn-primary transition-3d-hover" variant="primary" >Request Reset Link</b-button>
      </div>
    </div>
    <!-- End Button -->
  </b-form>
  <!-- End Form -->
  <!-- Redirect -->
  <Alert
    v-if="redirect"
    title="Success!"
    :text="this.res.usermessage"
    :footer="this.res.recommendation"
    variant="primary"
  />
  <!-- End Redirect -->
  </div>
</template>

<script>
import api from '@/api';
import Alert from '@/components/shared/Alert';

export default {
  components: {
    Alert,
  },
  data() {
    return {
      redirect: false,
      form: {
        username: '',
      },
      res: {
        usermessage: '',
        details: '',
        recommendation: '',
      },
    };
  },
  methods: {
    handleSubmit(evt) {
      evt.preventDefault();
      api.postForgotPassword(this.form)
        .then((response) => {
          // console.log(response);
          this.redirect = true;
          this.res.usermessage = response.data.usermessage;
          if (response.data.details === response.data.recommendation) {
            this.res.recommendation = response.data.recommendation;
          } else {
            this.res.details = response.data.details;
            this.res.recommendation = response.data.recommendation;
          }
          setTimeout(function () { this.$router.push('/auth/login'); }.bind(this), 5000); // eslint-disable-line
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.auth-container {
  .mb-0,
  .my-0 {
    margin-bottom: 0 !important
  }
  .mb-5,
  .my-5 {
    margin-bottom: 2rem !important
  }
  .mb-7,
  .my-7 {
    margin-bottom: 3rem !important
  }
  .h3,
  h1 {
    font-weight: 500;
    line-height: 1.2
  }
  .text-primary {
    color: #007bff !important
  }
  .link-muted {
    color: #8c98a4;
    border-bottom: 1px dashed #97a4af
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
  .align-items-center {
    align-items: center !important
  }
  .small,
  small {
    font-size: 80%;
    font-weight: 400
  }
  .text-right {
    text-align: right !important
  }
}
</style>
