<style src="./OutputPanel.css"></style>

<script lang='ts'>
  import { writable } from "svelte/store";
  import type Model from "../OBJ2Desmos/Model";

    export let model: Model | undefined;
    let value = writable("");
    $: model, value.set(toDesmosExpr(model) ?? "");

    function toDesmosExpr(model?: Model) {
        if (!model) return;

        let output = "";

        output += "v_{1} = \\left[" + model.vertices.map(vert => vert.x) + "\\right]\n";
        output += "v_{2} = \\left[" + model.vertices.map(vert => vert.y) + "\\right]\n";
        output += "v_{3} = \\left[" + model.vertices.map(vert => vert.z) + "\\right]\n";

        return output;
    }
</script>

<div class="outputPanel">
    <div class="title-wrapper">
        <h1>Desmos Expressions</h1>
    </div>
    <textarea bind:value={$value}></textarea>
    <button on:click={() => navigator.clipboard.writeText($value)}>Copy <img src="/src/assets/copy.svg" alt="Copy"/></button>
</div>