<template>
  <tbody>
    <tr
      v-for="(item, index) in rows"
      v-bind:key="index"
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

<style lang="scss" scoped>
tr {
  border-bottom: 10px solid #eeeeee !important;
  box-shadow: none !important;
}
.table-placeholder-item {
  width: 100%;
  height: 16px;
  margin: 4px 0;
  background-image: 
    repeating-linear-gradient(
      -45deg,
      #f8f8f8,
      #f8f8f8 10px,
      #eee 10px,
      #eee 20px /* determines size */
    );
  background-size: 28px 28px;
  animation: move .5s linear infinite;
}
// high cpu
// @keyframes move {
//   0% {
//     background-position: 0 0;
//   }
//   100% {
//     background-position: 28px 0;
//   }
// }
</style>
