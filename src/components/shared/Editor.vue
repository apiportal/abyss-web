<template>
  <div class="editor"></div>
</template>

<script>
import ace from 'brace';
import json from 'brace/mode/json'; // eslint-disable-line no-unused-vars
import eclipse from 'brace/theme/eclipse'; // eslint-disable-line no-unused-vars

export default {
  props: {
    value: {
      type: Object,
      required: true,
    },
    lang: {
      type: String,
      required: false,
      default() { return 'json'; },
    },
    theme: {
      type: String,
      required: false,
      default() { return 'eclipse'; },
    },
    onChange: {
      type: Function,
      required: true,
    },
    updated: {
      type: Number,
      required: false,
      default() { return 0; },
    },
  },
  watch: {
    updated() {
      this.updatedByProp = true;
      this.editor.setValue(JSON.stringify(this.value, null, '\t'));
    },
  },
  data() {
    return {
      isMounted: false,
      editor: null,
      updatedByProp: false,
    };
  },
  mounted() {
    const { $el, lang, value, theme } = this;
    this.editor = ace.edit($el);
    this.editor.$blockScrolling = Infinity;
    // this.editor.setOption('enableEmmet', true);
    this.editor.getSession().setMode(`ace/mode/${lang}`);
    this.editor.setTheme(`ace/theme/${theme}`);
    this.editor.getSession().setTabSize(2);
    this.editor.setValue(JSON.stringify(value, null, '\t'));
    // editor is ready
    this.isMounted = true;

    this.editor.on('change', () => {
      if (this.updatedByProp) {
        this.updatedByProp = false;
        return false;
      }
      this.onChange(this.editor.getValue());
      return false;
    });
  },
  beforeDestroy() {
    this.editor.destroy();
    this.editor.container.remove();
  },
};
</script>

<style lang="scss">
.editor {
  flex: 1 0 0;
  word-spacing: 0 !important;
}
</style>