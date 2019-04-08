<template>
  <div :class="`operation operation-${operationKey}`">
    <div class="operation-bar" @click="toggleOperationDetails">
      <span class="operation-name">{{ operationKey }}</span>
      <span class="path-name">{{ pathKey }}</span>
      <span class="operation-summary">{{ operation.summary }}</span>
    </div>
    <div class="operation-details" v-if="isOperationDetailsVisible">
      <OpenApiObjectForm
        type="Operation Object"
        :formData="operation"
        :pathArray="['openapidocument', 'paths', pathKey, operationKey]"
        :onChange="onChange"
        :refs="refs"
        :securitySchemes="securitySchemes"
      />
    </div>
  </div>
</template>

<script>
import OpenApiObjectForm from '@/components/shared/apiDesigner/abyssTool/OpenApiObjectForm';

export default {
  props: {
    operation: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    operationKey: {
      type: String,
      required: false,
      default() { return ''; },
    },
    pathKey: {
      type: String,
      required: false,
      default() { return ''; },
    },
    onChange: {
      type: Function,
      required: true,
    },
    refs: {
      type: Array,
    },
    securitySchemes: {
      type: Object,
    },
  },
  components: {
    OpenApiObjectForm,
  },
  data() {
    return {
      isOperationDetailsVisible: false,
    };
  },
  methods: {
    toggleOperationDetails() {
      this.isOperationDetailsVisible = !this.isOperationDetailsVisible;
    },
  },
};
</script>

<style lang="scss">
.operation {
  margin-bottom: 1rem;
  border-radius: .3rem;
  
  .operation-bar {
    padding: .5rem;
    display: flex;
    cursor: pointer;

    & > .operation-name {
      border-radius: .3rem;
      text-transform: uppercase;
      font-weight: bold;
      color: white;
      min-width: 80px;
      text-align: center;
    }

    & > .path-name {
      margin-left: 1rem;
      font-weight: bold;
    }

    & > .operation-summary {
      margin-left: 1rem;
      font-size: .75rem;
      vertical-align: middle;
      line-height: 24px;
    }
  }

  .operation-details {
    padding: .5rem;
  }

  &.operation-get {
    border: 1px solid #61affe;
    background: rgba(97,175,254,.1);

    .operation-name {
      background: #61affe;
    }

    .operation-details {
      border-top: 1px solid #61affe;
    }
  }

  &.operation-put {
    border: 1px solid #FCA129;
    background: rgba(252,161,48,.1);

    .operation-name {
      background: #FCA129;
    }

    .operation-details {
      border-top: 1px solid #FCA129;
    }
  }

  &.operation-post {
    border: 1px solid #49cc90;
    background: rgba(73,204,144,.1);

    .operation-name {
      background: #49cc90;
    }

    .operation-details {
      border-top: 1px solid #49cc90;
    }
  }

  &.operation-delete {
    border: 1px solid #f93e3e;
    background: rgba(249,62,62,.1);

    .operation-name {
      background: #f93e3e;
    }

    .operation-details {
      border-top: 1px solid #f93e3e;
    }
  }
}
</style>