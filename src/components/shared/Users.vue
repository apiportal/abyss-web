<template>
  <table class="table verapi-table">
    <thead>
      <tr>
        <th>
          Status
          <SortBy
            :selectedSortByKey="sortByKey"
            :selectedSortDirection="sortDirection"
            :onClick="handleSortByClick"
            sortByKey="isactivated"
            sortByKeyType="boolean"
          />
        </th>
        <th>
          Display Name
          <SortBy
            :selectedSortByKey="sortByKey"
            :selectedSortDirection="sortDirection"
            :onClick="handleSortByClick"
            sortByKey="displayname"
            sortByKeyType="string"
          />
        </th>
        <th>
          User Name
          <SortBy
            :selectedSortByKey="sortByKey"
            :selectedSortDirection="sortDirection"
            :onClick="handleSortByClick"
            sortByKey="subjectname"
            sortByKeyType="string"
          />
        </th>
        <th>
          E-mail
          <SortBy
            :selectedSortByKey="sortByKey"
            :selectedSortDirection="sortDirection"
            :onClick="handleSortByClick"
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
        <td @click="() => handleCollapseTableRows(item.uuid)">
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
        <td class="py-2 text-right">
          <b-button
            :to="`/app/organizations/${page}/edit-user/${item.uuid}`"
            size="sm"
            variant="secondary"
            v-b-tooltip.hover
            title="Edit"
          >
            <Icon icon="edit" />
            <span>Edit User</span>
          </b-button>
        </td>
      </tr>
      <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(item.uuid) > -1">
        <td colspan="5">
          <div class="collapsible-content">
            <AdministerUser
              :user="item"
              :groups="groups"
              :page="page"
            />
            <!-- <div class="row">
              <dl class="px-3">
                <dt class="bg-cover mb-2 bg-secondary rounded-circle embed-responsive embed-responsive-1by1" style="width: 150px;" :style="{ 'background-image': 'url(' + item.picture + ')' }"></dt>
              </dl>
              <dl class="col">
                <dt>First Name:</dt>
                <dd>{{ item.firstname }}</dd>
                <dt>Last Name:</dt>
                <dd>{{ item.lastname }}</dd>
                <dt>User Name:</dt>
                <dd>{{ item.subjectname }}</dd>
                <dt>Display Name:</dt>
                <dd>{{ item.displayname }}</dd>
              </dl>
              <dl class="col">
                <dt>Organization:</dt>
                <dd>{{ item.organizationname }}</dd>
                <dt>Directory:</dt>
                <dd>{{ item.directoryname }}</dd>
                <dt>Description:</dt>
                <dd>{{ item.description }}</dd>
              </dl>
             
              <dl class="col">
                <dt>Email:</dt>
                <dd>{{ item.email }}</dd>
                <dt>Secondary Email:</dt>
                <dd>{{ item.secondaryemail }}</dd>
                <dt>uuid:</dt>
                <dd><code>{{ item.uuid }}</code></dd>
              </dl>
              
              <dl class="col-1">
                <dt>Active:</dt>
                <dd>{{ item.isactivated }}</dd>
                <dt>Deleted:</dt>
                <dd>{{ item.isdeleted }}</dd>
                <dt>Locked:</dt>
                <dd>{{ item.islocked }}</dd>
              </dl>
              
              <dl class="col">
                <dt>Created:</dt>
                <dd>{{ item.created }}</dd>
                <dt>Updated:</dt>
                <dd>{{ item.updated }}</dd>
                <dt>Deleted:</dt>
                <dd>{{ item.deleted }}</dd>
              </dl>
            </div> -->
          </div>
        </td>
      </tr>
    </TbodyCollapsible>
  </table>
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
    this.$store.dispatch('subjectDirectories/getSubjectDirectories');
    this.$store.dispatch('organizations/getOrganizations');
    this.$store.dispatch('groups/getGroups');
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
        this.collapsedRows.push(itemId);
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
};
</script>
