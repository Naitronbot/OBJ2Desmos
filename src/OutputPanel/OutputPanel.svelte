<style src="./OutputPanel.css"></style>

<script lang='ts'>
  import { writable } from "svelte/store";
    import type { MeshData } from "../obj2desmos";

    export let model: MeshData | undefined;
    let value = writable("");
    $: model, value.set(toDesmosExpr(model) ?? "");

    function toDesmosExpr(mesh?: MeshData) {
        if (!mesh) return;

        let output = "";

        output += "v_{1} = \\left[" + mesh.vertices.map(vert => vert.x) + "\\right]\n";
        output += "v_{2} = \\left[" + mesh.vertices.map(vert => vert.y) + "\\right]\n";
        output += "v_{3} = \\left[" + mesh.vertices.map(vert => vert.z) + "\\right]\n";

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