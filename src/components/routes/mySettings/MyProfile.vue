<template>
<div>
  <nav class="navbar page-navbar d-flex justify-content-between">
    <div class="d-flex">
      <div v-if="pictureEditable.props.picture" class="position-relative">
        <span class="notify-badge" @click="handleDeleteImage" ><Icon icon="times"/></span>
        <img :src="pictureEditable.props.picture" class="bg-cover bg-secondary rounded-circle avatar" @click="$refs.fileInput.click()" />
      </div>
      <img  v-if="!pictureEditable.props.picture" src="@/assets/avatar.jpg" class="bg-cover bg-secondary rounded-circle avatar" @click="$refs.fileInput.click()" />
      <input type="file" id="image-upload" ref="fileInput" @change="onFileSelected" accept="image/*"/>
      <div class="d-flex align-items-center px-4">
        <dl class="m-0">
        <dd class="m-0"><h4 class="m-0">{{ user.props.displayname }}</h4></dd>
        <dt class="m-0"><small>{{ user.props.email }}</small></dt>
        </dl>
      </div>
    </div>
    <h6 class="m-0">My Profile</h6>
  </nav>
  <!-- {{ userEditable.props }} -->
  <div class="page-container">
    <b-tabs class="tabs-container">
      <!-- ## My Profile Tab ## -->
      <b-tab>
        <template slot="title">
          <Icon icon="user"/> Profile
        </template>
        <b-form @submit="handleSubmit">
          <div class="d-flex align-items-center flex-column">
            <div class="w-75">
              <h2 class="h2 font-weight-normal mt-3">Your Profile</h2>
              <div class="py-3">
                <div class="row">
                  <div class="col">
                    <b-form-group id="firstNameGroup">
                      <label for="firstNameInput">First Name <code>*</code></label>
                      <b-form-input id="firstNameInput" type="text" v-model="userEditable.props.firstname"
                        placeholder="First Name" required>
                      </b-form-input>
                    </b-form-group>
                    <b-form-group id="displayNameGroup">
                      <label for="displayNameInput">Display Name <code>*</code></label>
                      <b-form-input id="displayNameInput" type="text" v-model="userEditable.props.displayname"
                        placeholder="Display Name" required>
                      </b-form-input>
                    </b-form-group>
                    <b-form-group id="titleGroup">
                      <label for="titleInput">Job Title</label>
                      <b-form-input id="titleInput" type="text" v-model="userEditable.props.jobtitle" placeholder="Job Title">
                      </b-form-input>
                    </b-form-group>
                    <b-form-group id="companyGroup">
                      <label for="companyInput">Company</label>
                      <b-form-input id="companyInput" type="text" v-model="userEditable.props.company"
                        placeholder="Company">
                      </b-form-input>
                    </b-form-group>
                    <b-form-group id="phoneNumberGroup">
                      <label for="phoneNumberInput">Phone Number</label>
                      <b-form-input id="phoneNumberInput" type="text" v-model="userEditable.props.phonemobile"
                        placeholder="Phone Number">
                      </b-form-input>
                    </b-form-group>
                  </div>
                  <div class="col">
                    <b-form-group id="lastNameGroup">
                      <label for="lastNameInput">Last Name <code>*</code></label>
                      <b-form-input id="lastNameInput" type="text" v-model="userEditable.props.lastname"
                        placeholder="Last Name" required>
                      </b-form-input>
                    </b-form-group>
                    <b-form-group id="emailAddressGroup">
                      <label for="emailAddressInput">Email Address <code>*</code></label>
                      <b-form-input id="emailAddressInput" type="text" v-model="userEditable.props.email"
                        placeholder="Email Address" required>
                      </b-form-input>
                    </b-form-group>
                    <b-form-group id="departmentGroup">
                      <label for="departmentInput">Department</label>
                      <b-form-input id="departmentInput" type="text" v-model="userEditable.props.department"
                        placeholder="Department">
                      </b-form-input>
                    </b-form-group>
                    <b-form-group id="websiteGroup">
                      <label for="websiteInput">Website</label>
                      <b-form-input id="websiteInput" type="text" v-model="userEditable.props.url" placeholder="Website">
                      </b-form-input>
                    </b-form-group>
                    <b-form-group id="descriptionGroup" label="Description" label-for="descriptionTextarea">
                      <b-form-textarea id="descriptionTextarea" v-model="userEditable.props.description"
                      placeholder="Description" :rows="1" :cols="100">
                      </b-form-textarea>
                    </b-form-group>
                  </div>
                  <div class="col-12 text-center py-3">
                    <h3 class="font-weight-normal">Add Social Media Accounts</h3>
                  </div>
                  <div class="col-6 form-group">
                    <InputWithIcon :prepend="{ icon: 'facebook-square', prefix: 'fab'}" placeholder="Facebook"
                      class="my-1" />
                  </div>
                  <div class="col-6 form-group">
                    <InputWithIcon :prepend="{ icon: 'twitter-square', prefix: 'fab' }" placeholder="Twitter"
                      class="my-1" />
                  </div>
                  <div class="col-6 form-group">
                    <InputWithIcon :prepend="{ icon: 'github-square', prefix: 'fab' }" placeholder="Github" class="my-1" />
                  </div>
                  <div class="col-6 form-group">
                    <InputWithIcon :prepend="{ icon: 'instagram', prefix: 'fab' }" placeholder="Instagram" class="my-1" />
                  </div>
                  <div class="col-6 form-group">
                    <InputWithIcon :prepend="{ icon: 'linkedin', prefix: 'fab' }" placeholder="Linkedin" class="my-1" />
                  </div>
                </div>
              </div>
              <footer class="text-center">
                <b-button size="lg" class="mx-2" variant="primary" type="submit">Save
                </b-button>
              </footer>
            </div>
          </div>
        </b-form>
      </b-tab>
      <!-- ## Password Reset ## -->
      <b-tab>
        <template slot="title">
          <Icon icon="key" /> Account
        </template>
        <b-form @submit="handlePasswordReset">
          <div class="d-flex align-items-center flex-column">
            <div class="w-50">
              <h2 class="h2 font-weight-normal mt-3">Change Password</h2>
              <Alert
                v-if="isAlertVisible"
                :text="this.alertResponse.message"
                :hideFooter="true"
                :hideHeader="true"
                :dismissable="true"
                :variant="this.alertResponse.variant"
              />
              <div class="py-3">
                <b-form-group>
                  <label class="form-label">
                    Current Password
                  </label>
                  <b-form-input v-model="form.oldpassword" type="password" placeholder="********" required
                    class="form-control"></b-form-input>
                </b-form-group>
                
                <b-form-group>
                  <label class="form-label">
                    <span class="d-flex justify-content-between align-items-center">
                      New Password
                    </span>
                  </label>
                  <b-form-input v-model="form.newpassword" type="password" placeholder="********" required
                    class="form-control"></b-form-input>
                </b-form-group>
                
                <b-form-group>
                  <label class="form-label">
                    <span class="d-flex justify-content-between align-items-center">
                      Confirm New Password
                    </span>
                  </label>
                  <b-form-input v-model="form.confirmpassword" type="password" placeholder="********" required
                    class="form-control"></b-form-input>
                </b-form-group>
              </div>

              <div class="text-center">
                <b-button type="submit" size="lg" class="btn btn-primary" variant="primary">Change
                </b-button>
              </div>
            </div>
          </div>
        </b-form>
      </b-tab>
      <!-- ## Rererral Tab ## -->
      <b-tab>
        <template slot="title">
          <Icon icon="envelope"/> Referral
        </template>
        <b-form @submit="sendReferral">
          <div class="d-flex align-items-center flex-column">
            <div class="w-50">
              <h2 class="h2 font-weight-normal mt-3">Invite a Friend</h2>
              <div class="py-3">
                <b-form-group id="referralEmailAddress">
                  <label for="referralEmailAddressInput">Referral Email Address <code>*</code></label>
                  <b-form-input 
                    id="referralEmailAddressInput" 
                    type="email"
                    v-model="referral.email"
                    placeholder="Referral Email Address" 
                    required
                  >
                  </b-form-input>
                </b-form-group>

                <b-form-group id="invitationGroup" label="Invitation Text" label-for="invitationTextarea">
                  <b-form-textarea 
                    id="invitationTextarea" 
                    v-model="referral.message"
                    placeholder="Invitation text" :rows="4" :cols="100"
                  >
                  </b-form-textarea>
                </b-form-group>

                <b-form-group id="hasConsentGroup">
                  <b-form-checkbox
                    id="hasConsentChecks"
                    v-model="referral.hasConsentToShare"
                    :value="true"
                    :unchecked-value="false"
                  >
                  Send my name, last name and e-mail information with the invite message.
                  </b-form-checkbox>
                </b-form-group>
              </div>
              <footer class="text-center">
                <b-button size="lg" 
                  variant="primary" 
                  type="submit"
                  id="IdSendReferral"
                  >Send</b-button>
              </footer>
            </div>
          </div>
        </b-form>
      </b-tab>
    </b-tabs>
  </div>
