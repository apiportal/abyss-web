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
export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
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
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0;
    margin-bottom: .5rem
  }
  .h1,
  .h2,
  .h3,
  .h4,
  .h5,
  .h6,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
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
  .col,
  .col-1,
  .col-2,
  .col-3,
  .col-4,
  .col-5,
  .col-6,
  .col-7,
  .col-8,
  .col-9,
  .col-10,
  .col-11,
  .col-12,
  .col-auto,
  .col-lg,
  .col-lg-1,
  .col-lg-2,
  .col-lg-3,
  .col-lg-4,
  .col-lg-5,
  .col-lg-6,
  .col-lg-7,
  .col-lg-8,
  .col-lg-9,
  .col-lg-10,
  .col-lg-11,
  .col-lg-12,
  .col-lg-auto,
  .col-md,
  .col-md-1,
  .col-md-2,
  .col-md-3,
  .col-md-4,
  .col-md-5,
  .col-md-6,
  .col-md-7,
  .col-md-8,
  .col-md-9,
  .col-md-10,
  .col-md-11,
  .col-md-12,
  .col-md-auto,
  .col-sm,
  .col-sm-1,
  .col-sm-2,
  .col-sm-3,
  .col-sm-4,
  .col-sm-5,
  .col-sm-6,
  .col-sm-7,
  .col-sm-8,
  .col-sm-9,
  .col-sm-10,
  .col-sm-11,
  .col-sm-12,
  .col-sm-auto,
  .col-xl,
  .col-xl-1,
  .col-xl-2,
  .col-xl-3,
  .col-xl-4,
  .col-xl-5,
  .col-xl-6,
  .col-xl-7,
  .col-xl-8,
  .col-xl-9,
  .col-xl-10,
  .col-xl-11,
  .col-xl-12,
  .col-xl-auto {
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
</style>
