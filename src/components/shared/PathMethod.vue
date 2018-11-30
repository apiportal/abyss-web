<template>
  <div :class="`path-method-container path-method-${methodType}`">
    <header>
      <strong>{{ methodType }}</strong>
    </header>
    <main>
      <PathMethodMain
        :path="path"
        :method="methodType"
        :description="methodProps.description"
        :summary="methodProps.summary"
        :tags="methodProps.tags"
        :operationId="methodProps.operationId"
        :onMethodChange="onMethodChange"
        :onDescriptionChange="onDescriptionChange"
        :onSummaryChange="onSummaryChange"
      />
      <b-button block>SECURITY</b-button>
      <PathMethodSecurity
        :security="methodProps.security"
      />
      <b-button block>PARAMETERS</b-button>
      <PathMethodParameters
        :security="methodProps.parameters"
      />
      <b-button block>RESPONSES</b-button>
      <PathMethodResponses
        :responses="methodProps.responses"
      />
      <b-button block>REQUESTBODY</b-button>
      <PathMethodRequestBody
        :requestBody="methodProps.requestBody"
      />
      <b-button block>CALLBACKS</b-button>
      <PathMethodCallbacks
        :callbacks="methodProps.callbacks"
      />
      <b-button block>LINKS</b-button>
      <PathMethodLinks
        :links="methodProps.links"
      />
    </main>
  </div>
</template>

<script>
import PathMethodMain from '@/components/shared/PathMethodMain';
import PathMethodSecurity from '@/components/shared/PathMethodSecurity';
import PathMethodParameters from '@/components/shared/PathMethodParameters';
import PathMethodResponses from '@/components/shared/PathMethodResponses';
import PathMethodRequestBody from '@/components/shared/PathMethodRequestBody';
import PathMethodCallbacks from '@/components/shared/PathMethodCallbacks';
import PathMethodLinks from '@/components/shared/PathMethodLinks';

export default {
  components: {
    PathMethodMain,
    PathMethodSecurity,
    PathMethodParameters,
    PathMethodResponses,
    PathMethodRequestBody,
    PathMethodCallbacks,
    PathMethodLinks,
  },
  props: {
    methodType: {
      type: String,
      required: true,
      default() { return ''; },
    },
    methodProps: {
      type: Object,
      required: true,
      default() { return {}; },
    },
    path: {
      type: String,
      required: true,
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
};
</script>

<style lang="scss">
.path-method-container {
  &.path-method-get {
    background-color: rgba(97, 175, 254, 0.1);
  }
  &.path-method-post {
    background-color: rgba(73, 204, 144, 0.1)
  }
  &.path-method-put {
    background-color: rgba(252, 161, 48, 0.1);
  }
  &.path-method-delete {
    background-color: rgba(249, 62, 62, 0.1);
  }
}
</style>
