<template>
  <tbody :class="`tbody-collapsible ${isCollapsed ? 'tbody-collapsed' : ''} level-${level}`">
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
    level: {
      type: Number,
      required: false,
      default() { return 0; },
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

      &:hover {
        td {
          background: #b3e5fc;
        }
      }
    }

    &.footer {
      td {}
    }
  }

  .collapsible-content {
  }

  &.tbody-collapsed {
    border: 2px solid #29b6f6;

    & > tr:first-child {
      & > td {
        background: #29b6f6;
        color: white;
      }
    }

    & > tr:last-child {
      & > td {
        padding: 2rem;
      }
    }

    &.level-0 {
      & > tr:last-child {
        & > td {
          background-color: rgba(#007BFE, .1);
        }
      }
    }

    &.level-1 {
      & > tr:last-child {
        & > td {
          background-color: rgba(#007BFE, .13);
        }
      }
    }

    &.level-2 {
      & > tr:last-child {
        & > td {
          background-color: rgba(#007BFE, .16);
        }
      }
    }

    &.level-3 {
      & > tr:last-child {
        & > td {
          background-color: rgba(#007BFE, .19);
        }
      }
    }

  }
}
</style>