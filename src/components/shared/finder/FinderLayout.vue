<template>
  <div class="finder-layout-container">
    <header>
      <span 
        v-for="(propName, columnIndex) in path"
        v-bind:key="columnIndex"
      >
        <b-link
          @click="() => onPathChange({ columnIndex: (columnIndex - 1), propName })"
        >
          {{ propName === '' ? name : propName }}
        </b-link>
        <span v-if="(columnIndex + 1) < path.length">
          &raquo;
        </span>
      </span>
    </header>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: false,
      default() { return ''; },
    },
    path: {
      type: Array,
      required: true,
    },
    onPathChange: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.finder-layout-container {
  display: flex;
  flex-direction: column;
  flex: 1 0 0;

  header {
    border-bottom: 1px solid silver;
    flex: 40px 0 0;
    padding: .5em 1em;
  }

  main {
    flex: 1 0 0;
    display: flex;
    flex-direction: row;
    overflow-y: auto;
  }
}
</style>
