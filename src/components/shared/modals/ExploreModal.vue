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
            <Images :uuid="api.uuid" :altText="api.apititle" :color="api.color" type="apis" shape="rectangle" :lastUpdatedAt="itemsLastUpdatedAt"></Images>
            <div class="border mb-4 shadow-sm">
              <div class="p-3">
                <b-form @submit="handleSubscribe">
                  <b-form-group
                    id="selectedAppId"
                    label="Select an App to Subscribe:"
                    class="small font-weight-bold"
                    label-for="selectedAppIdInput"
                    :invalid-feedback="appIdInvalidFeedback"
                    :state="appIdState"
                  >
                    <b-form-select
                      id="selectedAppIdInput"
                      v-model="selectedAppId"
                      :options="[
                        { value: null, text: 'Please select app' },
                        ...apps
                        .map(app => ({
                          value: app.uuid,
                          text: `${app.displayname} - ${app.issandbox ? 'Sandbox' : 'Live'}`,
                          disabled: app.isdeleted,
                        })),
                      ]"
                      :state="appIdState"
                      required
                    />
                  </b-form-group>
                  <b-button type="submit" block variant="success">
                    Subscribe
                  </b-button>
                </b-form>
              </div>
            </div>
          </b-col>
          <b-col md="9">
            <b-row>
              <b-col md="4">
                <dl>
                  <dt>Title</dt>
                  <dd>{{ api.apititle }}</dd>
                  <dt>Version</dt>
                  <dd>{{ api.version }}</dd>
                  <dt>State</dt>
                  <dd>{{ getApiStateName(api.apistateid) }}</dd>
                </dl>
              </b-col>
              <b-col md="4">
                <dl>
                  <dt>Environment</dt>
                  <dd>{{ getEnvironment(api) }}</dd>
                  <dt>Visibility</dt>
                  <dd>{{ getApiVisibilityName(api.apivisibilityid) }}</dd>
                  <dt>License</dt>
                  <dd>{{ api.apilicense }}</dd>
                </dl>
              </b-col>
              <b-col md="4">
                <dl>
                  <dt>Owner</dt>
                  <dd>{{ api.apiowner }}</dd>
                  <dt>Created</dt>
                  <dd>{{ api.created | moment("DD.MM.YYYY HH:mm") }}</dd>
                  <dt>Updated</dt>
                  <dd>{{ api.updated | moment("DD.MM.YYYY HH:mm") }}</dd>
                </dl>
              </b-col>
              <b-col md="12">
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
          </b-col>
        </b-row>
        
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
            <b-badge pill>{{ apiContracts.length }}</b-badge>
          </b-button>
        </div>
        <div v-if="isLicensesTableVisible">
          <Licenses
            :rows="api.availablelicenses"
            :licenseIdFromStore="selectedLicenseId"
            routePath="/app/explore/"
            :showSelectLicense="true"
          ></Licenses>
        </div>
        <div v-if="isContractsTableVisible">
          <Contracts
            :rows="apiContracts"
            v-if="apiContracts.length > 0"
            routePath="/app/explore/"
            :isMineApi="isMineApi"
            :onNeedsRefreshData="getApiContracts"
          ></Contracts>
        </div>
        <!-- <pre>{{api.resources}}</pre> -->
        <b-alert class="alert-vivid alert-t-r" v-model="showSelectLicenseAlert" variant="warning" dismissible>Please select a license!</b-alert>
        <b-alert class="alert-vivid alert-t-r" v-model="showEnvironmenteAlert" variant="warning" dismissible>Please select an APP with the same environment of selected API</b-alert>
        <b-alert class="alert-vivid alert-t-r" v-model="showSubscribedAlert" variant="success" dismissible>Subscribed to {{ api.apititle }}</b-alert>
      </div>
    </template>
    <template slot="footer">
      <b-button variant="secondary" @click="onClose">
        Close
      </b-button>
    </template>
  </Modal>
