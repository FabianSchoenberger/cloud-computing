<div class="container">
    <slot/>
</div>

<style lang="scss">
  $border-radius: var(--border-radius);
  $box-shadow: var(--box-shadow);

  $surface_color: var(--surface_color);
  $surface_background: var(--surface_background);

  .container {
    width: 30vw;
    padding: 2rem;

    display: flex;
    flex-direction: column;
    gap: 16px;

    color: $surface_color;
    background-color: $surface_background;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
  }
</style>
