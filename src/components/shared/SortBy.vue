<template>
  <b-link
    @click="() => onClick({ sortByKey, sortByKeyType, sortDirection: selectedSortDirection })"
  >
    <span class="link-text">{{text}}</span>
    <Icon :icon="`${ selectedSortDirection === 'desc' ? 'caret-up' : 'caret-down'}`"
    :class="`${ sortByKey === selectedSortByKey ? 'active' : 'inactive'}`" />
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
    text: {
      type: String,
      required: false,
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
