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
import { mapState } from 'vuex';
import api from '@/api';
import LogsModal from '@/components/shared/modals/LogsModal';

export default {
  components: {
    LogsModal,
  },
  watch: {
    $route(to, from) {
      if (to.params.logPage !== from.params.logPage) {
        const { id, logPage, logType } = to.params;
        this.getSubjectSearch({ query: id, from: ((logPage - 1) * 10), type: logType });
      }
    },
  },
  props: {
    title: {
      type: String,
      required: false,
      default() { return ''; },
    },
  },
  computed: {
    ...mapState({
      navigationFrom: state => state.traffic.navigationFrom,
    }),
  },
  data() {
    return {
      id: this.$route.params.id,
      logType: this.$route.params.logType,
      logPage: this.$route.params.logPage,
      logs: [],
      totalCount: 0,
      page: 0,
      routePath: null,
    };
  },
  methods: {
    handleClose() {
      const { routePath } = this;
      this.$router.push(routePath);
    },
    handlePageChange(goToPage) {
      const { routePath, id, logType } = this;
      this.$router.push(`${routePath}/logs/${id}/${logType}/${goToPage}`);
    },
    getSubjectSearch({ query, from = 0, size = 10, type = 'subject' }) {
      api.getSubjectSearch({
        from,
        size,
        query: {
          query_string: {
            query,
          },
        },
      }, type).then((response) => {
        this.logs = response.data.hits.hits;
        this.totalCount = response.data.hits.total;
      });
    },
  },
  mounted() {
    const { id, logPage, logType } = this;
    this.getSubjectSearch({ query: id, from: ((logPage - 1) * 10), type: logType });
    this.routePath = this.navigationFrom;
  },
};
</script>
