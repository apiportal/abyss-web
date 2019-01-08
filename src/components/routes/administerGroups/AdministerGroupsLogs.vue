<template>
  <div>
    <LogsModal
      :onClose="handleClose"
      :onPageChange="handlePageChange"
      :logs="logs"
      :totalCount="totalCount"
      :title="`${group.subjectname} Logs (${totalCount} records)`"
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
        const { id, logPage } = to.params;
        this.getSubjectSearch({ query: id, from: ((logPage - 1) * 10) });
      }
    },
  },
  computed: {
    ...mapState({
      groups: state => state.groups.items,
    }),
    group() {
      const { groups, id } = this;
      return groups.find(item => item.uuid === id);
    },
  },
  data() {
    return {
      subjectDirectoryId: this.$route.params.id,
      page: this.$route.params.page,
      id: this.$route.params.id,
      logType: this.$route.params.logType,
      logPage: this.$route.params.logPage,
      logs: [],
      totalCount: 0,
    };
  },
  methods: {
    handleClose() {
      const { page } = this;
      this.$router.push(`/app/administer-groups/${page}`);
    },
    handlePageChange(goToPage) {
      const { page, id, logType } = this;
      this.$router.push(`/app/administer-groups/${page}/logs/${id}/${logType}/${goToPage}`);
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
