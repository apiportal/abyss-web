<template>
  <div class="thumb-image" :class="shape" :style="`background-color: ${color};`">
    <div v-if="itext" class="thumb-txt">{{itext.substring(0, 1)}}</div>
    <div class="thumb-img" :style="`background-image:url('https://dev2.apiportal.com/abyss/oapi/${type}/image/${uuid}');`">
    </div>
  </div>
</template>

<script>
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
    itext: {
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
  },
  data() {
    return {
      image: null,
    };
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
  background-color: #177ec1;
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