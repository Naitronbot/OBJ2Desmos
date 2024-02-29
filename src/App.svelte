<style src="./App.css"></style>

<script lang="ts">
    import InputPanel from "./InputPanel/InputPanel.svelte";
    import ProcessPanel from "./ProcessPanel/ProcessPanel.svelte";
    import OutputPanel from "./OutputPanel/OutputPanel.svelte";
    import Model from "./OBJ2Desmos/Model";

    let modelFile = {type: "OBJ", obj: "", mtl: "", stl: ""};

    let model: Model;

    function convert() {
        model = Model.fromObj(modelFile.obj);        
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