<template>
  <!-- Form -->
  <b-form @submit="handleSubmit">
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
          Email address
        </label>
        <b-form-input
          v-model="form.email"
          type="email"
          placeholder="Email address"
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
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: '',
      },
    };
  },
  methods: {
    handleSubmit(evt) {
      evt.preventDefault();
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
