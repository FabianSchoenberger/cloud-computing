<script lang="ts">
    import {onMount} from "svelte";

    import {error} from "$lib/util";

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D

    let innerHeight: number
    let innerWidth: number

    onMount(() => {
        ctx = canvas.getContext("2d") ?? error()

        animateBubbles()
        execute()
    })

    const bubbleArray: Bubble[] = [];

    class Bubble {
        private readonly radius: number
        private readonly dx: number
        private readonly dy: number
        private readonly color: string

        constructor(
            private x = 0,
            private y = 0
        ) {
            this.radius = Math.random() * 50;
            this.dx = Math.random() * 3;
            this.dy = Math.random() * 7;
            this.color = "rgba(224, 230, 254, 1)";
        }

        draw() {
            ctx.globalCompositeOperation = 'lighter';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.strokeStyle = this.color;
            ctx.stroke();

            ctx.fillStyle = this.color;
            ctx.fill();
        }

        move() {
            this.x = this.x + this.dx;
            this.y = this.y - this.dy;
        }

        isOutOfBounds() {
            const leftOfBubble = this.x - this.radius;
            const rightOfBubble = this.x + this.radius;
            const topOfBubble = this.y - this.radius;
            const bottomOfBubble = this.y + this.radius;

            return rightOfBubble < 0 ||
                leftOfBubble > canvas.width ||
                topOfBubble > canvas.height ||
                bottomOfBubble < 0;


        }
    }

    const handleDrawCircle = () => {
        let x = Math.random() * canvas.width;
        let y = canvas.height;

        const bubble = new Bubble(x, y);
        bubbleArray.push(bubble);
    };

    let animateBubbles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        bubbleArray.forEach((bubble) => {
            bubble?.move();
            if(bubble?.isOutOfBounds())
            {
                let index = bubbleArray.indexOf(bubble);
                bubbleArray.splice(index, 1);
            }
            else {
                bubble?.draw();
            }
        });

        requestAnimationFrame(animateBubbles);
    };

    function execute() {
        handleDrawCircle();
        
        const min = 0.05;
        const max = 0.08;
        const rand = Math.floor(Math.random() * (max - min + 1) + min);
        setTimeout(execute, rand * 1000);
    }
</script>

<div class="container">
    <canvas bind:this={canvas} width={innerWidth} height={innerHeight}/>
</div>
<svelte:window bind:innerWidth={innerWidth} bind:innerHeight={innerHeight}/>

<style lang="scss">
  .container {
    width: 100%;
    height: 100%;

    background: linear-gradient(231deg, #ddfff7, #93e1d8, #ffa69e, #aa4465, #462255);
    background-size: 1000% 1000%;

    animation: GradAnim 17s ease infinite;

    canvas {
      width: 100%;
      height: 100%;
    }
  }

  @keyframes GradAnim {
    0%, 100% {
      background-position: 0 94%
    }
    50% {
      background-position: 100% 7%
    }
  }
</style>
