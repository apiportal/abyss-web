<template>
  <div>
    <DynamicFormInputString
      v-if="type === 'string'"
      :label="title"
      :example="example"
      :description="description"
      :readonly="readonly"
    />
    <DynamicFormInputInteger
      v-else-if="type === 'integer'"
      :label="title"
      :example="example"
      :description="description"
      :readonly="readonly"
    />
    <DynamicFormCheckbox
      v-else-if="type === 'boolean'"
      :label="title"
      :example="example"
      :description="description"
      :readonly="readonly"
    />
    <div v-else>
      {{ title }} {{ type }} {{ example }} {{ readonly }}
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
  },
  components: {
    DynamicFormInputString,
    DynamicFormInputInteger,
    DynamicFormCheckbox,
  },
};
</script>
