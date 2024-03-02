<style src="./ProcessPanel.css"></style>

<script lang='ts'>
    import { createEventDispatcher } from "svelte";
    import Model from "../OBJ2Desmos/Model";
    import PreviewWindow from "../PreviewWindow/PreviewWindow.svelte";

    export let model: Model | undefined;

    const dispatch = createEventDispatcher();
</script>

<div class="process-panel">
    <PreviewWindow bind:model />
    <div class="button-wrapper">
        <button on:click={() => dispatch("convert")}>Convert <img src="/src/assets/arrow.svg" alt="Arrow pointing right"></button>
    </div>
</div>