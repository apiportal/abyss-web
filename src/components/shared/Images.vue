<template>
  <div class="thumb-image" :class="shape" :style="`background-color: ${color};`">
    <div v-if="altText" class="thumb-txt">{{altText.substring(0, 1)}}</div>
    <div class="thumb-img" :style="`background-image:url('${imageSrc}');`">
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    options: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    color: {
      type: String,
      required: false,
      default() { return ''; },
    },
    altText: {
      type: String,
      required: false,
      default() { return ''; },
    },
    uuid: {
      type: String,
      required: false,
      default() { return ''; },
    },
    type: {
      type: String,
      required: false,
      default() { return ''; },
    },
    shape: {
      type: String,
      required: false,
      default() { return ''; },
    },
    lastUpdatedAt: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      image: null,
    };
  },
  computed: {
    ...mapState({
      pictureUrl: state => state.traffic.pictureUrl,
    }),
    imageSrc() {
      return `${this.pictureUrl}/${this.type}/image/${this.uuid}?bust=${this.lastUpdatedAt}`;
    },
  },
  created() {
  },
};
</script>
<style lang="scss">
.thumb-image {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 4rem;
  background-color: #999;
  position: relative;
  width: 100%;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  &::before {
    display: block;
    content: "";
    padding-top: 56.25%;
  }
  &.rectangle::before {
    padding-top: 56.25%;
  }
  &.square::before {
    padding-top: 100%;
  }
  &.circle {
    border-radius: 100%;
    &::before {
      padding-top: 100%;
    }
  }
}
td.picture .thumb-image {
  font-size: 1.25rem;
}
.thumb-txt {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-weight: 400;
}
.thumb-img {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>