<script lang="ts">
    export let disabled: boolean
</script>

<button on:click {disabled}>
    <slot/>
</button>

<style>
    button {
        margin-top: 20px;
        padding: 10px;

        font-size: 2rem;
        color: var(--button_primary_color);

        background-color: var(--button_primary_background);
        border: none;
        border-radius: 8px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);

        &:disabled {
            opacity: .6;
        }

        &:not(:disabled) {
            &:hover {
                filter: brightness(110%);
            }

            &:active {
                filter: brightness(90%);
            }
        }
    }
</style>
