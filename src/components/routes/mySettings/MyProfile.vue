
<template>
<div>
  <nav class="navbar d-flex justify-content-between mb-5" style="background-color: #036; color: rgba(255, 255, 255, 0.8);">
    <div class="d-flex">
      <span class="bg-cover bg-secondary rounded-circle avatar"></span>
      <dl class="m-0">
      <dd class="m-0">{{ user.props.displayname }}</dd>
      <dt class="m-0"><small>{{ user.props.email }}</small></dt>
      <dt class="m-0">
        <label for="image-upload" class="btn btn-primary btn-sm mt-2">Upload New Picture</label>
        <input type="file" id="image-upload" @change="onFileSelected"/>
        <button type="button" class="btn btn-secondary btn-sm">Delete</button>
      </dt>
      </dl>
    </div>
    <h6>User Profile</h6>
  </nav>
    <!-- {{ userEditable.props }} -->
  <b-form
    @submit="handleSubmit"
  >
  <div class="d-flex align-items-center flex-column">
    <div class="row w-75">
      <div class="col">
        <b-form-group
            id="firstNameGroup"
          >
          <label for="firstNameInput">First Name <code>*</code></label>
          <b-form-input
            id="firstNameInput"
            type="text"
            v-model="userEditable.props.firstname"
            placeholder="First Name"
            required
          >
          </b-form-input>
          </b-form-group>
          <b-form-group
            id="displayNameGroup"
          >
          <label for="displayNameInput">Display Name <code>*</code></label>
          <b-form-input
            id="displayNameInput"
            type="text"
            v-model="userEditable.props.displayname"
            placeholder="Display Name"
            required
          >
          </b-form-input>
          </b-form-group>
          <b-form-group
            id="titleGroup"
            label="Title"
          >
          <b-form-input
            id="titleInput"
            type="text"
            v-model="userEditable.props.jobtitle"
            placeholder="Title"
          >
          </b-form-input>
          </b-form-group>
          <b-form-group
            id="companyGroup"
            label="Company"
          >
          <b-form-input
            id="companyInput"
            type="text"
            v-model="userEditable.props.company"
            placeholder="Company"
          >
          </b-form-input>
          </b-form-group>
          <b-form-group
            id="phoneNumberGroup"
            label="Phone Number"
          >
          <b-form-input
            id="phoneNumberInput"
            type="text"
            v-model="userEditable.props.phonemobile"
            placeholder="Phone Number"
          >
          </b-form-input>
          </b-form-group>
      </div>
      <div class="col">
        <b-form-group
            id="lastNameGroup"
          >
          <label for="lastNameInput">Last Name <code>*</code></label>
          <b-form-input
            id="lastNameInput"
            type="text"
            v-model="userEditable.props.lastname"
            placeholder="Last Name"
            required
          >
          </b-form-input>
          </b-form-group>
          <b-form-group
            id="emailAddressGroup"
          >
          <label for="emailAddressInput">Email Address <code>*</code></label>
          <b-form-input
            id="emailAddressInput"
            type="text"
            v-model="userEditable.props.email"
            placeholder="Email Address"
            required
          >
          </b-form-input>
          </b-form-group>
          <b-form-group
            id="departmentGroup"
            label="Department"
          >
          <b-form-input
            id="departmentInput"
            type="text"
            v-model="userEditable.props.department"
            placeholder="Department"
          >
          </b-form-input>
          </b-form-group>
          <b-form-group
            id="websiteGroup"
            label="Website"
          >
          <b-form-input
            id="websiteInput"
            type="text"
            v-model="userEditable.props.url"
            placeholder="Website"
          >
          </b-form-input>
          </b-form-group>
      </div>
    </div>
    <h5>Add Social Media Accounts</h5>
    <div class="row w-75">
      <div class="col">
        <InputWithIcon
            :prepend="{ icon: 'facebook-square', prefix: 'fab'}"
            placeholder="Facebook"
            class="my-1"
        />
        <InputWithIcon
            :prepend="{ icon: 'twitter-square', prefix: 'fab' }"
            placeholder="Twitter"
            class="my-1"
        />
        <InputWithIcon
            :prepend="{ icon: 'github-square', prefix: 'fab' }"
            placeholder="Github"
            class="my-1"
        />
      </div>
      <div class="col">
        <InputWithIcon
            :prepend="{ icon: 'instagram', prefix: 'fab' }"
            placeholder="Instagram"
            class="my-1"
        />
        <InputWithIcon
            :prepend="{ icon: 'linkedin', prefix: 'fab' }"
            placeholder="Linkedin"
            class="my-1"
        />
      </div>
    </div>
    <div class="row w-75 ml-3 mt-4">
      <b-form-group 
        id="descriptionGroup"
        label="Description"
        label-for="descriptionTextarea"
      >
        <b-form-textarea
          id="descriptionTextarea"
          v-model="userEditable.props.description"
          placeholder="Description"
          :rows="3"
          :cols="100"
        >
        </b-form-textarea>
      </b-form-group>
    </div>
    <footer class="d-flex justify-content-start w-75 ml-3">
      <b-button
        class="mx-2"
        variant="primary"
        type="submit"
      >
        Save
      </b-button>
      <b-button
        class="mx-2"
        variant="secondary"
      >
        Cancel
      </b-button>
    </footer>
  </div>
  </b-form>
</div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import InputWithIcon from '@/components/shared/InputWithIcon';

export default {
  name: 'my-profile',
  components: {
    InputWithIcon,
  },
  data() {
    // const { user } = this;
    return {
      // userEditable: JSON.parse(JSON.stringify(user)),
    };
  },
  computed: {
    ...mapState({
      user: state => state.user,
    }),
    userEditable() {
      return JSON.parse(JSON.stringify(this.user));
    },
  },
  methods: {
    ...mapActions('users', ['putUsers']),
    handleSubmit(e) {
      e.preventDefault();
      const { description, url, effectiveenddate, secondaryemail,
        email, picture, distinguishedname, uniqueid,
        phonebusiness, phoneextension, phonehome, phonemobile,
        jobtitle, department, company } = this.userEditable.props;
      this.putUsers({
        ...this.userEditable.props,
        description: (description === null ? '' : description),
        url: (url === null ? '' : url),
        picture: (picture === null ? '' : picture),
        distinguishedname: (distinguishedname === null ? '' : distinguishedname),
        uniqueid: (uniqueid === null ? '' : uniqueid),
        phonebusiness: (phonebusiness === null ? '' : phonebusiness),
        phoneextension: (phoneextension === null ? '' : phoneextension),
        phonehome: (phonehome === null ? '' : phonehome),
        phonemobile: (phonemobile === null ? '' : phonemobile),
        jobtitle: (jobtitle === null ? '' : jobtitle),
        department: (department === null ? '' : department),
        company: (company === null ? '' : company),
        effectiveenddate: (effectiveenddate === null ? '' : effectiveenddate),
        secondaryemail: (secondaryemail === null ? email : email),
      }).then((response) => {
        if (response && response.data) {
          this.$store.commit('user/setUserProps', response.data[0]);
        }
      });
    },
    onFileSelected(event) {
      console.log(event.target.files[0]); // eslint-disable-line no-console
    },
  },
};
</script>
<style>
  .avatar {
    width: 90px;
    height: 90px;
    margin-left: .5rem;
    margin-right: .7rem;
    margin-top: .2rem;
  }
  input[type="file"] {
      display: none;
  }
</style>
