<template>
  <tbody>
    <tr 
      v-for="(item, index) in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]" 
      v-bind:key="index"
      :class="`${index % 2 === 0 ? 'odd' : 'even'}`"
    >
      <td 
        v-for="(colItem, colIndex) in cols"
        v-bind:key="colIndex"
      >
        <span class="table-placeholder-item">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
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
  },
};
</script>