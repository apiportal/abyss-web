<template>
  <div class="identity-manager-types-container">
    <div class="identity-manager-types-header">
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
            :to="`/app/identity-manager-types/${page}/add-new`"
            variant="primary"
            block
          >
            Add
          </b-button>
        </div>
      </div>
    </div>
    <div class="identity-manager-types-content">
      <table class="table verapi-table">
        <thead>
          <tr>
            <th>
              Name
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="typename"
                sortByKeyType="string"
              />
            </th>
            <th>
              Description
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="description"
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
          </tr>
        </thead>
        <TbodyCollapsible
          v-for="(item, index) in tableRows" v-bind:key="index"
          :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
        >
          <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'}`">
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.typename }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.description }}
            </td>
            <td @click="() => handleCollapseTableRows(item.uuid)">
              {{ item.organizationname }}
            </td>
          </tr>
          <tr slot="footer" class="footer">
            <td colspan="5">
              <div class="collapsible-content">
                <p>Name: {{ item.typename }}</p>
                <p>Description: {{ item.description }}</p>
                <p>Organization: {{ item.organizationname }}</p>
                <p>Created: {{ item.created }}</p>
                <p>Updated: {{ item.updated }}</p>
                <p>Deleted: {{ item.isdeleted }}</p>
                <div>
                  <b-button
                    :to="`/app/identity-manager-types/${page}/edit/${item.uuid}`"
                    size="sm"
                    variant="secondary"
                    v-b-tooltip.hover
                    title="Edit"
                  >
                    <Icon icon="edit" />
                    <span>Edit</span>
                  </b-button>
                  <b-button
                    :to="`/app/identity-manager-types/${page}/delete/${item.uuid}`"
                    size="sm"
                    variant="danger"
                    v-b-tooltip.hover
                    title="Delete"
                  >
                    <Icon icon="trash-alt" />
                    <span>Delete</span>
                  </b-button>
                </div>
              </div>
            </td>
          </tr>
        </TbodyCollapsible>
      </table>
      <router-view></router-view>
    </div>
    <div class="identity-manager-types-footer">
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
      subjectDirectoryTypes: state => state.subjectDirectoryTypes.items,
      organizations: state => state.organizations.items,
    }),
    tableRows() {
      const { subjectDirectoryTypes, organizations } = this;
      const getOrganizationName = (organizationId) => {
        const organization = organizations.find(item => item.uuid === organizationId);
        return organization ? organization.name : organizationId;
      };
      const { sortByKey, sortByKeyType, sortDirection } = this;
      return Helpers.sortArrayOfObjects({
        array: subjectDirectoryTypes.map(item => ({
          ...item,
          organizationname: getOrganizationName(item.organizationid),
        })).filter((item) => {
          const { filterKey } = this;
          if (filterKey === '') {
            return true;
          }
          const filterKeyLowerCase = filterKey.toLowerCase();
          return (
            (
              item.typename &&
              item.typename.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.description &&
              item.description.toLowerCase().indexOf(filterKeyLowerCase) > -1
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
    this.$store.dispatch('subjectDirectoryTypes/getSubjectDirectoryTypes');
    this.$store.dispatch('organizations/getOrganizations');
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      sortByKey: 'typename',
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
      this.$router.push(`/app/identity-manager-types/${page}`);
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
.identity-manager-types-container {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;

  .identity-manager-types-header {
    border-bottom: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;
  }

  .identity-manager-types-footer {
    border-top: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;

    ul {
      margin: 0;
    }
  }

  .identity-manager-types-content {
    flex: 1 0 0;
    overflow-y: auto;
    padding: 1rem;
  }
}
</style>