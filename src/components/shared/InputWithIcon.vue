<template>
  <b-input-group :size="size">
    <b-input-group-text slot="prepend" v-if="!prepend.empty">
      <Icon :icon="prepend.icon" />
    </b-input-group-text>
    <input
      class="form-control"
      :placeholder="placeholder"
    />
    <b-input-group-text slot="append" v-if="!append.empty">
      <Icon :icon="append.icon" />
    </b-input-group-text>
  </b-input-group>
</template>

<script>
import Icon from '@/components/shared/Icon';

export default {
  components: {
    Icon,
  },
  props: {
    size: {
      type: String,
      required: false,
      default() { return 'md'; },
    },
    placeholder: {
      type: String,
      required: false,
      default() { return ''; },
    },
    prepend: {
      type: Object,
      required: false,
      default() {
        return {
          empty: true,
        };
      },
    },
    append: {
      type: Object,
      required: false,
      default() {
        return {
          empty: true,
        };
      },
    },
  },
};
</script>