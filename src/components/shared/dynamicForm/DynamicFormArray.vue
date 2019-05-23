<template>
  <div class="form-array-container">
    <label>{{ label }}</label>

    <div class="form-array-items" v-if="items.type === 'object'">
      <div v-for="(valueItem, valueIndex) in value" v-bind:key="valueIndex" class="row">
        <div
          v-for="(templateItem, templateIndex) in Object.keys(items.properties)"
          v-bind:key="templateIndex"
          class="col"
        >
          <DynamicFormInputString
            v-if="items.properties[templateItem].type === 'string'"
            :propAddress="propAddress"
            :onChange="(propAddress, val) => handleInputValueChange(val, valueIndex, templateItem)"
            :value="valueItem[templateItem]"
            :description="items.properties[templateItem].description"
            :example="items.properties[templateItem].example"
          />
          <DynamicFormInputInteger
            v-else-if="items.properties[templateItem].type === 'integer' || items.properties[templateItem].type === 'number'"
            :propAddress="propAddress"
            :onChange="(propAddress, val) => handleInputValueChange(val, valueIndex, templateItem)"
            :value="valueItem[templateItem]"
            :description="items.properties[templateItem].description"
            :example="items.properties[templateItem].example"
          />
        </div>
        <div class="col-auto">
          <b-button @click="handleDeleteItemArrayObject(valueIndex)" style="margin-top: 32px;">
            <Icon icon="trash-alt" />
          </b-button>
        </div>
      </div>
      <div>
        <b-button variant="info" @click="handleAddItemArrayObj" style="margin-top: .5rem;">
          <Icon icon="plus" /> Add Item
        </b-button>
      </div>
    </div>
    <div class="form-array-items" v-else>
      <Chips
        :autocompleteOptions="items.enum ? items.enum.map(chip => ({ text: chip, value: chip })) : []"
        :chips="value ? value.map(chip => ({ text: chip, value: chip })) : []"
        :onDeleteChip="handleDeleteChip"
        :onAddChip="handleAddChip"
      />
    </div>
  </div>
</template>

<script>
import DynamicFormInputString from '@/components/shared/dynamicForm/DynamicFormInputString';
import DynamicFormInputInteger from '@/components/shared/dynamicForm/DynamicFormInputInteger';
import Icon from '@/components/shared/Icon';
import Chips from '@/components/shared/Chips';

export default {
  props: {
    label: {
      type: String,
      required: false,
      default() { return ''; },
    },
    items: {
      type: Object,
      required: false,
      default() { return {}; },
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
      required: false,
    },
  },
  components: {
    DynamicFormInputString,
    DynamicFormInputInteger,
    Icon,
    Chips,
  },
  methods: {
    handleInputValueChange(val, index, key) {
      const { value, propAddress, onChange } = this;
      const valueEditable = [...value];
      valueEditable[index][key] = val;
      onChange(propAddress, valueEditable);
    },
    handleDeleteChip(index) {
      const { value, propAddress, onChange } = this;
      const valueEditable = [...value];
      valueEditable.splice(index, 1);
      onChange(propAddress, valueEditable);
    },
    handleAddChip(chip) {
      const { value, propAddress, onChange } = this;
      onChange(propAddress, [...(value || []), chip.value]);
    },
    handleAddItemArrayObj() {
      const { value, propAddress, onChange } = this;
      const newItemArrayObj = {};
      const { properties } = this.items;
      const propertiesKeys = Object.keys(properties);

      for (let i = 0; i < propertiesKeys.length; i += 1) {
        newItemArrayObj[propertiesKeys[i]] = properties[propertiesKeys[i]].example;
      }

      onChange(propAddress, [...(value || []), newItemArrayObj]);
    },
    handleDeleteItemArrayObject(index) {
      const { value, propAddress, onChange } = this;
      const valueEditable = [...value];
      valueEditable.splice(index, 1);
      onChange(propAddress, valueEditable);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-array-container {
  margin-top: 1rem;

  .form-array-items {
    border: 1px solid #e9ecef;
    border-radius: .3em;
    padding: 1rem;
  }
}

</style>