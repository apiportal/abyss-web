<template>
  <tbody>
    <tr
      v-for="(item, index) in rows"
      v-bind:key="index"
      :class="`${index % 2 === 0 ? 'odd' : 'even'}`"
    >
      <td
        v-for="(colItem, colIndex) in cols"
        v-bind:key="colIndex"
      >
        <div class="table-placeholder-item">&nbsp;</div>
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {
  props: {
    cols: {
      type: Number,
      required: true,
    },
    rows: {
      type: Number,
      required: false,
      default() { return 20; },
    },
  },
};
</script>