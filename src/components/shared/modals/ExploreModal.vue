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
          <b-col md=3>
            <img :src="api.image" :alt="api.openapidocument.info.title" class="img-thumbnail">
          </b-col>
          <b-col md=3>
            <dl>
              <dt>
                Title
              </dt>
              <dd>
                {{ api.openapidocument.info.title }}
              </dd>
              <dt>Version</dt>
              <dd>{{ api.version }}</dd>
              <dt>Environment</dt>
              <dd>Live or Sandbox</dd>
              <!-- <dt>Owner</dt>
              <dd>{{ getOwnerName(api.subjectid) }}</dd> -->
            </dl>
          </b-col>
          <b-col md="3">
            <dl>
              <dt>State</dt>
              <dd>{{ getApiStateName(api.apistateid) }}</dd>
              <dt>Visibility</dt>
              <dd>{{ getApiVisibilityName(api.apivisibilityid) }}</dd>
              <dt v-if="api.openapidocument.info.license">
                License
              </dt>
              <dd v-if="api.openapidocument.info.license">
                {{ api.openapidocument.info.license.name }}
              </dd>
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
            <code class="d-block txt-break" v-for="(sv, index) in api.openapidocument.servers" v-bind:title="sv.url" :key="index">{{sv.url}}</code>
            </dd>
            <dt>
              Description
            </dt>
            <dd>{{ api.openapidocument.info.description }}</dd>
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
                        ...computedApps
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
                  <b-form-group 
                    id="selectedLicenseId"
                    label="Available API Licenses:"
                    label-for="selectedLicenseIdInput"
                  >
                    <b-form-select
                      id="selectedLicenseIdInput"
                      v-model="form.licenseId" 
                      :options="[
                        {
                          value: null,
                          text: 'Please select license',
                        },
                        ...apiLicenses.map(license => ({
                          value: license.uuid,
                          text: license.name,
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
            :class="{'active': isLicensesTableVisible}"
          >
            <span>Licenses</span>
            <b-badge pill>{{ apiLicenses.length }}</b-badge>
          </b-button>
          <b-button
            @click="handleToggleContractsTable"
            size="md"
            variant="link"
            :class="{'active': isContractsTableVisible}"
          >
            <span>Contracts</span>
            <b-badge pill>{{ apiContracts.length }}</b-badge>
          </b-button>
        </div>
        <div v-if="isLicensesTableVisible">
          <Licenses
            :rows="apiLicenses"
            routePath="/app/explore/"
          ></Licenses>
        </div>
        <div v-if="isContractsTableVisible">
          <Contracts
            :rows="computedApiContracts"
            routePath="/app/explore"
            :isUnsubscibeButtonVisible="true"
            :isLogsButtonVisible="false"
            :onNeedsRefreshData="getApiLicenses"
          ></Contracts>
        </div>
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
import Modal from '@/components/shared/modals/Modal';
import Icon from '@/components/shared/Icon';
import api from '@/api';

export default {
  components: {
    Modal,
    Icon,
    Licenses: () => import('@/components/shared/subjects/licenses/Licenses'),
    Contracts: () => import('@/components/shared/subjects/contracts/Contracts'),
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      users: state => state.users.items,
      apiStates: state => state.apiStates.items,
      apiVisibilityTypes: state => state.apiVisibilityTypes.items,
      licenses: state => state.licenses.items,
      apps: state => state.apps.items,
      apis: state => state.apis.items,
      contractStates: state => state.contractStates.items,
      resourceTypes: state => state.resourceTypes.items,
      resources: state => state.resources.items,
      resourceActions: state => state.resourceActions.items,
      subjectApps: state => state.subjectApps.items,
    }),
    computedApiContracts() {
      const { apiContracts, contractStates } = this;
      const getContractStateName = (contractStateId) => {
        const contractState = contractStates
          .find(contractStateItem => contractStateItem.uuid === contractStateId);
        return contractState ? contractState.name : contractStateId;
      };
      return apiContracts.map(contract => ({
        ...contract,
        contractstatename: getContractStateName(contract.contractstateid),
      }));
    },
    computedApps() {
      const { subjectApps, apps } = this;
      const userAppsIds = subjectApps.map(item => item.appid);
      return apps
      .filter(item => userAppsIds.indexOf(item.uuid) > -1);
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
      apiLicenses: [],
      apiContracts: [],
      form: {
        appId: null,
        licenseId: null,
      },
    };
  },
  methods: {
    getOwnerName(subjectId) {
      const { users } = this;
      const user = users.find(item => item.uuid === subjectId) || {};
      return user.displayname || subjectId;
    },
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
    getApiLicenses() {
      const { uuid } = this.api;
      api.getExploreApiLicenses(uuid)
      .then((response) => {
        if (response && response.data) {
          const apiLicensesIds = response.data.map(item => item.licenseid);
          this.apiLicenses = this.licenses.filter(item => (
            (apiLicensesIds.indexOf(item.uuid) > -1)
          ));
          this.getApiContracts(apiLicensesIds);
        }
      });
    },
    async getApiContracts(licensesIds) {
      Promise
      .all(licensesIds.map(licenseId => api.getLicenseContracts(licenseId)))
      .then((values) => {
        this.apiContracts = values
        .reduce((acc, val) => (val.data ? [...acc, ...val.data] : acc), []);
      });
    },
    handleSubscribe(evt) {
      evt.preventDefault();
      const accessmanagerid = '6223ebbe-b30f-4976-bcf9-364003142379'; // from config.js
      const effectivestartdate = new Date();
      const effectiveenddate = new Date(effectivestartdate);
      effectiveenddate.setFullYear(effectivestartdate.getFullYear() + 1);
      const { organizationid, uuid } = this.currentUser;
      const { appId, licenseId } = this.form;
      const { apiId } = this.$route.params;
      const { apps, apis, contractStates, resourceActions, resources } = this;
      const licenseApp = apps.find(item => item.uuid === appId);
      const licenseApi = apis.find(item => item.uuid === apiId);
      const contractstateid = contractStates.find(item => item.name === 'activated').uuid;
      const resourceactionid = resourceActions.find(item => item.actionname === 'INVOKE_API').uuid;
      const resource = resources.find(item => item.resourcerefid === licenseApi.uuid);
      // permission to post
      const permission = {
        accessmanagerid,
        crudsubjectid: uuid,
        description: `Subscription of ${licenseApp.displayname} App with ${licenseApi.openapidocument.info.title} API`,
        effectiveenddate: moment(effectiveenddate),
        effectivestartdate: moment(effectivestartdate),
        isactive: true,
        organizationid,
        permission: `Subscription of ${licenseApp.displayname} App with ${licenseApi.openapidocument.info.title} API`,
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
        description: `Contract of ${licenseApp.displayname} App with ${licenseApi.openapidocument.info.title} API`,
        environment: 'LIVE',
        isrestrictedtosubsetofapi: false,
        licenseid: licenseId,
        name: `Contract of ${licenseApp.displayname} App with ${licenseApi.openapidocument.info.title} API`,
        organizationid,
        status: 'inforce',
        subjectid: appId,
        subjectpermissionid: null,
      };
      // POST permission
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
              this.getApiLicenses();
              this.isLicensesTableVisible = false;
              this.isContractsTableVisible = true;
            });
          });
        }
      });
    },
  },
  mounted() {
    this.getApiLicenses();
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