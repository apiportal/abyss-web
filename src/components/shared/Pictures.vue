<template>
  <div class="thumb-picture" :class="shape" :style="`width: ${width}; height: ${height}`">
    <img v-if="isLoaded" :src="imageSrc" :alt="altText">
    <img v-else src="/static/avatar.png" :alt="altText">
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
    width: {
      type: String,
      required: false,
      default() { return 'auto'; },
    },
    height: {
      type: String,
      required: false,
      default() { return 'auto'; },
    },
    lastUpdatedAt: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      isLoaded: false,
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
    const img = new Image();
    img.src = this.imageSrc;
    img.onload = () => {
      if (img) {
        this.isLoaded = true;
      }
    };
  },
};
</script>
<style lang="scss">
.thumb-picture {
  display: flex;
  align-items: center;
  justify-content: center;
  // color: #fff;
  // background-color: #177ec1;
  // background-color: #999;
  position: relative;
  padding: 0;
  overflow: hidden;
  // border: 1px solid Gainsboro;
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
  img {
    max-width: 100%;
    max-height: 100%;
  }
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
.thumb-pic {
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