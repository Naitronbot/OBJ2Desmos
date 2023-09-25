<style src="./ProcessPanel.css"></style>

<script lang='ts'>
    import ThreeCanvas from "../ThreeCanvas/ThreeCanvas.svelte";
    import { createEventDispatcher } from "svelte";
    import type { MeshData } from "../obj2desmos";

    export let model: MeshData | undefined;

    const dispatch = createEventDispatcher();
</script>

<div class="process-panel">
    <ThreeCanvas bind:model />
    <div class="button-wrapper">
        <button on:click={() => dispatch("convert")}>Convert <img src="/src/assets/arrow.svg" alt="Arrow pointing right"></button>
    </div>
</div>