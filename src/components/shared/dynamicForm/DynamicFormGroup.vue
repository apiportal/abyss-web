<template>
  <div>
    <DynamicFormInputString
      v-if="type === 'string'"
      :label="title"
      :example="example"
      :description="description"
      :readonly="readonly"
      :required="required"
      :propAddress="propAddress"
      :onChange="onChange"
      :value="value"
    />
    <DynamicFormInputInteger
      v-else-if="type === 'integer'"
      :label="title"
      :example="example"
      :description="description"
      :readonly="readonly"
      :required="required"
      :propAddress="propAddress"
      :onChange="onChange"
      :value="value"
    />
    <DynamicFormCheckbox
      v-else-if="type === 'boolean'"
      :label="title"
      :example="example"
      :description="description"
      :readonly="readonly"
      :required="required"
      :propAddress="propAddress"
      :onChange="onChange"
      :value="value"
    />
    <div v-else>
      <span style="color: red">Unknown Type: {{ type }}</span>
      <br>
      {{ title }}
    </div>
  </div>
</template>

<script>
import DynamicFormInputString from '@/components/shared/dynamicForm/DynamicFormInputString';
import DynamicFormInputInteger from '@/components/shared/dynamicForm/DynamicFormInputInteger';
import DynamicFormCheckbox from '@/components/shared/dynamicForm/DynamicFormCheckbox';

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    example: {
      type: [String, Number, Boolean],
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    readonly: {
      type: Boolean,
      required: false,
    },
    required: {
      type: Boolean,
      required: false,
      default() { return false; },
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
    DynamicFormCheckbox,
  },
};
</script>
