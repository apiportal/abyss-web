<template>
  <div>
    <b-row>
      <b-col>
        <b-form-group>
          <label>
            Visibility
          </label>
          <b-form-select
            v-model="api.apivisibilityid"
            :options="[
              ...apiVisibilityTypes.map(item => ({
                value: item.uuid,
                text: item.name,
              }))
            ]"
            @change="onChange()"
          />
        </b-form-group>
        <b-form-group>
          <label>Environment</label>
          <div class="row m-0">
            <b-form-radio
              @change="onChange()"
              v-model="environment"
              value="live"
              class="col-auto"
            >
              Live
            </b-form-radio>
            <b-form-radio
              @change="onChange()"
              v-model="environment"
              value="sandbox"
              class="col-auto"
            >
              Sandbox
            </b-form-radio>
          </div>
        </b-form-group>
        <b-form-group>
          <label>Version</label>
          <div class="row m-0">
            <b-form-checkbox
              v-model="api.isdefaultversion"
              :value="true"
              :unchecked-value="false"
              @change="onChange()"
              class="col-auto"
            >
              Default Version
            </b-form-checkbox>
            <b-form-checkbox
              v-model="api.islatestversion"
              :value="true"
              :unchecked-value="false"
              @change="onChange()"
              class="col-auto"
            >
              Latest Version
            </b-form-checkbox>
          </div>
        </b-form-group>
      </b-col>
      <b-col cols="auto">
        <div style="width: 260px;" class="position-relative mb-3 mt-2">
          <span class="remove-image" @click="handleDeleteImage" ><Icon icon="times"/></span>
          <div class="thumb-image rectangle shape"
            :style="`background-color: ${api.color};`"
            v-b-tooltip.hover
            title="Click to change image"
            @click="$refs.fileInput.click()"
          >
            <div class="thumb-txt">{{api.openapidocument.info.title.substring(0, 1)}}</div>
            <div class="thumb-img" :style="`background-image:url('${api.image}');`">
            </div>
          </div>
          <input type="file" class="image-upload" ref="fileInput" @change="onFileSelected" accept="image/*"/>
        </div>
        <b-form-group>
          <label>
            Color:
          </label>
          <b-form-input
            type="color"
            v-model="api.color"
            :value="api.color"
            @change="onChange()"
          >
          </b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Icon from '@/components/shared/Icon';

export default {
  props: {
    api: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    onChange: {
      type: Function,
      required: true,
    },
  },
  components: {
    Icon,
  },
  data() {
    return {
      isLoaded: false,
      apivisibilityid: this.api.apivisibilityid,
      isdefaultversion: this.api.isdefaultversion,
      islatestversion: this.api.islatestversion,
      color: this.api.color,
      image: this.api.image,
    };
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      apiVisibilityTypes: state => state.apiVisibilityTypes.items,
    }),
    environment: {
      get() {
        return this.api.issandbox ? 'sandbox' : 'live';
      },
      set(newVal) {
        if (newVal === 'sandbox') {
          this.api.islive = false;
          this.api.issandbox = true;
        }
        if (newVal === 'live') {
          this.api.islive = true;
          this.api.issandbox = false;
        }
        return newVal;
      },
    },
  },
  methods: {
    onFileSelected(event) {
      event.preventDefault();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        this.api.image = reader.result;
      };
      reader.readAsDataURL(file);
      this.onChange();
    },
    handleDeleteImage() {
      this.api.image = '';
      this.$refs.fileInput.value = null;
      this.onChange();
    },
  },
};
</script>

<style lang="scss" scoped>
.remove-image {
    position: absolute;
    right: -10px;
    top: -10px;
    background: black;
    text-align: center;
    border-radius: 50%;
    color: white;
    font-size: 16px;
    padding: 0 2px;
    line-height: 20px;
    width: 20px;
    z-index: 1;
    cursor: pointer;
}
</style>