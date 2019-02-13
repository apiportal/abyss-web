<template>
  <div>
    <LogsModal
      :onClose="handleClose"
      :onPageChange="handlePageChange"
      :logs="logs"
      :totalCount="totalCount"
      :title="`${title} (${totalCount} records)`"
    />
  </div>
</template>

<script>
import api from '@/api';
import LogsModal from '@/components/shared/modals/LogsModal';

export default {
  components: {
    LogsModal,
  },
  watch: {
    $route(to, from) {
      if (to.params.logPage !== from.params.logPage) {
        const { id, logPage } = to.params;
        this.getSubjectSearch({ query: id, from: ((logPage - 1) * 10) });
      }
    },
  },
  props: {
    title: {
      type: String,
      required: false,
      default() { return ''; },
    },
    routeAddress: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      id: this.$route.params.id,
      logType: this.$route.params.logType,
      logPage: this.$route.params.logPage,
      logs: [],
      totalCount: 0,
    };
  },
  methods: {
    handleClose() {
      const { routeAddress } = this;
      this.$router.push(routeAddress);
    },
    handlePageChange(goToPage) {
      const { routeAddress, id, logType } = this;
      this.$router.push(`${routeAddress}/logs/${id}/${logType}/${goToPage}`);
    },
    getSubjectSearch({ query, from = 0, size = 10 }) {
      api.getSubjectSearch({
        from,
        size,
        query: {
          query_string: {
            query,
          },
        },
      }).then((response) => {
        this.logs = response.data.hits.hits;
        this.totalCount = response.data.hits.total;
      });
    },
  },
  mounted() {
    const { id, logPage } = this;
    this.getSubjectSearch({ query: id, from: ((logPage - 1) * 10) });
  },
};
</script>
