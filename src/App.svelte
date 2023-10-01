<style src="./App.css"></style>

<script lang="ts">
    import InputPanel from "./InputPanel/InputPanel.svelte";
    import ProcessPanel from "./ProcessPanel/ProcessPanel.svelte";
    import OutputPanel from "./OutputPanel/OutputPanel.svelte";
    import { ObjProcessor } from "./obj2desmos";
    import type { MeshData } from "./obj2desmos";

    const objProcess = new ObjProcessor('');

    let modelFile = {type: "OBJ", obj: "", mtl: "", stl: ""};

    let model: MeshData;

    function convert() {
        objProcess.process(modelFile.obj);
        model = objProcess.meshData;        
    }
</script>

<main>
    <div>
        <InputPanel bind:modelFile />
    </div>
    <div>
        <ProcessPanel bind:model on:convert={convert} />
    </div>
    <div>
        <OutputPanel bind:model/>
    </div>
</main>