</div>
</template>
<script>
import api from '@/api';
import { mapState, mapActions } from 'vuex';
import InputWithIcon from '@/components/shared/InputWithIcon';
import Icon from '@/components/shared/Icon';
import Alert from '@/components/shared/Alert';

export default {
  name: 'my-profile',
  components: {
    Alert,
    InputWithIcon,
    Icon,
  },
  data() {
    // const { user } = this;
    return {
      referral: {
        email: '',
        message: '',
        hasConsentToShare: false,
      },
      isAlertVisible: false,
      alertResponse: {
        message: '',
        moreinfo: '',
        recommendation: '',
        variant: '',
      },
      form: {
        oldpassword: '',
        newpassword: '',
        confirmpassword: '',
      },
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
    pictureEditable() {
      return JSON.parse(JSON.stringify(this.user));
    },
  },
  methods: {
    ...mapActions('users', ['putUsers']),
    handleSubmit(e) {
      e.preventDefault();
      const {
        description, url, effectiveenddate, secondaryemail, email,
        picture,
        distinguishedname, uniqueid, phonebusiness, phoneextension,
        phonehome, phonemobile, jobtitle, department, company,
        } = this.userEditable.props;
      api.putUsers({
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
      })
        .catch((err) => {
          console.error('Error Message >>> ', err); // eslint-disable-line no-console
        });
    },
    onFileSelected(event) {
      // console.log(event.target.files[0]); // eslint-disable-line no-console
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        this.pictureEditable.props.picture = reader.result;
        console.log(this.pictureEditable.props.picture); // eslint-disable-line no-console
        const {
        description, url, effectiveenddate, secondaryemail, email,
        picture,
        distinguishedname, uniqueid, phonebusiness, phoneextension,
        phonehome, phonemobile, jobtitle, department, company,
        } = this.pictureEditable.props;
        api.putUsers({
          ...this.pictureEditable.props,
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
        })
          .catch((err) => {
            console.error('Error Message >>> ', err); // eslint-disable-line no-console
          });
      };
      reader.readAsDataURL(file);
    },
    handleDeleteImage() {
      // this.pictureEditable.props.picture = '';
      // console.log('e');
      const {
        description, url, effectiveenddate, secondaryemail, email,
        // picture,
        distinguishedname, uniqueid, phonebusiness, phoneextension,
        phonehome, phonemobile, jobtitle, department, company,
        } = this.pictureEditable.props;
      api.putUsers({
        ...this.pictureEditable.props,
        description: (description === null ? '' : description),
        url: (url === null ? '' : url),
        picture: (''),
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
      })
        .catch((err) => {
          console.error('Error Message >>> ', err); // eslint-disable-line no-console
        });
    },
    sendReferral(e) {
      e.preventDefault();
      api.postInviteUser(this.referral)
        .then((response) => {
          console.log(response); // eslint-disable-line no-console
        })
        .catch((error) => {
          console.log(error); // eslint-disable-line no-console
        });
    },
    handlePasswordReset(evt) {
      evt.preventDefault();
      api.putChangePassword(this.user.uuid, this.form)
        .then((response) => {
          this.isAlertVisible = true;
          this.alertResponse.message = 'Password Changed Successfully.';
          this.alertResponse.moreinfo = response.data.usermessage;
          this.alertResponse.variant = 'success';
        })
        .catch((e) => {
          this.isAlertVisible = true;
          this.alertResponse.message = e.data.usermessage;
          this.alertResponse.variant = 'danger';
        });
    },
  },
};
</script>
<style>
  .notify-badge{
      position: absolute;
      right: 0;
      top: 0;
      background: black;
      text-align: center;
      border-radius: 50%;
      color: white;
      font-size: 16px;
      padding: 0 2px;
      line-height: 20px;
      width: 20px !important;
      cursor: pointer;
  }
  .avatar {
    width: 60px;
    height: 60px;
  }
  input[type="file"] {
    display: none;
  }
</style>
