<template>
  <Modal
    dialogClass="modal-xl"
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
  >
    <template>
      <div v-if="api">
        <b-row>
          <b-col md="3">
            <Images :uuid="api.uuid" :itext="api.apititle" :color="api.color" type="apis" shape="rectangle"></Images>
          </b-col>
          <b-col md="3">
            <dl>
              <dt>
                Title
              </dt>
              <dd>
                {{ api.apititle }}
              </dd>
              <dt>Version</dt>
              <dd>{{ api.version }}</dd>
              <dt>State</dt>
              <dd>{{ getApiStateName(api.apistateid) }}</dd>
              <dt>Owner</dt>
              <dd>{{ api.apiowner }}</dd>
            </dl>
          </b-col>
          <b-col md="3">
            <dl>
              <dt>Environment</dt>
              <dd>{{ getEnvironment(api) }}</dd>
              <dt>Visibility</dt>
              <dd>{{ getApiVisibilityName(api.apivisibilityid) }}</dd>
              <dt>License</dt>
              <dd>{{ api.apilicense }}</dd>
            </dl>
          </b-col>
          <b-col md="3">
            <dl>
            <dt>Created</dt>
            <dd>{{ api.created | moment("DD.MM.YYYY HH:mm") }}</dd>
            <dt>Updated</dt>
            <dd>{{ api.updated | moment("DD.MM.YYYY HH:mm") }}</dd>
            </dl>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <dt>Server</dt>
            <dd>
            <code class="d-block txt-break" v-for="(sv, index) in api.apiservers" v-bind:title="sv.url" :key="index">{{sv.url}}</code>
            </dd>
            <dt>
              Description
            </dt>
            <dd>{{ api.apidescription }}</dd>
          </b-col>
        </b-row>
        <div class="licenses-container">
          <div class="licenses-header-container">
            Subscribe
          </div>
          <div class="licenses-content-container">
            <b-form @submit="handleSubscribe">
              <div class="row">
                <div class="col-md-4">
                  <b-form-group
                    id="selectedAppId"
                    label="My Apps:"
                    v-b-tooltip.hover
                    title="My Please select your APP to Subscribe"
                    label-for="selectedAppIdInput"
                  >
                    <b-form-select
                      id="selectedAppIdInput"
                      v-model="form.appId"
                      :options="[
                        {
                          value: null,
                          text: 'Please select app',
                        },
                        ...apps
                        .map(app => ({
                          value: app.uuid,
                          text: app.displayname,
                        })),
                      ]"
                      :required="true"
                    />
                  </b-form-group>
                </div>
                <div class="col-md-4">
                  <b-button type="submit" block variant="primary" style="margin-top: 32px;">
                    Subscribe
                  </b-button>
                </div>
              </div>
            </b-form>
          </div>
        </div>
        <div class="row abyss-table-buttons">
          <b-button
            @click="handleToggleLicensesTable"
            size="md"
            variant="link"
            v-b-tooltip.hover
            title="Avaliable Licenses to select"
            :class="{'active': isLicensesTableVisible}"
          >
            <span>Licenses</span>
            <b-badge pill>{{ api.availablelicenses.length }}</b-badge>
          </b-button>
          <b-button
            @click="handleToggleContractsTable"
            size="md"
            variant="link"
            v-b-tooltip.hover
            :title="`My existing Contracts with ${api.apititle}`"

            v-if="isMineApi"
            :class="{'active': isContractsTableVisible}"
          >
            <span>Contracts</span>
            <b-badge pill>{{ computedApiContracts.length }}</b-badge>
          </b-button>
        </div>
        <div v-if="isLicensesTableVisible">
          <Licenses
            :rows="api.availablelicenses"
            :licenseIdFromStore="this.licensesMain.licenseId"
            routePath="/app/explore/"
            :showSelectLicense="true"
          ></Licenses>
        </div>
        <div v-if="isContractsTableVisible">
          <Contracts
            :rows="computedApiContracts"
            v-if="apiContracts.length > 0"
            routePath="/app/explore/"
            :isMineApi="isMineApi"
            :onNeedsRefreshData="getApiContracts"
          ></Contracts>
        </div>
        <b-alert class="alert-vivid alert-t-r" v-model="showSelectLicenseAlert" variant="warning" dismissible>Please select a license!</b-alert>
        <b-alert class="alert-vivid alert-t-r" v-model="showSubscribedAlert" variant="success" dismissible>Subscribed to {{ api.apititle }}</b-alert>
      </div>
    </template>
    <template slot="footer">
      <b-button
        variant="secondary"
        @click="onClose"
      >
        Close
      </b-button>
    </template>
  </Modal>
