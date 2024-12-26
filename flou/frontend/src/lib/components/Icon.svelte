<script lang="ts">
    export let size = 1
</script>

<div class="icon" style:height="{size}rem">
    <slot/>
</div>

<style lang="scss">
  .icon {
    aspect-ratio: 1 / 1;
  }
</style>
