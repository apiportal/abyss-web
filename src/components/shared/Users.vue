<template>
  <div class="abyss-table-content">
    <table class="table abyss-table abyss-table-cards">
      <thead>
        <tr>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Status"
              sortByKey="isactivated"
              sortByKeyType="boolean"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="Display Name"
              sortByKey="displayname"
              sortByKeyType="string"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="User Name"
              sortByKey="subjectname"
              sortByKeyType="string"
            />
          </th>
          <th>
            <SortBy
              :selectedSortByKey="sortByKey"
              :selectedSortDirection="sortDirection"
              :onClick="handleSortByClick"
              text="E-mail"
              sortByKey="email"
              sortByKeyType="string"
            />
          </th>
          <th></th>
        </tr>
      </thead>
      <TbodyCollapsible
        v-for="(item, index) in totalRows" v-bind:key="index"
        :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
      >
        <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`">
          <td class="status" @click="() => handleCollapseTableRows(item.uuid)">
            <Icon 
              :icon="item.isactivated ? 'check-circle' : 'times-circle'" 
              :class="item.isactivated ? 'text-success' : 'text-danger'"
            />
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.displayname }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.subjectname }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.email }}
          </td>
          <td class="actions">
            <b-dropdown variant="link" size="lg" no-caret right>
              <template slot="button-content">
                <Icon icon="ellipsis-h" />
              </template>
    
              <b-dropdown-item :to="`/app/${path}/${page}/edit-user/${item.uuid}`"><Icon icon="edit" /> Edit User</b-dropdown-item>
    
              <!-- <b-dropdown-item :to="`/app/organizations/${page}/edit/${item.uuid}`"><Icon icon="edit" /> Edit Organization</b-dropdown-item>
              <b-dropdown-item :to="`/app/organizations/${page}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete Organization</b-dropdown-item>
    
              <b-dropdown-divider />
              <b-dropdown-header>LOGS</b-dropdown-header>
    
              <b-dropdown-item :to="`/app/organizations/${page}/logs/${item.uuid}/organization/1`">All</b-dropdown-item> -->
    
            </b-dropdown>
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(item.uuid) > -1">
          <td colspan="5">
            <div class="collapsible-content">
              <AdministerUser
                :user="item"
                :groups="groups"
                :organizations="organizations"
                :page="page"
              />
            </div>
          </td>
        </tr>
      </TbodyCollapsible>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AdministerUser from '@/components/routes/administerUsers/AdministerUser';
import Icon from '@/components/shared/Icon';
import SortBy from '@/components/shared/SortBy';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Helpers from '@/helpers';

export default {
  name: 'Users',
  components: {
    AdministerUser,
    Icon,
    SortBy,
    TbodyCollapsible,
  },
  props: {
    users: {
      type: Array,
      required: false,
      default() { return []; },
    },
    page: {
      Type: Number,
      required: false,
      default() { return 1; },
    },
    path: {
      type: String,
      required: false,
      default() { return ''; },
    },
    title: {
      type: String,
      required: false,
      default() { return ''; },
    },
  },
  computed: {
    ...mapState({
      subjectDirectories: state => state.subjectDirectories.items,
      organizations: state => state.organizations.items,
      groups: state => state.groups.items,
    }),
    totalRows() {
      const { subjectDirectories, organizations, users } = this;
      const getDirectoryName = (subjectdirectoryid) => {
        const directory = subjectDirectories.find(item => item.uuid === subjectdirectoryid);
        return directory ? directory.directoryname : subjectdirectoryid;
      };
      const getOrganizationName = (organizationId) => {
        const organization = organizations.find(item => item.uuid === organizationId);
        return organization ? organization.name : organizationId;
      };
      const { sortByKey, sortByKeyType, sortDirection } = this;
      const { sortArrayOfObjects } = Helpers;
      return sortArrayOfObjects({
        array: users.map(item => ({
          ...item,
          directoryname: getDirectoryName(item.subjectdirectoryid),
          organizationname: getOrganizationName(item.organizationid),
        })).filter((item) => {
          const { filterKey } = this;
          if (filterKey === '') {
            return true;
          }
          const filterKeyLowerCase = filterKey.toLowerCase();
          return (
            (
              item.displayname &&
              item.displayname.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.username &&
              item.username.toLowerCase().indexOf(filterKeyLowerCase) > -1
            ) ||
            (
              item.email &&
              item.email.toLowerCase().indexOf(filterKeyLowerCase) > -1
            )
          );
        }),
        sortByKey,
        sortByKeyType,
        sortDirection,
      });
    },
  },
  data() {
    return {
      sortByKey: 'displayname',
      sortByKeyType: 'string',
      sortDirection: 'desc',
      filterKey: '',
      collapsedRows: [],
    };
  },
  created() {
    this.$store.dispatch('subjectDirectories/getSubjectDirectories', {});
    this.$store.dispatch('organizations/getOrganizations', {});
    this.$store.dispatch('groups/getGroups', {});
  },
  methods: {
    handleSortByClick({ sortByKey, sortByKeyType, sortDirection }) {
      this.sortByKey = sortByKey;
      this.sortByKeyType = sortByKeyType;
      this.sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    },
    handleCollapseTableRows(itemId) {
      const rowIndex = this.collapsedRows.indexOf(itemId);
      if (rowIndex === -1) {
        // this.collapsedRows.push(itemId);
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
};
</script>