</template>
<script>
import moment from 'moment-timezone';
import { mapState } from 'vuex';
import api from '@/api';
import Modal from '@/components/shared/modals/Modal';
import Icon from '@/components/shared/Icon';
import Images from '@/components/shared/Images';

export default {
  components: {
    Modal,
    Icon,
    Images,
    Licenses: () => import('@/components/shared/subjects/licenses/Licenses'),
    Contracts: () => import('@/components/shared/subjects/contracts/Contracts'),
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      currentPage: state => state.currentPage,
      users: state => state.users.items,
      apiStates: state => state.apiStates.items,
      apiVisibilityTypes: state => state.apiVisibilityTypes.items,
      licenses: state => state.licenses.items,
      licensesMain: state => state.licenses,
      apps: state => state.userApps.items,
      apis: state => state.exploreApis.items,
      contractStates: state => state.contractStates.items,
      resourceTypes: state => state.resourceTypes.items,
      resources: state => state.resources.items,
      resourceActions: state => state.resourceActions.items,
      subjectApps: state => state.subjectApps.items,
      userAppMemberships: state => state.subjectMemberships.userApp,
    }),
    isMineApi() {
      return this.currentUser.uuid === this.api.subjectid;
    },
    computedApiContracts() {
      const { apiContracts, contractStates } = this;
      const { apis, userAppMemberships } = this;
      // const { rootPath } = this.currentPage;
      const getContractStateName = (contractStateId) => {
        const contractState = contractStates
          .find(contractStateItem => contractStateItem.uuid === contractStateId);
        return contractState ? contractState.name : contractStateId;
      };
      const getUserFromApi = (apiId) => {
        const theApi = apis.find(item => item.uuid === apiId) || {};
        return theApi.subjectid || apiId;
      };
      const getUserFromApp = (appId) => {
        const app = userAppMemberships.find(item => item.subjectgroupid === appId) || {};
        return app.subjectid || appId;
      };
      return apiContracts
        .map(contract => ({
          ...contract,
          contractstatename: getContractStateName(contract.contractstateid),
          userIdFromApi: getUserFromApi(contract.apiid),
          userIdFromApp: getUserFromApp(contract.subjectid),
        }));
        // .filter((item) => {
        //   if (rootPath === 'explore') {
        //     return item.userIdFromApi === currentUser.props.uuid ||
        //     item.userIdFromApp === currentUser.props.uuid; // eslint-disable-line
        //   }
        //   return true;
        // });
    },
  },
  props: {
    hideHeader: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    hideFooter: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    noCloseOnBackdrop: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    noCloseOnEsc: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    hideHeaderClose: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    size: {
      type: String,
      required: false,
      default() { return 'lg'; },
    },
    onClose: {
      type: Function,
      required: true,
    },
    api: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      isLicensesTableVisible: true,
      isContractsTableVisible: false,
      showSubscribedAlert: false,
      showSelectLicenseAlert: false,
      apiContracts: [],
      form: {
        appId: null,
      },
    };
  },
  methods: {
    getApiStateName(apistateid) {
      const { apiStates } = this;
      const apiState = apiStates.find(item => item.uuid === apistateid) || {};
      return apiState.name || apistateid;
    },
    getApiVisibilityName(apivisibilityid) {
      const { apiVisibilityTypes } = this;
      const apiVisibility = apiVisibilityTypes.find(item => item.uuid === apivisibilityid) || {};
      return apiVisibility.name || apivisibilityid;
    },
    handleToggleLicensesTable() {
      this.isContractsTableVisible = false;
      this.isLicensesTableVisible = !this.isLicensesTableVisible;
    },
    handleToggleContractsTable() {
      this.isLicensesTableVisible = false;
      this.isContractsTableVisible = !this.isContractsTableVisible;
    },
    getEnvironment(item) {
      return item.islive ? 'Live' : 'Sandbox';
    },
    getApiContracts() {
      if (this.isMineApi) {
        api.getApiContracts(this.api.uuid)
        .then((response) => {
          if (response && response.data) {
            this.apiContracts = response.data;
          }
        })
        .catch((error) => {
          if (error.status === 404) {
            this.apiContracts = [];
          }
        });
      }
    },
    handleSubscribe(evt) {
      evt.preventDefault();
      const accessmanagerid = '6223ebbe-b30f-4976-bcf9-364003142379'; // from config.js
      const effectivestartdate = new Date();
      const effectiveenddate = new Date(effectivestartdate);
      effectiveenddate.setFullYear(effectivestartdate.getFullYear() + 1);
      const { organizationid, uuid } = this.currentUser;
      const { appId } = this.form;
      const { licenseId } = this.licensesMain;
      const { apiId } = this.$route.params;
      const { apps, apis, resources } = this;
      const licenseApp = apps.find(item => item.uuid === appId);
      const licenseApi = apis.find(item => item.uuid === apiId);
      const contractstateid = '846282ec-1329-4a3c-908b-672b4de3ade2'; // activated
      const resourceactionid = 'c5639f00-94c9-4cc9-8ad9-df76f9d162a8'; // CONSUME_API
      const resource = resources.find(item => item.resourcerefid === licenseApi.uuid);
      // permission to post
      const permission = {
        accessmanagerid,
        crudsubjectid: uuid,
        description: `Subscription of ${licenseApp.displayname} App with ${licenseApi.apititle} API`,
        effectiveenddate: moment(effectiveenddate),
        effectivestartdate: moment(effectivestartdate),
        isactive: true,
        organizationid,
        permission: `Subscription of ${licenseApp.displayname} App with ${licenseApi.apititle} API`,
        resourceactionid,
        resourceid: resource.uuid,
        subjectid: licenseApp.uuid,
      };
      // accessToken to post
      const accessToken = {
        crudsubjectid: uuid,
        isactive: true,
        organizationid,
        resourcerefid: resource.resourcerefid,
        resourcetypeid: resource.resourcetypeid,
        subjectpermissionid: null,
      };
      // contract to post
      const contract = {
        apiid: apiId,
        contractstateid,
        crudsubjectid: uuid,
        description: `Contract of ${licenseApp.displayname} App with ${licenseApi.apititle} API`,
        environment: 'LIVE',
        isrestrictedtosubsetofapi: false,
        licenseid: licenseId,
        name: `Contract of ${licenseApp.displayname} App with ${licenseApi.apititle} API`,
        organizationid,
        status: 'inforce',
        subjectid: appId,
        subjectpermissionid: null,
      };
      // POST permission
      if (licenseId) {
        api.postPermissions([permission])
        .then((response) => {
          if (response && response.data && response.data.length > 0) {
            const subjectpermissionid = response.data[0].uuid;
            // POST accessToken
            api.postResourceAccessTokens([{
              ...accessToken,
              subjectpermissionid,
            }])
            .then(() => {
              // POST contract
              api.postContracts([{
                ...contract,
                subjectpermissionid,
              }])
              .then(() => {
                // GET component data
                this.isLicensesTableVisible = false;
                this.isContractsTableVisible = true;
                this.$store.commit('licenses/setLicenseId', null);
                this.showSubscribedAlert = true;
                setTimeout(() => {
                  this.showSubscribedAlert = false;
                }, 3000);
              });
            });
          }
        });
      } else {
        this.showSelectLicenseAlert = true;
        setTimeout(() => {
          this.showSelectLicenseAlert = false;
        }, 3000);
      }
    },
  },
  mounted() {
    const apiLicensesIds = this.api.availablelicenses.map(item => item.uuid);
    this.getApiContracts(apiLicensesIds);
  },
};
</script>

<style lang="scss">
.licenses-container {
  border: 1px solid silver;
  border-radius: .3rem;
  margin: 1rem 0;

  .licenses-header-container {
    padding: .5rem 1rem;
  }

  .licenses-content-container {
    border-top: 1px solid silver;
    padding: 1rem;
  }
}
</style>
