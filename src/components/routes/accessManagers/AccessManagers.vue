<template>
  <div class="access-managers-container">
    <div class="access-managers-header">
      <div class="row">
        <div class="col-md-10">
          <InputWithIcon
            :prepend="{ icon: 'filter' }"
            placeholder="Type to filter"
            :onKeyup="handleFilterKeyup"
          />
        </div>
        <div class="col-md-2">
          <b-button
            :to="`/app/access-managers/${page}/add-new`"
            variant="primary"
            block
          >
            <span>Add</span>
          </b-button>
        </div>
      </div>
    </div>
    <div class="access-managers-content">
      <table class="table verapi-table">
        <thead>
          <tr>
            <th>
              Name
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="accessmanagername"
                sortByKeyType="string"
              />
            </th>
            <th>
              Access Manager Type
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="accessmanagertypename"
                sortByKeyType="string"
              />
            </th>
            <th>
              Organization
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="organizationname"
                sortByKeyType="string"
              />
            </th>
            <th class="abyss-table-td-70">
              Status
            </th>
          </tr>
        </thead>
        <TbodyCollapsible
          v-for="(item, index) in tableRows" v-bind:key="index"
          :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
        >
          <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`">
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.accessmanagername }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.accessmanagertypename }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.organizationname }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              <Icon :icon="item.isactive ? 'check-circle' : 'times-circle'" :class="item.isactive ? 'text-success' : 'text-danger'" />
            </td>
          </tr>
          <tr slot="footer" class="footer">
            <td colspan="4">
              <div class="collapsible-content">
                <p>Access Manager Name: {{ item.accessmanagername }}</p>
                <p>Access Manager Type: {{ item.accessmanagertypename }}</p>
                <p>Organization: {{ item.organizationname }}</p>
                <p>Description: {{ item.description }}</p>
                <p>Created: {{ item.created }}</p>
                <p>Updated: {{ item.updated }}</p>
                <p>Deleted: {{ item.deleted }}</p>
                <div>
                  <b-button
                    :to="`/app/access-managers/${page}/edit/${item.uuid}`"
                    size="md"
                    variant="primary"
                    v-b-tooltip.hover
                    title="Edit"
                  >
                    Edit <Icon icon="edit" />
                  </b-button>
                  <b-button
                    :to="`/app/access-managers/${page}/delete/${item.uuid}`"
                    size="md"
                    variant="danger"
                    v-b-tooltip.hover
                    title="Delete"
                  >
                    Delete <Icon icon="trash-alt" /> 
                  </b-button>

                </div>
              </div>
            </td>
          </tr>
        </TbodyCollapsible>
        <router-view></router-view>
      </table>
    </div>
    <div class="access-managers-footer">
      <b-pagination 
        size="md"
        :total-rows="tableRows.length"
        v-model="page" 
        :per-page="10"
        align="center"
        @change="handlePageChange"
      >
      </b-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import InputWithIcon from '@/components/shared/InputWithIcon';
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Helpers from '@/helpers';

export default {
  components: {
    InputWithIcon,
    Icon,
    SortBy,
    TbodyCollapsible,
  },
  computed: {
    ...mapState({
      accessManagers: state => state.accessManagers.items,
      accessManagerTypes: state => state.accessManagerTypes.items,
      organizations: state => state.organizations.items,
    }),
    tableRows() {
      const { accessManagers, accessManagerTypes, organizations } = this;
      const getAccessManagerTypeName = (accessManagerId) => {
        const accessManager = accessManagerTypes.find(item => item.uuid === accessManagerId);
        return accessManager ? accessManager.typename : accessManagerId;
      };
      const getOrganizationName = (organizationId) => {
        const organization = organizations.find(item => item.uuid === organizationId);
        return organization ? organization.name : organizationId;
      };
      const { sortByKey, sortByKeyType, sortDirection } = this;
      return Helpers.sortArrayOfObjects({
        array: accessManagers.map(item => ({
          ...item,
          accessmanagertypename: getAccessManagerTypeName(item.accessmanagertypeid),
          organizationname: getOrganizationName(item.organizationid),
        })).filter((item) => {
          const { filterKey } = this;
          if (filterKey === '') {
            return true;
          }
          const filterKeyLowerCase = filterKey.toLowerCase();
          return (
            (
              item.accessmanagername &&
              item.accessmanagername.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.accessmanagertypename &&
              item.accessmanagertypename.toLowerCase().indexOf(filterKeyLowerCase) > -1
            )
          );
        }),
        sortByKey,
        sortByKeyType,
        sortDirection,
      });
    },
  },
  created() {
    this.$store.dispatch('accessManagers/getAccessManagers');
    this.$store.dispatch('accessManagerTypes/getAccessManagerTypes');
    this.$store.dispatch('organizations/getOrganizations');
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      sortByKey: 'accessmanagername',
      sortByKeyType: 'string',
      sortDirection: 'desc',
      filterKey: '',
      collapsedRows: [],
    };
  },
  methods: {
    handleSortByClick({ sortByKey, sortByKeyType, sortDirection }) {
      this.sortByKey = sortByKey;
      this.sortByKeyType = sortByKeyType;
      this.sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    },
    handleFilterKeyup({ value }) {
      this.filterKey = value;
    },
    handlePageChange(page) {
      this.$router.push(`/app/access-managers/${page}`);
    },
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

<style lang="scss" scoped>
.access-managers-container {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;

  .access-managers-header {
    border-bottom: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;
  }

  .access-managers-footer {
    border-top: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;

    ul {
      margin: 0;
    }
  }

  .access-managers-content {
    flex: 1 0 0;
    overflow-y: auto;
    padding: 1rem;
  }
}
</style>
