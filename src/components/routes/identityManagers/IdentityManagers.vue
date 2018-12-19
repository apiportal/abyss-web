<template>
  <div>
    <table class="table">
      <tr v-for="(item, index) in subjectDirectories" v-bind:key="index">
        <td>
          {{ item.uuid }}
        </td>
        <td>
          {{ item.directoryname }}
        </td>
        <td>
          <b-button :to="`/app/identity-managers/edit/${item.uuid}`">
            <Icon icon="edit" />
          </b-button>
        </td>
      </tr>
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
    }),
  },
  created() {
    this.$store.dispatch('subjectDirectories/getSubjectDirectories');
  },
  mounted() {
    document.cookie = 'abyss.principal.uuid=32c9c734-11cb-44c9-b06f-0b52e076672d; abyss.login.organization.uuid=3c65fafc-8f3a-4243-9c4e-2821aa32d293; abyss.login.organization.name=Abyss; abyss.session=c122499d77c62a30a5531f0d68c24f06';
  },
};
</script>