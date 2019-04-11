<template>
  <Modal
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
        </div>
        <div v-if="isLicensesTableVisible">
          <Licenses
            :rows="apiLicenses"
            routePath="/app/explore/"
          ></Licenses>
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
import { mapState } from 'vuex';
import Modal from '@/components/shared/modals/Modal';
import Icon from '@/components/shared/Icon';
import api from '@/api';

export default {
  components: {
    Modal,
    Icon,
    Licenses: () => import('@/components/shared/subjects/licenses/Licenses'),
  },
  data() {
    return {
      isLicensesTableVisible: false,
      apiLicenses: [],
    };
  },
  computed: {
    ...mapState({
      users: state => state.users.items,
      apiStates: state => state.apiStates.items,
      apiVisibilityTypes: state => state.apiVisibilityTypes.items,
      licenses: state => state.licenses.items,
    }),
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
      default() { return 'md'; },
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
      this.isLicensesTableVisible = !this.isLicensesTableVisible;
    },
    getApiLicenses(uuid) {
      api.getExploreApiLicenses(uuid)
      .then((response) => {
        if (response && response.data) {
          const apiLicensesIds = response.data.map(item => item.licenseid);
          this.apiLicenses = this.licenses.filter(item => (
            (apiLicensesIds.indexOf(item.uuid) > -1)
          ));
        }
      });
    },
  },
  mounted() {
    const { uuid } = this.api;
    this.getApiLicenses(uuid);
  },
};
</script>