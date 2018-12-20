<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th>
            Status
          </th>
          <th>
            Name
          </th>
          <th>
            Priority Order
          </th>
          <th>
            Directory Type
          </th>
          <th>
            Organization
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableRows" v-bind:key="index">
          <td>
            {{ item.isactive }}
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
            <b-button :to="`/app/identity-managers/edit/${item.uuid}`" size="sm">
              <Icon icon="edit" />
            </b-button>
          </td>
        </tr>
      </tbody>
    </table>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Icon from '@/components/shared/Icon';

export default {
  components: {
    Icon,
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
      return subjectDirectories.map(item => ({
        ...item,
        directorytypename: getDirectoryTypeName(item.directorytypeid),
        organizationname: getOrganizationName(item.organizationid),
      }));
    },
  },
  created() {
    this.$store.dispatch('subjectDirectories/getSubjectDirectories');
    this.$store.dispatch('subjectDirectoryTypes/getSubjectDirectoryTypes');
    this.$store.dispatch('organizations/getOrganizations');
  },
  mounted() {
    document.cookie = 'abyss.principal.uuid=32c9c734-11cb-44c9-b06f-0b52e076672d; abyss.login.organization.uuid=9287b7dc-058d-4399-aad0-6fa704decb6b; abyss.login.organization.name=FAIKsOrganization; abyss.session=25c22ff4a8f4949660eb57d9e44e2302';
  },
  methods: {
  },
};
</script>