<template>
  <div>
    <header>
      MAIN
    </header>
    <main>
      <label for="">Method:</label>
      <b-form-select
        v-model="methodEditable"
        :options="methods"
        @change="(newVal) => onMethodChange({
          path,
          oldVal: method,
          newVal,
        })"
      />
      <label for="">Decription:</label>
      {{ description }}
      <b-form-input 
        type="text" 
        v-model="descriptionEditable" 
        @keyup.native="() => onDescriptionChange({
          path,
          method,
          newVal: descriptionEditable,
        })"
      ></b-form-input>
      <label for="">Summary:</label>
      <b-form-input 
        type="text" 
        v-model="summaryEditable"
        @keyup.native="() => onSummaryChange({
          path,
          method,
          newVal: summaryEditable,
        })"
      ></b-form-input>
      <p>{{ tags }}</p>
    </main>
  </div>
</template>

<script>
export default {
  props: {
    method: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: false,
      default() { return ''; },
    },
    description: {
      type: String,
      required: false,
      default() { return ''; },
    },
    summary: {
      type: String,
      required: false,
      default() { return ''; },
    },
    tags: {
      type: Array,
      required: false,
      default() { return []; },
    },
    operationId: {
      type: String,
      required: false,
      default() { return ''; },
    },
    onMethodChange: {
      type: Function,
      required: true,
    },
    onDescriptionChange: {
      type: Function,
      required: true,
    },
    onSummaryChange: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      methods: [
        {
          value: 'get',
          text: 'GET',
        },
        {
          value: 'post',
          text: 'POST',
        },
        {
          value: 'put',
          text: 'PUT',
        },
        {
          value: 'delete',
          text: 'DELETE',
        },
        {
          value: 'head',
          text: 'HEAD',
        },
        {
          value: 'patch',
          text: 'PATCH',
        },
        {
          value: 'options',
          text: 'OPTIONS',
        },
        {
          value: 'trace',
          text: 'TRACE',
        },
      ],
      methodEditable: this.method,
      descriptionEditable: this.description,
      summaryEditable: this.summary,
      tagsEditable: this.tags,
      operationIdEditable: this.operationId,
    };
  },
};
</script>