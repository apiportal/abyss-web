<template>
  <!-- Form -->
  <b-form @submit="handleSubmit">
    <!-- Title -->
    <div class="mb-7">
      <h1 class="h3 text-primary font-weight-normal mb-0">Welcome to <span class="font-weight-semi-bold">Abyss</span></h1>
      <p>Fill out the form to get started.</p>
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

    <!-- Form Group -->
    <div class="js-form-message form-group">
      <b-form-group>
        <label class="form-label">
          <span class="d-flex justify-content-between align-items-center">
            Confirm Password
          </span>
        </label>
        <b-form-input
          v-model="form.passwordConfirm"
          type="password"
          placeholder="********"
          required
        ></b-form-input>
      </b-form-group>
    </div>
    <!-- End Form Group -->

    <!-- Checkbox -->
    <div class="js-form-message mb-5">
      <b-form-checkbox
        v-model="form.agree"
        :value="true"
        :unchecked-value="false"
        class="text-muted"
      >
        <small>
          I agree to the
          <a class="link-muted" @click="toggleInformModal">Terms of Use</a>
        </small>
      </b-form-checkbox>
      <InformModal
          v-if="isInformModalVisible"  
          size="md"
          title="Terms of Use"
          :hideHeader="false"
          text="Welcome to ABYSS API PORTAL.\n\n
            If you continue to browse and use this portal, you are agreeing to comply with and be bound by 
            the following terms and conditions of use, which together with our privacy policy govern VERAPI 
            YAZILIM TEKNOLOJİLERİ A.Ş.'s relationship with you in relation to this portal.\n\n
            If you disagree with any part of these terms and conditions, please do not use ABYSS API PORTAL. 
            The term 'VERAPI YAZILIM TEKNOLOJİLERİ A.Ş.' or 'us' or 'we' refers to the owner of the portal 
            whose registered office is Koşuyolu Mah. Koşuyolu Cad. No: 33 Kadıköy / İstanbul / TURKEY\n\n
            Our company registration number is Kadİköy V.D., 924 051 8054.\n\n
            The term 'you' refers to the user or viewer of ABYSS API PORTAL."
          :onClose="toggleInformModal"
          :onConfirm="toggleInformModal"
        >
        </InformModal>
    </div>
    <!-- End Checkbox -->

    <!-- Button -->
    <div class="row align-items-center mb-5">
      <div class="col-6">
        <span class="small text-muted">Already have an account? </span>
        <b-link class="small" to="login">Login</b-link>
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
import InformModal from '@/components/shared/modals/InformModal';

export default {
  components: {
    InformModal,
  },
  data() {
    return {
      isInformModalVisible: false,
      form: {
        email: '',
        password: '',
        passwordConfirm: '',
        agree: false,
      },
    };
  },
  methods: {
    handleSubmit(evt) {
      evt.preventDefault();
    },
    toggleInformModal() {
      this.isInformModalVisible = !this.isInformModalVisible;
    },
  },
};
</script>
<style lang="scss" scoped>
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
  .text-muted {
    color: #6c757d !important
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
  .d-flex {
    display: flex !important
  }
  .justify-content-between {
    justify-content: space-between !important
  }
  .align-items-center {
    align-items: center !important
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
</style>
