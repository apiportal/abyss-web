<template>
  <tbody class="tbody-collapsible">
    <slot name="main"></slot>
    <slot name="footer" v-if="isCollapsed"></slot>
  </tbody>
</template>

<script>
export default {
  props: {
    isCollapsed: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
  },
};
</script>

<style lang="scss" scoped>
.tbody-collapsible {
  & > tr {
    &:first-child {
      td {
        cursor: pointer;
      }
    }

    &.footer {
      td {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }

  .collapsible-content {
    border: 1px solid #e7eaf3;
    border-radius: .25em;
    padding: 1rem;
  }
}
</style>