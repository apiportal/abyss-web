<template>
  <div class="form-array-container">
    <label>{{ label }}</label>

    <div class="form-array-items" v-if="items.type === 'object'">
      <div v-for="(valueItem, valueIndex) in value" v-bind:key="valueIndex" class="row">
        <div 
          v-for="(templateItem, templateIndex) in Object.keys(items.properties)"
          v-bind:key="templateIndex"
          class="col-md-4"
        >
          <DynamicFormInputString
            v-if="items.properties[templateItem].type === 'string'"
            :propAddress="propAddress"
            :onChange="handleInputValueChange"
            :value="valueItem[templateItem]"
            :description="items.properties[templateItem].description"
            :example="items.properties[templateItem].example"
          />
          <DynamicFormInputInteger
            v-else-if="items.properties[templateItem].type === 'integer' || items.properties[templateItem].type === 'number'"
            :propAddress="propAddress"
            :onChange="handleInputValueChange"
            :value="valueItem[templateItem]"
            :description="items.properties[templateItem].description"
            :example="items.properties[templateItem].example"
          />
        </div>
        <div class="col-md-1">
          <b-button style="margin-top: 32px;">
            <Icon icon="trash-alt" />
          </b-button>
        </div>
      </div>
      <div>
        <b-button style="margin-top: .5rem;">
          <Icon icon="plus" /> Add Item
        </b-button>
      </div>
    </div>
    <div class="form-array-items" v-else>
      <div v-for="(valueItem, index) in value" v-bind:key="index" class="row">
        <div class="col-md-4">
          <DynamicFormInputString
            v-if="items.type === 'string'"
            :propAddress="propAddress"
            :onChange="handleInputValueChange"
            :value="valueItem"
            :disabled="true"
          />
          <DynamicFormInputInteger
            v-else-if="items.type === 'integer' || items.type === 'number'"
            :propAddress="propAddress"
            :onChange="handleInputValueChange"
            :value="valueItem"
            :disabled="true"
          />
        </div>
        <div class="col-md-1">
          <b-button>
            <Icon icon="trash-alt" />
          </b-button>
        </div>
      </div>
      <div>
        <Chips
          :autocompleteOptions="items.enum.map(chip => ({ text: chip, value: chip }))"
          :onDeleteChip="handleDeleteChip"
          :onAddChip="handleAddChip"
        />
      </div>
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
    handleInputValueChange() {
      console.log('yo');
    },
    handleDeleteChip() {
      console.log('yo');
    },
    handleAddChip() {
      console.log('yo');
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