</template>
<script>
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
      apiStates: state => state.apiStates.items,
      apiVisibilityTypes: state => state.apiVisibilityTypes.items,
      selectedLicenseId: state => state.licenses.licenseId,
      apps: state => state.userApps.items,
      apis: state => state.exploreApis.items,
      itemsLastUpdatedAt: state => state.exploreApis.lastUpdatedAt,
    }),
    isMineApi() {
      return this.currentUser.uuid === this.api.subjectid;
    },
    selectedApp() {
      return this.apps.find(item => item.uuid === this.selectedAppId);
    },
    appIdState() {
      return this.selectedAppId !== null &&
      this.selectedApp.issandbox === this.api.issandbox;
    },
    appIdInvalidFeedback() {
      if (this.selectedAppId === null) {
        return 'Please select an APP';
      } else if (this.selectedApp.issandbox !== this.api.issandbox) {
        return 'Please select an APP with the same environment of selected API';
      }
      return '';
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
      showEnvironmenteAlert: false,
      apiContracts: [],
      selectedAppId: null,
    };
  },
  mounted() {
    if (this.isMineApi) {
      this.getApiContracts();
    }
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
      // return item.islive ? 'Live' : 'Sandbox';
      return item.issandbox ? 'Sandbox' : 'Live';
    },
    getApiContracts() {
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
    },
    handleSubscribe(evt) {
      evt.preventDefault();
      const { selectedApp, selectedAppId, selectedLicenseId, onClose } = this;
      if (!selectedLicenseId) {
        this.showSelectLicenseAlert = true;
        setTimeout(() => {
          this.showSelectLicenseAlert = false;
        }, 3000);
      } else if (selectedApp.issandbox !== this.api.issandbox) {
        this.showEnvironmenteAlert = true;
        setTimeout(() => {
          this.showEnvironmenteAlert = false;
        }, 3000);
      } else {
        const selectedLicense = this.api.availablelicenses.find(item =>
          item.uuid === selectedLicenseId);
        const subscription = [
          {
            contractname: `CONTRACT of ${selectedApp.displayname} APP with ${this.api.apititle} API`,
            contractdescription: `CONTRACT of ${selectedApp.displayname} APP with ${this.api.apititle} API with ${selectedLicense.name} LICENSE`,
            apiid: this.api.uuid,
            resourceidofapi: this.api.resources[0].uuid,
            appid: selectedAppId,
            environment: 'LIVE',
            licenseid: selectedLicenseId,
          },
        ];
        api.subscribeToApi(subscription).then((response) => {
          // if (response && response.data && response.data.length > 0) {
          if (response) {
            console.log('response.data: ', response.data); // eslint-disable-line
            this.isLicensesTableVisible = false;
            this.isContractsTableVisible = false;
            this.$store.commit('licenses/setLicenseId', null);
            this.showSubscribedAlert = true;
            setTimeout(() => {
              this.showSubscribedAlert = false;
              this.$store.dispatch('exploreApis/getExploreApis', {
                refresh: true,
              });
              this.$store.dispatch('userApps/getApps', {
                uuid: this.currentUser.uuid,
                refresh: true,
              });
              onClose();
            }, 3000);
          }
        });
      }
    },
    handleSubscribeOld(evt) {
      evt.preventDefault();
      const { organizationid, uuid } = this.currentUser;
      const { selectedApp, selectedAppId, selectedLicenseId } = this;
      const resource = this.api.resources[0];
      // permission to post
      const permission = {
        accessmanagerid: '6223ebbe-b30f-4976-bcf9-364003142379',
        crudsubjectid: uuid,
        description: `Subscription of ${selectedApp.displayname} App with ${this.api.apititle} API`,
        effectivestartdate: this.$moment.utc().toISOString(),
        effectiveenddate: this.$moment.utc().add(1, 'years').toISOString(),
        isactive: true,
        organizationid,
        permission: `Subscription of ${selectedApp.displayname} App with ${this.api.apititle} API`,
        resourceactionid: 'c5639f00-94c9-4cc9-8ad9-df76f9d162a8', // CONSUME_API,
        resourceid: resource.uuid,
        subjectid: selectedApp.uuid,
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
        apiid: this.api.uuid,
        contractstateid: '846282ec-1329-4a3c-908b-672b4de3ade2', // activated
        crudsubjectid: uuid,
        description: `Contract of ${selectedApp.displayname} App with ${this.api.apititle} API`,
        environment: 'LIVE',
        isrestrictedtosubsetofapi: false,
        licenseid: selectedLicenseId,
        name: `Contract of ${selectedApp.displayname} App with ${this.api.apititle} API`,
        organizationid,
        status: 'inforce',
        subjectid: selectedAppId,
        subjectpermissionid: null,
      };
      // POST permission
      if (!selectedLicenseId) {
        this.showSelectLicenseAlert = true;
        setTimeout(() => {
          this.showSelectLicenseAlert = false;
        }, 3000);
      } else if (selectedApp.issandbox !== this.api.issandbox) {
        this.showEnvironmenteAlert = true;
        setTimeout(() => {
          this.showEnvironmenteAlert = false;
        }, 3000);
      } else {
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
      }
    },
  },
};
</script>

<style lang="scss">
dt {
  font-size: 0.85rem;
}
</style>
