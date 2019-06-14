<template>
  <div class="page-container page-groups">
    <div class="page-header">
      <div class="row">
        <div class="col">
          <InputWithIcon
            :prepend="{ icon: 'filter' }"
            placeholder="Type to filter"
            :onKeyup="handleFilterKeyup"
            class="page-filter"
          />
        </div>
        <div class="col-auto">
          <b-button
            v-b-tooltip.hover
            title="Refresh"
            variant="link"
            class="page-btn-refresh"
            block
            @click="refreshData"
            data-qa="btnRefresh"
          >
            <Icon icon="redo" />
          </b-button>
        </div>
        <div class="col-auto">
          <b-button
            :to="`/app/groups/groups/${page}/add-new`"
            variant="primary"
            v-b-tooltip.hover
            title="Add New Group"
            class="page-btn-add"
            block
            data-qa="btnAddNew"
          >
            <span class="btn-text">Add New</span>
            <Icon icon="plus" />
          </b-button>
        </div>
      </div>
    </div>
    <div class="page-content">
      <Groups
        :rows="tableRows"
        :routePath="`/app/groups/groups/${page}`"
        :itemsPerPage="itemsPerPage"
        :page="page"
      />
      <router-view></router-view>
    </div>
    <div class="page-footer" v-if="tableRows.length > itemsPerPage">
      <b-pagination
        size="md"
        :total-rows="tableRows.length"
        v-model="page"
        :per-page="itemsPerPage"
        align="center"
        @change="handlePageChange"
        data-qa="footerPagination"
      >
      </b-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Groups from '@/components/routes/groups/shared/Groups';
import InputWithIcon from '@/components/shared/InputWithIcon';
import Icon from '@/components/shared/Icon';
import Helpers from '@/helpers';

export default {
  components: {
    Groups,
    InputWithIcon,
    Icon,
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      groups: state => state.groups.items,
      users: state => state.users.items,
      memberships: state => state.subjectMemberships.items,
      userGroupMemberships: state => state.subjectMemberships.userGroup,
    }),
    tableRows() {
      const { groups, users } = this;
      const getUsers = (groupId) => {
        const members = this.memberships.filter(item =>
          !item.isdeleted &&
          item.subjectgroupid === groupId);
        const groupUsers = users.filter(el =>
          members.some(f =>
            f.subjectid === el.uuid,
          ),
        );
        return groupUsers;
      };
      const getUserFromGroups = (groupId) => {
        const group = this.userGroupMemberships.find(item => item.subjectgroupid === groupId) || {};
        return group.subjectid || groupId;
      };
      const { sortByKey, sortByKeyType, sortDirection } = this;
      const { sortArrayOfObjects } = Helpers;
      return sortArrayOfObjects({
        array: groups.map(item => ({
          ...item,
          users: getUsers(item.uuid),
          userscount: getUsers(item.uuid).length,
          currentuser: getUserFromGroups(item.uuid),
        })).filter((item) => {
          if (
            item.currentuser === this.currentUser.props.uuid
            || item.users.find(i => i.uuid === this.currentUser.props.uuid)
          ) {
            const { filterKey } = this;
            if (filterKey === '') {
              return true;
            }
            const filterKeyLowerCase = filterKey.toLowerCase();
            return (
              (
                item.firstname &&
                item.firstname.toLowerCase().indexOf(filterKeyLowerCase) > -1
              ) ||
              (
                item.lastname &&
                item.lastname.toLowerCase().indexOf(filterKeyLowerCase) > -1
              ) ||
              (
                item.displayname &&
                item.displayname.toLowerCase().indexOf(filterKeyLowerCase) > -1
              ) ||
              (
                item.email &&
                item.email.toLowerCase().indexOf(filterKeyLowerCase) > -1
              )
            );
          }
          return false;
        }),
        sortByKey,
        sortByKeyType,
        sortDirection,
      });
    },
  },
  created() {
    this.$store.commit('currentPage/setFirstChildPath', 'groups');
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      sortByKey: 'displayname',
      sortByKeyType: 'string',
      sortDirection: 'desc',
      filterKey: '',
      collapsedRows: [],
      itemsPerPage: 20,
    };
  },
  methods: {
    handleFilterKeyup({ value }) {
      this.filterKey = value;
    },
    handlePageChange(page) {
      this.$router.push(`/app/groups/groups/${page}`);
    },
    refreshData() {
      this.$store.dispatch('groups/getGroups', {
        refresh: true,
      });
    },
  },
};
</script>
