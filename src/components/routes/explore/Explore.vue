<template>
  <div
    style="margin: 1rem;"
  >
    <div class="row">
      <div
        class="col-md-3"
        v-for="(cardItem, index) in cardItems"
        v-bind:key="index"
      >
        <div>
          <!-- {{ this.businessApis[1].openapidocument.info.title }} -->
          <b-card
            :title="cardItem.openapidocument.info.title"
            img-src="https://picsum.photos/600/300/?image=25"
            img-alt="Image"
            img-top
            tag="article"
            class="mb-2 cardItem"
          >
            <b-card-text>
              {{ cardItem.openapidocument.info.description }}
            </b-card-text>

            <b-button href="#" variant="primary">Go somewhere</b-button>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  created() {
    this.$store.commit('currentPage/setRootPath', 'explore');
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      businessApis: state => state.businessApis.items,
    }),
    cardItems() {
      const { businessApis } = this;
      return businessApis
        .map(item => ({
          ...item,
        }));
    },
  },
  mounted() {
    this.$store.dispatch('businessApis/getBusinessApis', { uuid: this.currentUser.uuid });
  },
};
</script>

<style lang="scss" scoped>
.card-text {
  // width: 100%;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
}
</style>
