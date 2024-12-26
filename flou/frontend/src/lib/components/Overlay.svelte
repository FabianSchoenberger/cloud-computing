<script lang="ts">
    export let visible: boolean
    export let x: number
    export let y: number
    export let horizontalAlignment: "left" | "center" | "right"
    export let verticalAlignment: "top" | "center" | "bottom"

    let overlay: HTMLDivElement

    let _x = 0
    let _y = 0

    $: {
        if(overlay) {
            const rect = overlay.getBoundingClientRect()
            const width = rect.width
            const height = rect.height

            switch(horizontalAlignment) {
                case "left":
                    _x = x - width
                    break;
                case "center":
                    _x = x - (width / 2)
                    break;
                case "right":
                    _x = x
                    break;
            }

            switch(verticalAlignment) {
                case "top":
                    _y = y - height
                    break;
                case "center":
                    _y = y - (height / 2)
                    break;
                case "bottom":
                    _y = y
                    break;
            }
        }
    }
</script>

<!--svelte-ignore a11y-no-static-element-interactions-->
<!--svelte-ignore a11y-click-events-have-key-events-->
<div bind:this={overlay} on:click|stopPropagation
     class="overlay" style="visibility: {visible ? 'visible' : 'hidden'}; left: {_x}px; top: {_y}px">
    <slot/>
</div>

<style lang="scss">
  .overlay {
    position: absolute;

    overflow: hidden;

    color: var(--overlay_color);
    background-color: var(--overlay_background);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
    border-radius: 10px;
  }
</style>
