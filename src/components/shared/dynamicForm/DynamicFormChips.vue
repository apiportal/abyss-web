<template>
  <div>
    <label>{{ label }}</label>
    <div class="chips-container">
      <Chips
        :chips="value.map(chip => ({ text: chip, value: chip }))"
        :autocompleteOptions="autocompleteOptions"
        :onDeleteChip="handleDeleteChip"
        :onAddChip="handleAddChip"
        :addItemText="addItemText"
        :type="type"
      />
    </div>
  </div>
</template>

<script>
import Chips from '@/components/shared/Chips';

export default {
  props: {
    autocompleteOptions: {
      type: Array,
      required: false,
      default() { return []; },
    },
    label: {
      type: String,
      required: false,
      default() { return ''; },
    },
    type: {
      type: String,
      required: false,
      default() { return 'string'; },
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
      const { propAddress, value } = this;
      this.onChange(propAddress, [...value, chip.value]);
    },
    handleDeleteChip(indexToDelete) {
      const { propAddress, value } = this;
      this.onChange(propAddress, [...value.filter((item, index) => index !== indexToDelete)]);
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
  margin-bottom: 1rem;
}
</style>
