<template>
  <b-link 
    @click="() => onClick({ sortByKey, sortByKeyType, sortDirection: selectedSortDirection })"
    :class="`${ sortByKey === selectedSortByKey ? 'active' : 'inactive'}`"
  >
    <Icon :icon="`${ selectedSortDirection === 'desc' ? 'caret-up' : 'caret-down'}`" />
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
};
</script>

<style lang="scss" scoped>
.inactive {
  color: silver;
}
</style>