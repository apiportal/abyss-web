<template>
  <div class="abyss-table-content">
    <table class="table abyss-table abyss-table-cards">
      <thead>
        <tr>
          <th></th>
          <th class="status">Status</th>
          <th>Contract Name</th>
          <th>State</th>
          <th></th>
        </tr>
      </thead>
      <TbodyCollapsible
        v-for="(item, index) in tableRows" v-bind:key="index"
        :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
      >
        <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`" :data-qa="`tableRow-${index}`">
          <td class="status" @click="() => handleCollapseTableRows(item.uuid)" style="text-transform: capitalize">
            <Icon :icon=statusIcon(item.status) :class=statusClass(item.status) />
          </td>
          <td class="status" @click="() => handleCollapseTableRows(item.uuid)" style="text-transform: capitalize">
            {{ item.status }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)" :data-qa="`tableRowName-${index}`">
            {{ item.name }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)" style="text-transform: capitalize">
            {{ item.contractstatename }}
          </td>
          <td class="actions">
            <b-dropdown variant="link" size="lg" no-caret right v-if="!item.isdeleted" data-qa="dropDownActions">
              <template slot="button-content">
                <Icon icon="ellipsis-h" />
              </template>

              <b-dropdown-item
                @click="() => handleUnsubscribe(item.uuid, item.name)"
                data-qa="btnUnsubscribe"
              >
                <span v-if="isMineApi">Terminate Subscription</span>
                <span v-else>Unsubscribe</span>
              </b-dropdown-item>

              <b-dropdown-header v-if="currentPage.rootPath === 'my-contracts'">LOGS</b-dropdown-header>

              <b-dropdown-item data-qa="btnLogsAll" :to="`${routePath}/logs/${item.uuid}/contract/1`" v-if="currentPage.rootPath === 'my-contracts'">All</b-dropdown-item>

              <b-dropdown-header><code>{{ item.uuid }}</code></b-dropdown-header>

            </b-dropdown>
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(item.uuid) > -1">
          <td colspan="5">
            <div class="collapsible-content">
              <Contract
                :item="item"
                :routePath="routePath"
                :state="item.contractstatename"
              ></Contract>
            </div>
          </td>
        </tr>
      </TbodyCollapsible>
    </table>
    <ConfirmModal
      v-if="unsubscribeId"
      title="Are you sure?"
      :text="`${unsubscribeName} will be deleted. You can't revert your action.`"
      :onClose="handleModalClose"
      :onConfirm="handleModalConfirm"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import Contract from '@/components/shared/subjects/contracts/Contract';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Icon from '@/components/shared/Icon';
import ConfirmModal from '@/components/shared/modals/ConfirmModal';

export default {
  name: 'Contracts',
  props: {
    rows: {
      type: Array,
      required: false,
      default() { return []; },
    },
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
    isMineApi: {
      type: Boolean,
      required: false,
      default() { return true; },
    },
    onNeedsRefreshData: {
      type: Function,
      required: false,
    },
  },
  components: {
    Contract,
    TbodyCollapsible,
    Icon,
    ConfirmModal,
  },
  data() {
    return {
      collapsedRows: [],
      unsubscribeId: null,
      unsubscribeName: null,
    };
  },
  computed: {
    ...mapState({
      contractStates: state => state.contractStates.items,
      currentPage: state => state.currentPage,
    }),
    tableRows() {
      const { rows, contractStates } = this;
      const getContractStateName = (id) => {
        const contractState = contractStates.find(item => item.uuid === id);
        return contractState ? contractState.name : id;
      };
      return rows.map(item => ({
        ...item,
        contractstatename: getContractStateName(item.contractstateid),
      }));
    },
  },
  methods: {
    handleCollapseTableRows(itemId) {
      const rowIndex = this.collapsedRows.indexOf(itemId);
      if (rowIndex === -1) {
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
    handleUnsubscribe(uuid, name) {
      this.unsubscribeId = uuid;
      this.unsubscribeName = name;
    },
    handleModalClose() {
      this.unsubscribeId = null;
      this.unsubscribeName = null;
    },
    handleModalConfirm() {
      api.unsubscribeFromApi(this.unsubscribeId).then(() => {
        this.onNeedsRefreshData();
        this.unsubscribeId = null;
        this.unsubscribeName = null;
      });
    },
    statusIcon(status) {
      if (status === 'draft') {
        return 'play-circle';
      } else if (status === 'inforce') {
        return 'check-circle';
      } else if (status === 'archived') {
        return 'stop-circle';
      }
      return '';
    },
    statusClass(status) {
      if (status === 'draft') {
        return 'text-secondary';
      } else if (status === 'inforce') {
        return 'text-success';
      } else if (status === 'archived') {
        return 'text-danger';
      }
      return '';
    },
  },
  created() {
    this.$store.dispatch('contractStates/getContractStates', {});
  },
};
</script>
