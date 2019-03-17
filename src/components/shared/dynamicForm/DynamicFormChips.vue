<template>
  <div>
    <label>{{ label }}</label>
    <div class="chips-container">
      <Chips
        :chips="value.map(chip => ({ text: chip, value: chip }))"
        :onDeleteChip="handleDeleteChip"
        :onAddChip="handleAddChip"
        :addItemText="addItemText"
      />
    </div>
  </div>
</template>

<script>
import Chips from '@/components/shared/Chips';

export default {
  props: {
    label: {
      type: String,
      required: false,
      default() { return ''; },
    },
    propAddress: {
      type: Array,
      required: false,
      default() { return []; },
    },
    onChange: {
      type: Function,
      required: true,
    },
    value: {
      type: Array,
      required: false,
      default() { return []; },
    },
    addItemText: {
      type: String,
      required: false,
    },
  },
  components: {
    Chips,
  },
  methods: {
    handleAddChip(chip) {
      console.log(chip); // eslint-disable-line
    },
    handleDeleteChip(index) {
      console.log(index); // eslint-disable-line
    },
  },
};
</script>

<style lang="scss" scoped>
.chips-container {
  border: 1px solid silver;
  border-radius: .3rem;
  background: white;
  padding: .5rem;
}
</style>
