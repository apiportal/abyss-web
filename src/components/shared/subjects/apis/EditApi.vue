<template>
  <div>
    <EditApiModal
      v-if="api"
      role="edit"
      :api="api"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
    />
  </div>
</template>

<script>
import api from '@/api';
import EditApiModal from '@/components/shared/modals/EditApiModal';

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
  data() {
    return {
      apiId: this.$route.params.apiId,
      isApisLoaded: false,
      api: null,
    };
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.routePath);
    },
    handleModalUpdate() {
      this.$router.push(this.routePath);
    },
    getApi() {
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
    },
  },
  created() {
    this.getApi();
  },
};
</script>
