<template>
  <div>
  <!-- Form -->
  <b-form @submit="handleSubmit" v-if="!this.redirect">
    <!-- Title -->
    <div class="mb-7">
      <h1 class="h3 text-primary font-weight-normal mb-0">Welcome to <span class="font-weight-semi-bold">Abyss</span></h1>
      <p>Fill out the form to get started.</p>
    </div>
    <!-- End Title -->

     <!-- Form Group -->
    <div class="js-form-message form-group">
      <b-form-group
        :invalid-feedback="firstNameInvalidFeedback"
        :state="firstNameState"
      >
        <label class="form-label">
          First Name
        </label>
        <b-form-input
          v-model="form.firstname"
          type="text"
          placeholder="First Name"
          :state="firstNameState"
          required
          data-qa="formFirstName"
        ></b-form-input>
      </b-form-group>
    </div>
    <!-- End Form Group -->

     <!-- Form Group -->
    <div class="js-form-message form-group">
      <b-form-group
        :invalid-feedback="lastNameInvalidFeedback"
        :state="lastNameState"
      >
        <label class="form-label">
          Last Name
        </label>
        <b-form-input
          v-model="form.lastname"
          type="text"
          placeholder="Last Name"
          :state="lastNameState"
          required
          data-qa="formLastName"
        ></b-form-input>
      </b-form-group>
    </div>
    <!-- End Form Group -->

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
          v-model="form.username"
          type="text"
          placeholder="Username"
          :state="userNameState"
          required
          data-qa="formUsername"
        ></b-form-input>
      </b-form-group>
    </div>
    <!-- End Form Group -->

    <!-- Form Group -->
    <div class="js-form-message form-group">
      <b-form-group
        :invalid-feedback="emailInvalidFeedback"
        :state="emailState"
      >
        <label class="form-label">
          Email address
        </label>
        <b-form-input
          v-model="form.email"
          type="email"
          placeholder="Email address"
          :state="emailState"
          required
          data-qa="formEmail"
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
          </span>
        </label>
        <b-form-input
          v-model="form.password"
          type="password"
          placeholder="********"
          :state="passwordState"
          autocomplete="new-password"
          required
          data-qa="formPassword"
        ></b-form-input>
      </b-form-group>
    </div>
    <!-- End Form Group -->

    <!-- Form Group -->
    <div class="js-form-message form-group">
      <b-form-group
        :invalid-feedback="confirmPasswordInvalidFeedback"
        :state="confirmPasswordState"
      >
        <label class="form-label">
          <span class="d-flex justify-content-between align-items-center">
            Confirm Password
          </span>
        </label>
        <b-form-input
          v-model="form.password2"
          type="password"
          placeholder="********"
          :state="confirmPasswordState"
          required
          data-qa="formConfirmPassword"
        ></b-form-input>
      </b-form-group>
    </div>
    <!-- End Form Group -->

    <!-- Checkbox -->
    <div class="js-form-message mb-5 d-flex flex-row">
      <input
        type="checkbox"
        v-model="form.isAgreedToTerms"
        :value="true"
        :unchecked-value="false"
        class="text-muted"
        :required="true"
        data-qa="chkAgree"
      >
      <small class="ml-1">
        I agree to the
        <a class="link-muted" @click="toggleInformModal" data-qa="linkTerms">Terms of Use</a>
      </small>
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
          :onConfirm="handleConfirm"
        >
        </InformModal>
    </div>
    <!-- End Checkbox -->

    <!-- Button -->
    <div class="row align-items-center mb-5">
      <div class="col-6">
        <span class="small text-muted">Already have an account? </span>
        <b-link class="small" to="login" data-qa="linkLogin">Login</b-link>
      </div>

      <div class="col-6 text-right">
        <b-button type="submit" class="btn btn-primary transition-3d-hover" variant="primary" data-qa="btnGetStarted">Get Started</b-button>
      </div>
    </div>
    <Alert
      v-if="pAlert"
      text="Passwords didn't match or has less than 3 characters."
      :dismissable="true"
      :hideHeader="true"
      :hideFooter="true"
    />
    <!-- End Button -->
  </b-form>
  <!-- End Form -->
  <!-- Redirect -->
  <Alert
    v-if="redirect"
    title="Account successfully created!"
    :text="this.res.usermessage"
    :footer="this.res.recommendation"
    variant="primary"
  />
  <!-- End Redirect -->
  </div>
</template>

<script>
import InformModal from '@/components/shared/modals/InformModal';
import api from '@/api';
import Alert from '@/components/shared/Alert';

export default {
  components: {
    InformModal,
    Alert,
  },
  data() {
    return {
      isInformModalVisible: false,
      pAlert: false,
      form: {
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        password2: '',
        isAgreedToTerms: false,
      },
      redirect: false,
      res: {
        usermessage: '',
        details: '',
        recommendation: '',
      },
    };
  },
  computed: {
    firstNameState() {
      const { firstname } = this.form;
      return firstname.length > 0;
    },
    firstNameInvalidFeedback() {
    },
    lastNameState() {
      const { lastname } = this.form;
      return lastname.length > 0;
    },
    lastNameInvalidFeedback() {
    },
    userNameState() {
      const { username } = this.form;
      return username.length > 0;
    },
    userNameInvalidFeedback() {
    },
    emailState() {
      const { email } = this.form;
      return email.length > 0;
    },
    emailInvalidFeedback() {
    },
    passwordState() {
      const { password } = this.form;
      return password.length >= 3;
    },
    passwordInvalidFeedback() {
      const { password } = this.form;
      return (password.length < 3) ? 'Please enter a password at least 3 characters.' : '';
    },
    confirmPasswordState() {
      const { password, password2 } = this.form;
      return password === password2 && password2.length > 0;
    },
    confirmPasswordInvalidFeedback() {
      const { password, password2 } = this.form;
      return (password !== password2) ? 'Passwords did not match.' : '';
    },
  },
  methods: {
    handleSubmit(evt) {
      evt.preventDefault();
      const { password, password2 } = this.form;
      if ((password.length > 2) && (password2.length > 2) && (password === password2)) {
        api.postSignUp(this.form)
          .then((response) => {
            this.redirect = true;
            this.res.usermessage = response.data.usermessage;
            if (response.data.details === response.data.recommendation) {
              this.res.recommendation = response.data.recommendation;
            } else {
              this.res.details = response.data.details;
              this.res.recommendation = response.data.recommendation;
            }
            setTimeout(function () { this.$router.push('/auth/login'); }.bind(this), 5000); // eslint-disable-line
          })
          .catch((error) => {
            console.log(error); // eslint-disable-line
          });
      }
      this.pAlert = true;
    },
    toggleInformModal() {
      this.isInformModalVisible = !this.isInformModalVisible;
    },
    handleConfirm() {
      this.form.isAgreedToTerms = true;
      this.isInformModalVisible = false;
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
}
</style>
