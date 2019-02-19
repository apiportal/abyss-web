<template>
  <div>
    <p><strong>Title:</strong> {{ item.name }}</p>
    <p><strong>Description:</strong> {{ item.description }}</p>
    <p><strong>Policy Instance:</strong> {{ item.policyinstance }}</p>
    <div>
      <b-dropdown variant="secondary" size="sm">
        <template slot="button-content">
          <Icon icon="list-ol" />
          <span>Policy Logs</span>
        </template>
        <b-dropdown-item :to="`/app/my-apis/businesses/${page}/logs/${item.uuid}/all/1`">All</b-dropdown-item>
      </b-dropdown>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/shared/Icon';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  components: {
    Icon,
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
    };
  },
};
</script>