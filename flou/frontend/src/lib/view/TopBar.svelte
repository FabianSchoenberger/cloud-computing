<script lang="ts">
    import {createEventDispatcher, onDestroy} from "svelte";

    import ChangeBG from "$lib/assets/icon/background.svg?raw";
    import Kebab from "$lib/assets/icon/kebab.svg?raw";
    import IconButton from "$lib/components/IconButton.svelte";
    import Overlay from "$lib/components/Overlay.svelte";
    import {
        USER_OVERLAY,
        useAccount,
        useColorChange,
        useCurrentBG,
        useCurrentColor,
        useDarkMode, useOverlayOptions
    } from "$lib/contexts";

    const dispatch = createEventDispatcher()

    const account = useAccount()
    const userOverlayOptions = useOverlayOptions(USER_OVERLAY)

    //Maximum amount of backgrounds to toggle through
    const maxBGNumber = 2;
    //Current Background
    const currBG = useCurrentBG()

    const darkMode = useDarkMode()

    const currentColor = useCurrentColor()
    const colorChange = useColorChange()
    let currentColorTemp : string = $currentColor;

    let button: HTMLButtonElement
    let buttonBG: HTMLButtonElement


    const setTheme = (dark : boolean) => {
        $darkMode = dark;
    }

    const openOverlay = () => {
        setTheme(false);
        const rect = button.getBoundingClientRect()
        userOverlayOptions.update(it => Object.assign(it, {
            visible: true,
            x: rect.x,
            y: rect.y + rect.height,
            horizontalAlignment: "right",
            verticalAlignment: "bottom"
        }))
    }
    const closeOverlay = (event?: MouseEvent) => {
        if (event && button.contains(event.target as Element))
            return

        userOverlayOptions.update(it => Object.assign(it, {
            visible: false
        }))
    }

    const changeBackground = () => {
        if($currBG == maxBGNumber) {
            $currBG = 1;
            //On bubbles background, always use light mode
            setTheme(false);
        } else {
            $currBG++;
        }
    }

    const onColorChange = () => {
        if(currentColorTemp == undefined)
        {
            currentColor.set('#00a7d1');
        } else {
            currentColor.set(currentColorTemp);
        }
        colorChange.set(true);


        let tmpHSLA = hexToHSLA($currentColor);
        if(tmpHSLA[2] < 0.5) {
            setTheme(true);
        } else {
            setTheme(false);
        }
    }

    const hexToHSLA = (hex : string) => {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        if(result) {
            var r = parseInt(result[1], 16);
            var g = parseInt(result[2], 16);
            var b = parseInt(result[3], 16);

            r /= 255;
            g /= 255;
            b /= 255;

            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h = -1;
            var s;
            var l = (max + min) / 2;

            if(max == min){
                h = s = 0; // achromatic
            } else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch(max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }

                h /= 6;
            }

            s = s*100;
            s = Math.round(s);
            l = l*100;
            l = Math.round(l);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            h = Math.round(360*h!);

            return [h, s, l, 0.6];
        }
        return [0, 0, 0, 0];


    }


    const logout = () => {
        dispatch("logout")
    }

    onDestroy(() => {
        closeOverlay()
    })
</script>

<div class="top-bar">
    <span class="user">
        <span>{$account?.username}</span>
        <IconButton bind:button={button} on:click={openOverlay}>{@html Kebab}</IconButton>
        <IconButton bind:button={buttonBG} on:click={changeBackground}>{@html ChangeBG}</IconButton>
        {#if $currBG === 2}
        <input id="color-picker" type="color" bind:value={currentColorTemp} on:change={onColorChange}>
    {/if}

    </span>
</div>

<Overlay {...$userOverlayOptions}>
    <button on:click={logout} class="menu-button">Log Out</button>
</Overlay>



<svelte:window on:click={closeOverlay}/>

<style lang="scss">
  .top-bar {
    width: 100%;
    height: 5rem;
    padding: 0 1.5rem;

    display: flex;
    align-items: center;
    justify-content: space-between;

    font-weight: bold;
    color: var(--top-bar_color);
    background-color: var(--top-bar_background);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);

    .user {
      display: flex;
      align-items: center;
      gap: 1em;

      font-size: 1.4rem;
    }
  }

  .menu-button {
    width: 100%;
    min-width: 120px;
    height: 40px;

    color: var(--surface_color); //TODO
    background-color: transparent;
    border: none;

    font-size: 1.2rem;

    &:hover {
      background-color: #00000020;
    }
  }

</style>
