<script lang="ts">
    import Icon from "$lib/components/Icon.svelte";

    export let button: HTMLButtonElement | undefined = undefined
    export let size = 1.75
    export let disabled = false
</script>

<button bind:this={button} on:click {disabled}>
    <Icon {size}>
        <slot {button}/>
    </Icon>
</button>

<style lang="scss">
  button {
    aspect-ratio: 1;
    padding: 4px;

    display: flex;
    justify-content: center;
    align-items: center;

    border: none;
    border-radius: 50%;

    color: inherit;
    background-color: transparent;

    &:disabled {
      opacity: 75%;
    }

    &:not(:disabled) {
      &:hover {
        background-color: rgba(0, 0, 0, .1);
      }

      &:active {
        background-color: rgba(0, 0, 0, .2);
      }
    }
  }
</style>
