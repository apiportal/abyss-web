<template>
  <div :class="`operation operation-${operationKey}`">
    <div class="operation-bar" @click="toggleOperationDetails">
      <span class="operation-name">{{ operationKey }}</span>
      <span class="path-name">{{ pathKey }}</span>
      <span class="operation-summary">{{ operation.summary }}</span>
      <span class="operation-more-button">
        <b-dropdown variant="link" size="md" right no-caret>
          <template slot="button-content"><Icon icon="ellipsis-h" /></template>
          <b-dropdown-item @click="handleDeleteOperation">Delete operation</b-dropdown-item>
        </b-dropdown>
      </span>
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
import Icon from '@/components/shared/Icon';

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
    Icon,
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
    handleDeleteOperation() {
      const { pathKey, operationKey } = this;
      this.toggleOperationDetails();
      this.onChange(['openapidocument', 'paths', pathKey, operationKey], null, 'deleteLastItem');
    },
  },
};
</script>

<style lang="scss">
.operation {
  margin-bottom: 1rem;
  
  .operation-bar {
    display: flex;
    cursor: pointer;

    & > .operation-name {
      padding: .5rem;
      text-transform: uppercase;
      font-weight: bold;
      color: white;
      min-width: 80px;
      text-align: center;
    }

    & > .path-name {
      font-weight: bold;
      padding: .5rem .5rem .5rem 1rem;
    }

    & > .operation-summary {
      font-size: .75rem;
      vertical-align: middle;
      line-height: 24px;
      flex: 1;
      padding: .5rem;
    }

    & > .operation-more-button {
      .btn {
        padding: .5rem 0;
        width: 2.5rem;
        text-align: center;
        svg { width: 1rem; }
      }
    }
  }

  .operation-details {
    padding: 1rem;
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
    .operation-more-button {
      border-left: 1px solid #61affe;
      svg { color: #61affe; }
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
    .operation-more-button {
      border-left: 1px solid #FCA129;
      svg { color: #FCA129; }
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
    .operation-more-button {
      border-left: 1px solid #49cc90;
      svg { color: #49cc90; }
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
    .operation-more-button {
      border-left: 1px solid #f93e3e;
      svg { color: #f93e3e; }
    }
  }

  &.operation-patch {
    border: 1px solid #50e3c2;
    background: rgba(80,227,194,.1);
    .operation-name {
      background: #50e3c2;
    }
    .operation-details {
      border-top: 1px solid #50e3c2;
    }
    .operation-more-button {
      border-left: 1px solid #50e3c2;
      svg { color: #50e3c2; }
    }
  }

  &.operation-options {
    border: 1px solid #0d5aa7;
    background: rgba(13,90,167,.1);
    .operation-name {
      background: #0d5aa7;
    }
    .operation-details {
      border-top: 1px solid #0d5aa7;
    }
    .operation-more-button {
      border-left: 1px solid #0d5aa7;
      svg { color: #0d5aa7; }
    }
  }

  &.operation-head {
    border: 1px solid #9012fe;
    background: rgba(144,18,254,.1);
    .operation-name {
      background: #9012fe;
    }
    .operation-details {
      border-top: 1px solid #9012fe;
    }
    .operation-more-button {
      border-left: 1px solid #9012fe;
      svg { color: #9012fe; }
    }
  }

  &.operation-trace {
    border: 1px solid #000000;
    background: rgba(0,0,0,.1);
    .operation-name {
      background: #000000;
    }
    .operation-details {
      border-top: 1px solid #000000;
    }
    .operation-more-button {
      border-left: 1px solid #000000;
      svg { color: #000000; }
    }
  }
}
</style>