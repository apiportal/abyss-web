
<template>
<div>
  <nav class="navbar d-flex justify-content-between mb-5" style="background-color: #036; color: rgba(255, 255, 255, 0.8);">
    <dl class="m-0">
    <dd class="m-0">{{ user.props.displayname }}</dd>
    <dt class="m-0"><small>{{ user.props.email }}</small></dt>
    <dt class="m-0">
      <button type="button" class="btn btn-primary btn-sm">Upload New Picture</button>
      <button type="button" class="btn btn-secondary btn-sm">Delete</button>
    </dt>
    </dl>
    <h4>User Profile</h4>
  </nav>
  <b-form
  >
  <div class="d-flex align-items-center flex-column">
    <!-- {{ user.props }} -->
    <div class="row w-75">
      <div class="col">
        <b-form-group
            id="firstNameGroup"
            label="First Name*:"
          >
          <b-form-input
            id="firstNameInput"
            type="text"
            v-model="user.props.firstname"
            placeholder="First Name"
            required
          >
          </b-form-input>
          </b-form-group>
          <b-form-group
            id="displayNameGroup"
            label="Display Name*:"
          >
          <b-form-input
            id="displayNameInput"
            type="text"
            v-model="user.props.displayname"
            placeholder="Display Name"
            required
          >
          </b-form-input>
          </b-form-group>
          <b-form-group
            id="titleGroup"
            label="Title:"
          >
          <b-form-input
            id="titleInput"
            type="text"
            v-model="user.props.jobtitle"
            placeholder="Title"
          >
          </b-form-input>
          </b-form-group>
          <b-form-group
            id="companyGroup"
            label="Company:"
          >
          <b-form-input
            id="companyInput"
            type="text"
            v-model="user.props.company"
            placeholder="Company"
          >
          </b-form-input>
          </b-form-group>
          <b-form-group
            id="phoneNumberGroup"
            label="Phone Number:"
          >
          <b-form-input
            id="phoneNumberInput"
            type="text"
            v-model="user.props.phonemobile"
            placeholder="Phone Number"
          >
          </b-form-input>
          </b-form-group>
      </div>
      <div class="col">
        <b-form-group
            id="lastNameGroup"
            label="Last Name*:"
          >
          <b-form-input
            id="lastNameInput"
            type="text"
            v-model="user.props.lastname"
            placeholder="Last Name"
            required
          >
          </b-form-input>
          </b-form-group>
          <b-form-group
            id="emailAddressGroup"
            label="Email Address*:"
          >
          <b-form-input
            id="emailAddressInput"
            type="text"
            v-model="user.props.email"
            placeholder="Email Address"
            required
          >
          </b-form-input>
          </b-form-group>
          <b-form-group
            id="departmentGroup"
            label="Department:"
          >
          <b-form-input
            id="departmentInput"
            type="text"
            v-model="user.props.department"
            placeholder="Department"
          >
          </b-form-input>
          </b-form-group>
          <b-form-group
            id="websiteGroup"
            label="Website:"
          >
          <b-form-input
            id="websiteInput"
            type="text"
            v-model="user.props.url"
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
            :prepend="{ icon: 'facebook', prefix: 'fab'}"
            placeholder="Facebook"
            class="my-1"
        />
        <InputWithIcon
            :prepend="{ icon: 'twitter', prefix: 'fab' }"
            placeholder="Twitter"
            class="my-1"
        />
        <InputWithIcon
            :prepend="{ icon: 'github', prefix: 'fab' }"
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
        label="Description:"
        label-for="descriptionTextarea"
      >
        <b-form-textarea
          id="descriptionTextarea"
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
import { mapState } from 'vuex';
import InputWithIcon from '@/components/shared/InputWithIcon';

export default {
  name: 'my-profile',
  components: {
    InputWithIcon,
  },
  computed: {
    ...mapState({
      user: state => state.user,
    }),
  },
};
</script>
