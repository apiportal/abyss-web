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
  watch: {
    // TODO cover component resize possibility
    isCollapsed(newval) {
      if (newval) {
        setTimeout(function() { // eslint-disable-line
          this.$el.querySelectorAll('.collapsible-content')[0].style.width = `${this.$el.clientWidth - 2}px`;
          this.$el.querySelectorAll('.collapsible-content')[0].style.display = 'block';
        }.bind(this), 100);
      }
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
    width: 0;
    display: none;
    overflow-y: auto; 
    padding: 0;
  }

  &.tbody-collapsed {

    & > tr:first-child {
      & > td {
        background: #1164A3;
        border-top: 2px solid #1164A3; 
        color: white;

        &:first-child {
         border-left: 2px solid #1164A3; 
        }

        &:last-child {
         border-right: 2px solid #1164A3; 
        }
      }
    }

    & > tr:last-child {
      & > td {
        padding: 0;
        border: 2px solid #1164A3;
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