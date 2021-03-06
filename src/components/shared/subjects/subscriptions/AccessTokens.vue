<template>
  <div class="abyss-table-content">
    <table class="table abyss-table abyss-table-cards">
      <thead>
        <tr>
          <th class="status">
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Status"
              sortByKey="isactive"
              sortByKeyType="boolean"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Create Date"
              sortByKey="created"
              sortByKeyType="string"
              data-qa="tableHeadName"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Expire Date"
              sortByKey="expiredate"
              sortByKeyType="string"
              data-qa="tableHeadName"
            />
          </th>
          <th></th>
        </tr>
      </thead>
      <TBodyLoading
        v-if="isLoading && rows.length === 0"
        :cols="5"
      />
      <b-alert class="alert-vivid alert-t-r" v-model="showCopiedAlert" variant="success" dismissible>Access Token copied to clipboard.</b-alert>
      <TbodyCollapsible
        v-for="(item, index) in tableRows" v-bind:key="index"
        :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
      >
        <tr
          slot="main"
          :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''} ${item.isexpired ? 'is-expired' : ''}`"
          class="opaque"
          :data-qa="`tableRow-${index}`"
        >
          <td class="status" @click="() => handleCollapseTableRows(item.uuid)">
            <Icon
              :icon="item.isactive ? 'check-circle' : 'times-circle'"
              :class="item.isactive ? 'text-success' : 'text-danger'" />
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.created | moment("DD.MM.YYYY HH:mm") }}
          </td>
          <td class="expire-date" @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.expiredate | moment("DD.MM.YYYY HH:mm") }}
          </td>
          <!--  -->
          <td class="actions">
            <b-button
              v-b-tooltip.hover
              title="Regenerate"
              variant="link"
              size="lg"
              class="token-btn-refresh"
              block
              v-if="!item.isdeleted && item.isexpired"
              @click="regenerateAppsAccessToken(item)"
              data-qa="btnRegenerateAppsAccessToken"
            >
              <Icon icon="redo" />
            </b-button>
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(item.uuid) > -1">
          <td colspan="5">
            <div class="collapsible-content token-area">
              <b-input-group>
                <b-input-group-prepend>
                  <b-button
                    v-b-tooltip.hover.left
                    title="Show/Hide"
                    variant="light"
                    @click="isAccessTokenVisible = !isAccessTokenVisible"
                    data-qa="btnToggleTokenText"
                  >
                    <Icon :icon="`${isAccessTokenVisible ? 'eye-slash' : 'eye'}`" />
                  </b-button>
                  <b-button
                    v-b-tooltip.hover.left
                    title="Copy Token"
                    variant="light"
                    :disabled="!isAccessTokenVisible"
                    @click="copyTokenText()"
                    data-qa="btnCopyTokenText"
                    style="font-size:14px"
                  >
                    COPY
                  </b-button>
                </b-input-group-prepend>
                <b-form-input
                  id="textarea1"
                  class="token-area-show"
                  v-model="item.token"
                  v-if="isAccessTokenVisible"
                  rows="4"
                  max-rows="6"
                  readonly="readonly"
                >
                </b-form-input>
                <b-form-input
                  id="textarea2"
                  class="token-area-hide"
                  v-if="!isAccessTokenVisible"
                  placeholder="••••••••••••••••••••••••••••••••••••••••••••••••••"
                  rows="4"
                  max-rows="6"
                  readonly="readonly"
                >
                </b-form-input>
              </b-input-group>
            </div>
          </td>
        </tr>
      </TbodyCollapsible>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import TBodyLoading from '@/components/shared/TBodyLoading';
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import Helpers from '@/helpers';

export default {
  name: 'AccessTokens',
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
    onUpdate: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapState({
      isLoading: state => state.traffic.isLoading,
    }),
    tableRows() {
      const { sortByKey, sortByKeyType, sortDirection,
        rows } = this;
      const { sortArrayOfObjects } = Helpers;
      return sortArrayOfObjects({
        array: rows
          .map(item => ({
            ...item,
            // isexpired: this.$moment(item.expiredate).isBefore(this.$moment.utc()),
          })),
        sortByKey,
        sortByKeyType,
        sortDirection,
      });
    },
  },
  components: {
    TbodyCollapsible,
    TBodyLoading,
    SortBy,
    Icon,
  },
  data() {
    return {
      collapsedRows: [],
      sortByKey: 'created',
      sortByKeyType: 'string',
      sortDirection: 'desc',
      isAccessTokenVisible: false,
      showCopiedAlert: false,
    };
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
    handleSortByClick({ sortByKey, sortByKeyType, sortDirection }) {
      this.sortByKey = sortByKey;
      this.sortByKeyType = sortByKeyType;
      this.sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    },
    regenerateAppsAccessToken(accessToken) {
      const accessTokenToAdd = JSON.parse(JSON.stringify(accessToken));
      const { uuid, created, updated, deleted, isdeleted,
        expiredate, isexpired, token, ...rest } = accessTokenToAdd;
      api.deleteAccessTokens(accessToken.uuid).then((res) => {
        if (res) {
          api.postAccessTokens([{ ...rest }]).then((response) => {
            if (response && response.data) {
              this.onUpdate();
            }
          });
        }
      });
    },
    copyTokenText() {
      const tokenText = document.getElementById('textarea1');
      tokenText.select();
      document.execCommand('copy');
      this.showCopiedAlert = true;
      setTimeout(() => {
        this.showCopiedAlert = false;
      }, 3000);
    },
  },
};
</script>

<style lang="scss" scoped>
.token-area-show {
  font-size: .70em;
  height: 40px;
}
.token-area-hide {
  font-size: 1.5em;
  height: 40px;
}
</style>
