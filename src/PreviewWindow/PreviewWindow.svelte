<style src="./PreviewWindow.css"></style>

<script lang='ts'>
    import type Model from "../OBJ2Desmos/Model";
    import ThreeCanvas from "./ThreeCanvas/ThreeCanvas.svelte";

    export let model: Model | undefined;

    let canvas;
    let gridLines = true;
</script>

<div class="preview-wrapper">
    <ThreeCanvas {model} {gridLines} bind:this={canvas}/>
    <div class="preview-controls">
        <button on:click={canvas.resetCamera} title="Reset Camera"><img src="/src/assets/refresh.svg" alt="Reset Camera"/></button>
        <button on:click={() => gridLines = !gridLines} title="Toggle Grid"><img src="/src/assets/grid.svg" alt="Toggle Grid"/></button>
    </div>
</div>