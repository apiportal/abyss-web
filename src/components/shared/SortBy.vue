<template>
  <b-link @click="handleClick">
    <Icon :icon="`${'caret-up'}`" />
  </b-link>
</template>

<script>
import Icon from '@/components/shared/Icon';

export default {
  components: {
    Icon,
  },
  props: {
    selectedSortByKey: {
      type: String,
      required: true,
    },
    selectedSortDirection: {
      type: String,
      required: true,
    },
    sortByKey: {
      type: String,
      required: true,
    },
    sortByKeyType: {
      type: String,
      required: true,
    },
    onClick: {
      type: Function,
      required: true,
    },
  },
  methods: {
    handleClick() {},
  },
};
</script>