<script lang="ts">
    import {onMount} from "svelte";

    import {useColorChange, useCurrentColor} from "$lib/contexts";
    import {error} from "$lib/util";

    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D;

    let innerWidth: number
    let innerHeight: number

    let wavesArray: Wave[] = [];
    const colorsArray: string[] = [];
    let colorsArrayWorking: string[] = [];

    const lineWidth = 2;

    const waveStartPos = -10;
    const amplitudeMin = 50;
    const amplitudeMax = 80;
    const frequencyMin = 300;
    const frequencyMax = 800;

    const amount = 10; //Nr. of waves

    const currentColor = useCurrentColor()
    let currentColorHSLA : number[];
    const colorChange = useColorChange()
    let mainColor : string;

    onMount(() => {
        ctx = canvas.getContext("2d") ?? error()
        start();
    })

    class Wave {
        public x: number
        public amplitude: number
        public frequency: number
        public step: number

        constructor(
            public y = 0,
            public color: string
        ) {
            this.x = waveStartPos //Always start at the very left of the screen.
            this.y = y;
            this.amplitude = amplitudeMin + Math.random() * amplitudeMax;
            this.frequency = frequencyMin + Math.random() * frequencyMax;
            this.color = color;
            this.step = -4;
        }
    }

    function plotSine(wave: Wave) {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = lineWidth;

        let currX = wave.x;
        let currY;
        while (currX < canvas.width) {
            currY = wave.y + wave.amplitude * Math.sin((currX + wave.step) / wave.frequency);
            ctx.lineTo(currX, currY);
            currX++;
        }
        ctx.stroke();
        ctx.lineTo(currX, canvas.height);
        ctx.lineTo(wave.x, canvas.height);
        ctx.globalCompositeOperation = "destination-over";

        ctx.fillStyle = wave.color;
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";

        wave.step += 4;
    }

    const hexToHSLA = (hex : string) => {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        if(result) {
            let r = parseInt(result[1], 16);
            let g = parseInt(result[2], 16);
            let b = parseInt(result[3], 16);

            r /= 255;
            g /= 255;
            b /= 255;
            let max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h;
            let s;
            let l = (max + min) / 2;

            if(max == min){
                h = s = 0; // achromatic
            } else {
                let d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch(max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }

                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                h! /= 6;
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

    let animateWaves = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if($colorChange) {
            $colorChange = false;
            start();
        }

        wavesArray.forEach((wave) => {
            plotSine(wave);
        });

        requestAnimationFrame(animateWaves);
    };

    function getColors() {
        //Primary Color
        let primary = `hsla(${currentColorHSLA[0]}, ${currentColorHSLA[1]}%, ${currentColorHSLA[2]}%, ${currentColorHSLA[3]})`;

        //Complimentary Color: 180 Degrees Opposite
        let complimentary = `hsla(${currentColorHSLA[0] + 180}, ${currentColorHSLA[1]}%, ${currentColorHSLA[2]}%, ${currentColorHSLA[3]})`;

        //Split Complimentary Colors: 180 Degrees and 210 Degrees opposite
        let splitCom1 = `hsla(${currentColorHSLA[0] + 150}, ${currentColorHSLA[1]}%, ${currentColorHSLA[2]}%, ${currentColorHSLA[3]})`;
        let splitCom2 = `hsla(${currentColorHSLA[0] + 210}, ${currentColorHSLA[1]}%, ${currentColorHSLA[2]}%, ${currentColorHSLA[3]})`;

        //Square Colors: In a "square" around main color, here 90 and 270, 180 is complimentary.
        let square1 = `hsla(${currentColorHSLA[0] + 90}, ${currentColorHSLA[1]}%, ${currentColorHSLA[2]}%, ${currentColorHSLA[3]})`;
        let square2 = `hsla(${currentColorHSLA[0] + 270}, ${currentColorHSLA[1]}%, ${currentColorHSLA[2]}%, ${currentColorHSLA[3]})`;

        //Rectangle Colors: In a rectangle around main. 60 degrees and 240 degrees.
        let rect1 = `hsla(${currentColorHSLA[0] + 60}, ${currentColorHSLA[1]}%, ${currentColorHSLA[2]}%, ${currentColorHSLA[3]})`;
        let rect2 = `hsla(${currentColorHSLA[0] + 240}, ${currentColorHSLA[1]}%, ${currentColorHSLA[2]}%, ${currentColorHSLA[3]})`;

        //Analogous Colors: Next to main color
        let analogous1 = `hsla(${currentColorHSLA[0] + 20}, ${currentColorHSLA[1]}%, ${currentColorHSLA[2]}%, ${currentColorHSLA[3]})`;
        let analogous2 = `hsla(${currentColorHSLA[0] - 20}, ${currentColorHSLA[1]}%, ${currentColorHSLA[2]}%, ${currentColorHSLA[3]})`;

        colorsArray.push(primary, complimentary, splitCom1, splitCom2, square1, square2, rect1, rect2, analogous1, analogous2);
    }

    function selectRandomColor() {
        if (colorsArrayWorking.length === 0) {
            colorsArrayWorking = [...colorsArray];
        }
        let randomColorIndex = Math.floor(Math.random() * colorsArray.length);
        let randomColor = colorsArray[randomColorIndex];
        colorsArrayWorking.splice(randomColorIndex, 1);

        return randomColor;
    }

    const start = () => {
        if(canvas != undefined && canvas != null) {

            wavesArray = [];
            //Get the needed colors
            currentColorHSLA = hexToHSLA($currentColor);
            mainColor = `hsla(${currentColorHSLA[0]}, ${currentColorHSLA[1]}%, ${currentColorHSLA[2]}%, ${currentColorHSLA[3]})`;
            getColors();
            colorsArrayWorking = [...colorsArray];

            for (let i = 0; i < amount; i++) {
                const wave = new Wave(Math.random() * canvas.height, selectRandomColor()); //New wave at random y coordinate.
                wavesArray.push(wave);
            }

            requestAnimationFrame(animateWaves);
        }
    }
</script>

<canvas bind:this={canvas} width={1450} height={1450 * 16/9} style="--mainColor: {mainColor}"/>
<svelte:window bind:innerWidth={innerWidth} bind:innerHeight={innerHeight}/>

<style lang="css">
  canvas {
    width: 100%;
    height: 100%;
    background-color: var(--mainColor);
  }
</style>
