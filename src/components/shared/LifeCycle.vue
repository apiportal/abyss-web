<template>
  <div class="life-cycle">
    <b-button class="btn-life-cycle" disabled>Draft</b-button>
    <b-button class="btn-life-cycle" variant="outline-success">Staged</b-button>
    <b-button class="btn-life-cycle" variant="primary">Published</b-button>
    <b-button class="btn-life-cycle" variant="outline-success">Promoted</b-button>
    <b-button class="btn-life-cycle" disabled>Demoted</b-button>  
    <b-button class="btn-life-cycle" variant="outline-success">Deprecated</b-button>
    <b-button class="btn-life-cycle" variant="outline-success">Retired</b-button>
    <b-button class="btn-life-cycle" disabled>Archived</b-button>

    <!-- <ul>
      <li>Draft</li>
      <li>Staged</li>
      <li>Published</li>
      <li>Promoted</li>
      <li>Demoted</li>
      <li>Deprecated</li>
      <li>Retired</li>
      <li>Archived</li>
    </ul> -->
  </div>
</template>

<script>

</script>

<style lang="scss" scoped>
.life-cycle {
  text-align: center;
}
.btn {
  margin: 10px 10px;
}
ul {
  list-style: none;
}

</style>