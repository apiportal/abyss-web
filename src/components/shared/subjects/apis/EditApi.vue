<template>
  <div>
    <EditApiModal
      v-if="api"
      :role="apiId === 'new-api' && temporaryApi ? 'add': 'edit'"
      :api="api"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import EditApiModal from '@/components/shared/modals/EditApiModal';
// import Pet3 from '@/assets/pet3.json';
// import Pet3 from '@/assets/test.json';

export default {
  components: {
    EditApiModal,
  },
  props: {
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
  },
  computed: {
    ...mapState({
      temporaryApi: state => state.apis.temporaryApi,
    }),
  },
  data() {
    return {
      apiId: this.$route.params.apiId,
      isApisLoaded: false,
      api: null,
      // api: { openapidocument: Pet3 },
    };
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.routePath);
      this.$store.commit('apis/setTemporaryApi', null);
    },
    handleModalUpdate() {
      this.$router.push(this.routePath);
      this.$store.commit('apis/setTemporaryApi', null);
    },
    getApi() {
      if (this.apiId === 'new-api' && this.temporaryApi) {
        this.api = this.temporaryApi;
      } else {
        api.getApi(this.apiId).then((response) => {
          this.api = response.data[0];
          // fake bir id ile response.data > [] dönüyor
          if (!this.api) {
            this.$router.push(this.routePath);
          }
        })
        .catch((error) => {
          console.log('error.status: ', error.status); // eslint-disable-line
          this.$router.push(this.routePath);
        });
      }
    },
  },
  created() {
    this.getApi();
  },
};
</script>
