<template>
  <div>
    {{ item }}
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