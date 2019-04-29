<template>
<div>
  <nav class="navbar d-flex justify-content-between" style="background-color: #036; color: rgba(255, 255, 255, 0.8);">
    <div class="d-flex">
      <div v-if="pictureEditable.props.picture" class="item p-0">
        <span class="p-0" @click="handleDeleteImage" ><Icon class="notify-badge" icon="times" style="color: rgba(255, 255, 255, 0.8); cursor: pointer;"/></span>
        <img :src="pictureEditable.props.picture" class="bg-cover bg-secondary rounded-circle avatar" @click="$refs.fileInput.click()" />
      </div>
      <img  v-if="!pictureEditable.props.picture" src="@/assets/avatar.jpg" class="bg-cover bg-secondary rounded-circle avatar" @click="$refs.fileInput.click()" />
      <input type="file" id="image-upload" ref="fileInput" @change="onFileSelected" accept="image/*"/>
        <div class="d-flex align-items-center">
          <dl class="m-0">
          <dd class="m-0"><h4>{{ user.props.displayname }}</h4></dd>
          <dt class="m-0"><small>{{ user.props.email }}</small></dt>
          </dl>
        </div>
        <div class="d-flex align-items-end ">
          <dl class="m-0">
          <dt class="m-0">
        </dt>
      </dl>
      </div>
    </div>
    <h6>My Profile</h6>
  </nav>
    <!-- {{ userEditable.props }} -->
  <b-card no-body>
    <b-tabs card>
      <!-- ## My Profile Tab ## -->
      <b-tab>
        <template slot="title">
          <Icon icon="user"/> Profile
        </template>
        <b-form @submit="handleSubmit">
          <div class="d-flex align-items-center flex-column">
            <div class="row w-75">
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
                  <label for="titleInput">Title</label>
                  <b-form-input id="titleInput" type="text" v-model="userEditable.props.jobtitle" placeholder="Title">
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
                <b-form-group id="websiteGroup">
                  <label for="websiteInput">Website</label>
                  <b-form-input id="websiteInput" type="text" v-model="userEditable.props.url" placeholder="Website">
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
                <b-form-group id="descriptionGroup" label="Description" label-for="descriptionTextarea">
                  <b-form-textarea id="descriptionTextarea" v-model="userEditable.props.description"
                  placeholder="Description" :rows="4" :cols="100">
                </b-form-textarea>
              </b-form-group>

              </div>
            </div>
            <h6>Add Social Media Accounts</h6>
            <div class="row w-75">
              <div class="col">
                <InputWithIcon :prepend="{ icon: 'facebook-square', prefix: 'fab'}" placeholder="Facebook"
                  class="my-1" />
                <InputWithIcon :prepend="{ icon: 'twitter-square', prefix: 'fab' }" placeholder="Twitter"
                  class="my-1" />
                <InputWithIcon :prepend="{ icon: 'github-square', prefix: 'fab' }" placeholder="Github" class="my-1" />
              </div>
              <div class="col">
                <InputWithIcon :prepend="{ icon: 'instagram', prefix: 'fab' }" placeholder="Instagram" class="my-1" />
                <InputWithIcon :prepend="{ icon: 'linkedin', prefix: 'fab' }" placeholder="Linkedin" class="my-1" />
              </div>
            </div>
            <footer class="d-flex justify-content-start w-75 ml-3 mt-3">
              <b-button class="mx-2" variant="primary" type="submit">
                Save
              </b-button>
            </footer>
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
            <!-- Title -->
              <div class="row w-75 subheader mb-3">
                <h2 class="h2 font-weight-normal mt-1">Change Password</h2>
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
          <div class="w-50 js-form-message form-group">
            <b-form-group>
              <label class="form-label">
                Old Password
              </label>
              <b-form-input v-model="form.oldpassword" type="password" placeholder="********" required
                class="form-control"></b-form-input>
            </b-form-group>
          </div>
          <!-- End Form Group -->
          <!-- Form Group -->
          <div class="w-50 js-form-message form-group">
            <b-form-group>
              <label class="form-label">
                <span class="d-flex justify-content-between align-items-center">
                  New Password
                </span>
              </label>
              <b-form-input v-model="form.newpassword" type="password" placeholder="********" required
                class="form-control"></b-form-input>
            </b-form-group>
          </div>
          <!-- End Form Group -->
          <!-- Form Group -->
          <div class="w-50 js-form-message form-group">
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
          <!-- End Form Group -->
          <!-- Button -->
          <div class="text-right">
            <b-button type="submit" class="btn btn-primary transition-3d-hover" variant="primary">Change
            </b-button>
          </div>
          <!-- End Button -->
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
            <div class="row w-75 subheader mb-3">
              <h2 class="h2 font-weight-normal mt-1">Invite a Friend</h2>
            </div>
            <div class="row w-75">
              <div class="col">
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

              <div class="col">

              </div>
            </div>
            <footer class="d-flex justify-content-start w-75 ml-3">
              <b-button class="mx-2" 
                variant="primary" 
                type="submit"
                id="IdSendReferral"
                >
                Send
              </b-button>
            </footer>
          </div>
        </b-form>
      </b-tab>
    </b-tabs>
  </b-card>
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
          console.log(response); // eslint-disable-line no-console
        })
        .catch((e) => {
          this.isAlertVisible = true;
          this.alertResponse.message = e.data.usermessage;
        });
    },
  },
};
</script>
<style>
  .item {
      position:relative;
      padding-top:20px;
      display:inline-block;
  }
  .notify-badge{
      position: absolute;
      right:5px;
      top:0px;
      background:gray;
      text-align: center;
      border-radius: 50%;
      color:white;
      padding: 0px 3.125px 0px 3.125px;
      font-size:20px;
      line-height: 0px;
      width: 1em !important;
  }
  .avatar {
    width: 70px;
    height: 70px;
    margin-left: .5rem;
    margin-right: .7rem;
    margin-top: .1rem;
  }
  input[type="file"] {
      display: none;
  }
  /* label {
    font-size: 0.8em;
  } */
  code {
    font-size: 1.2em;
  }
  .tab-content {
    background-color: #ededed;
  }
  .subheader {
    border-bottom: 1px solid black;
  }
</style>
