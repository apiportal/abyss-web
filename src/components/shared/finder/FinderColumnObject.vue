<template>
  <div class="finder-column-object-container">
    <ul class="menu">
      <li
        v-for="(prop, index) in computedProps"
        v-bind:key="index"
      >
        <b-link
          @click="() => onPathChange({ columnIndex, propName: prop.name })"
          :class="`${prop.name === selected ? 'selected': ''} ${prop.exists ? 'exists': 'nonexists'}`"
        >
          {{ prop.name }}
        </b-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: [Object, Array],
      required: false,
      default() { return {}; },
    },
    objectInterface: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    interfaceKey: {
      type: String,
      required: false,
      default() { return ''; },
    },
    columnIndex: {
      type: Number,
      required: true,
    },
    onPathChange: {
      type: Function,
      required: true,
    },
    path: {
      type: Array,
      required: true,
    },
    isArray: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    isMap: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
  },
  computed: {
    selected() {
      const { path, columnIndex } = this;
      return (
        path.length >= (columnIndex + 1) ?
        path[(columnIndex + 1)] :
        null
      );
    },
    computedProps() {
      const { data, objectInterface } = this;
      const objectProps = Object.keys(data);
      const computedObjectProps = objectProps.map(prop => ({
        name: prop,
        exists: true,
      }));
      const objectInterfaceProps = Object.keys(objectInterface)
        .filter(prop => objectProps.indexOf(prop) === -1)
        .map(prop => ({
          name: prop,
          exists: false,
        }));
      return [...computedObjectProps, ...objectInterfaceProps];
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

        &.nonexists {
          opacity: 0.5;
          filter: alpha(opacity=50);
        }
      }
    }
  }
}
</style>