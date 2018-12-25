<template>
  <div class="identity-managers-container">
    <div class="identity-managers-header">
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
            variant="primary"
            block
          >
            Add
          </b-button>
        </div>
      </div>
    </div>
    <div class="identity-managers-content">
      <table class="table">
        <thead>
          <tr>
            <th>
              Status
            </th>
            <th>
              Name
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="directoryname"
                sortByKeyType="string"
              />
            </th>
            <th>
              Priority Order
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="directorypriorityorder"
                sortByKeyType="number"
              />
            </th>
            <th>
              Directory Type
              <SortBy
                :selectedSortByKey="sortByKey"
                :selectedSortDirection="sortDirection"
                :onClick="handleSortByClick"
                sortByKey="directorytypename"
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
            <th>
              &nbsp;
            </th>
            <th>
              &nbsp;
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableRows" v-bind:key="index">
            <td>
              <Icon :icon="item.isactive ? 'check-circle' : 'times-circle'" />
            </td>
            <td>
              {{ item.directoryname }}
            </td>
            <td>
              {{ item.directorypriorityorder }}
            </td>
            <td>
              {{ item.directorytypename }}
            </td>
            <td>
              {{ item.organizationname }}
            </td>
            <td>
              <b-button
                :to="`/app/identity-managers/${page}/edit/${item.uuid}`"
                size="sm"
                variant="secondary"
                v-b-tooltip.hover
                title="Edit"
              >
                <Icon icon="edit" />
              </b-button>
            </td>
            <td>
              <b-button
                :to="`/app/identity-managers/${page}/delete/${item.uuid}`"
                size="sm"
                variant="danger"
                v-b-tooltip.hover
                title="Delete"
              >
                <Icon icon="trash-alt" />
              </b-button>
            </td>
          </tr>
        </tbody>
      </table>
      <router-view></router-view>
    </div>
    <div class="identity-managers-footer">
      <b-pagination 
        size="md"
        :total-rows="tableRows.length"
        v-model="page" 
        :per-page="10"
        align="center"
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
import Helpers from '@/helpers';

export default {
  components: {
    InputWithIcon,
    Icon,
    SortBy,
  },
  computed: {
    ...mapState({
      subjectDirectories: state => state.subjectDirectories.items,
      subjectDirectoryTypes: state => state.subjectDirectoryTypes.items,
      organizations: state => state.organizations.items,
    }),
    tableRows() {
      const { subjectDirectories, subjectDirectoryTypes, organizations } = this;
      const getDirectoryTypeName = (directoryId) => {
        const directory = subjectDirectoryTypes.find(item => item.uuid === directoryId);
        return directory ? directory.typename : directoryId;
      };
      const getOrganizationName = (organizationId) => {
        const organization = organizations.find(item => item.uuid === organizationId);
        return organization ? organization.name : organizationId;
      };
      const { sortByKey, sortByKeyType, sortDirection } = this;
      return Helpers.sortArrayOfObjects({
        array: subjectDirectories.map(item => ({
          ...item,
          directorytypename: getDirectoryTypeName(item.directorytypeid),
          organizationname: getOrganizationName(item.organizationid),
        })).filter((item) => {
          const { filterKey } = this;
          if (filterKey === '') {
            return true;
          }
          const filterKeyLowerCase = filterKey.toLowerCase();
          return (
            (
              item.directoryname &&
              item.directoryname.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.directorytypename &&
              item.directorytypename.toLowerCase().indexOf(filterKeyLowerCase) > -1
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
    this.$store.dispatch('subjectDirectories/getSubjectDirectories');
    this.$store.dispatch('subjectDirectoryTypes/getSubjectDirectoryTypes');
    this.$store.dispatch('organizations/getOrganizations');
  },
  mounted() {
    document.cookie = 'abyss.principal.uuid=32c9c734-11cb-44c9-b06f-0b52e076672d; abyss.login.organization.uuid=9287b7dc-058d-4399-aad0-6fa704decb6b; abyss.login.organization.name=FAIKsOrganization; abyss.session=7afa16aca743d33e5938854819554044';
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      sortByKey: 'directorypriorityorder',
      sortByKeyType: 'number',
      sortDirection: 'desc',
      filterKey: '',
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
  },
};
</script>

<style lang="scss">
.identity-managers-container {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;

  .identity-managers-header {
    border-bottom: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;
  }

  .identity-managers-footer {
    border-top: 1px solid silver;
    flex: 50px 0 0;
    padding: 1rem;

    ul {
      margin: 0 auto;
    }
  }

  .identity-managers-content {
    flex: 1 0 0;
    overflow-y: auto;
  }
}
</style>