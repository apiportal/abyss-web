<template>
  <b-input-group :size="size">
    <b-input-group-text slot="prepend" v-if="!prepend.empty">
      <Icon :icon="prepend.icon" :prefix="prepend.prefix" />
    </b-input-group-text>
    <input
      v-model="value"
      :type="type"
      class="form-control"
      :placeholder="placeholder"
      @keydown="handleKeydown"
      @keyup="handleKeyup"
      @keypress="handleKeypress"
      id="IdFilter"
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
    type: {
      type: String,
      required: false,
      default() { return 'text'; },
    },
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
    onKeydown: {
      type: Function,
      required: false,
    },
    onKeyup: {
      type: Function,
      required: false,
    },
    onKeypress: {
      type: Function,
      required: false,
    },
  },
  data() {
    return {
      value: null,
    };
  },
  methods: {
    handleKeydown(event) {
      if (this.onKeydown) {
        const { value } = this;
        return this.onKeydown({ event, value });
      }
      return false;
    },
    handleKeyup(event) {
      if (this.onKeyup) {
        const { value } = this;
        return this.onKeyup({ event, value });
      }
      return false;
    },
    handleKeypress(event) {
      if (this.onKeypress) {
        const { value } = this;
        return this.onKeypress({ event, value });
      }
      return false;
    },
  },
};
</script>