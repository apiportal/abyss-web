<template>
  <Modal
    bodyClass="logs"
    footerClass="logs-footer"
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
  >
    <template slot="header">
      <h5 class="modal-title">
        {{ title }}
      </h5>
    </template>
    <template>
      <table class="table verapi-table" v-if="totalCount > 0">
        <thead>
          <tr>
            <th>Method</th>
            <th>Path</th>
            <th>User Name</th>
            <th>Time</th>
          </tr>
        </thead>
        <TbodyCollapsible
          v-for="(item, index) in logs" v-bind:key="index"
          :isCollapsed="collapsedRows.indexOf(item._id) > -1"
        >
        <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'}`">
          <td @click="() => handleCollapseTableRows(item._id)">
            {{ item._source['@httpmethod'] }}
          </td>
          <td @click="() => handleCollapseTableRows(item._id)">
            {{ item._source['@httppath'] }}
          </td>
          <td @click="() => handleCollapseTableRows(item._id)">
            {{ item._source['@username'] }}
          </td>
          <td @click="() => handleCollapseTableRows(item._id)">
            {{ item._source['created'] }}
          </td>
        </tr>
        <tr slot="footer" class="footer">
          <td colspan="4">
            <div class="collapsible-content">
              <pre>{{ item._source }}</pre>
            </div>
          </td>
        </tr>
        </TbodyCollapsible>
      </table>
      <div v-else>
        <p class="text-center">No logs for this subject</p>
      </div>
    </template>
    <template slot="footer" v-if="totalCount > 0">
      <div class="w-100" v-if="logs.length > 0">
        <b-pagination 
          size="md"
          :total-rows="totalCount"
          v-model="logPage" 
          :per-page="itemsPerPage"
          align="center"
          @change="onPageChange"
        >
        </b-pagination>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from '@/components/shared/modals/Modal';
import Icon from '@/components/shared/Icon';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';

export default {
  components: {
    Modal,
    Icon,
    TbodyCollapsible,
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
    logs: {
      type: Array,
      required: false,
      default() { return []; },
    },
    onPageChange: {
      type: Function,
      required: true,
    },
    totalCount: {
      type: Number,
      required: false,
      default() { return 0; },
    },
    title: {
      type: String,
      required: false,
      default() { return 'Logs'; },
    },
  },
  data() {
    return {
      itemsPerPage: 10,
      collapsedRows: [],
      logPage: parseInt(this.$route.params.logPage, 10),
    };
  },
  methods: {
    handleCollapseTableRows(itemId) {
      const rowIndex = this.collapsedRows.indexOf(itemId);
      if (rowIndex === -1) {
        this.collapsedRows.push(itemId);
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
};
</script>

<style lang="scss">
.logs-footer {
  & > div {
    width: 100%;

    ul {
      margin-bottom: 0;
    }
  }
}
</style>