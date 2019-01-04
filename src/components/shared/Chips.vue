<template>
  <div>
    <ul class="chips-ul">
      <li 
        v-for="(chip, index) in chips" 
        v-bind:key="index"
        class="btn btn-secondary chip-btn"
      >
        {{ chip.text }}
        <b-link
          v-b-tooltip.hover 
          title="Delete"
        >
          <Icon icon="times" />
        </b-link>
      </li>
      <li>
        <b-button variant="success">
          <span>Add</span>
          <Icon icon="plus" />
        </b-button>
      </li>
    </ul>
  </div>
</template>

<script>
import Icon from '@/components/shared/Icon';

export default {
  components: {
    Icon,
  },
  props: {
    autocompleteOptions: {
      type: Array,
      required: false,
      default() { return []; },
    },
    chips: {
      type: Array,
      required: false,
      default() { return []; },
    },
  },
};
</script>

<style lang="scss" scoped>
.chips-ul {
  list-style-type: none;
  padding: 0;
  margin: 0;

  li {
    display: inline-block;

    &.chip-btn {
      cursor: default;
      margin-left: .25em;

      &:first-child {
        margin-left: 0;
      }

      a {
        color: white;
        text-decoration: none;
      }
    }
  }
}
</style>