<template>
  <div class="finder-column-object-container">
    <ul class="menu">
      <li
        v-for="(propName, index) in propNames"
        v-bind:key="index"
      >
        <b-link
          @click="() => onPathChange({ columnIndex, propName })"
          :class="propName === selected ? 'selected': ''"
        >
          {{ propName }}
        </b-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    propNames: {
      type: Array,
      required: true,
    },
    columnIndex: {
      type: Number,
      required: true,
    },
    onPathChange: {
      type: Function,
      required: true,
    },
    selected: {
      type: String,
      required: false,
      default() { return ''; },
    },
  },
};
</script>

<style lang="scss">
.finder-column-object-container {
  ul.menu {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      padding: 0;
      margin: 0;

      a {
        display: block;
        padding: .5em 1em;

        &.selected {
          background-color: rgb(216, 216, 216);
        }
      }
    }
  }
}
</style>