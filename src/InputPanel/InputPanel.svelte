<style src="./InputPanel.css"></style>

<script lang='ts'>
  import DataInput from "../DataInput/DataInput.svelte";

    let selectedMode: typeof modes[number]['name'] = "OBJ";
    const modes = [
        {
            id: 1,
            name: "OBJ"
        },
        {
            id: 2,
            name: "OBJ+MTL"
        },
        {
            id: 3,
            name: "STL"
        }
    ] as const;

</script>

<div class="inputPanel" style={`grid-template-rows: 50px repeat(${selectedMode === "OBJ+MTL" ? "2" : "1"}, 1fr)`}>
    <select bind:value={selectedMode}>
        {#each modes as mode}
            <option value={mode.name}>{mode.name}</option>
        {/each}
    </select>
    {#if selectedMode === "OBJ+MTL" || selectedMode === "OBJ"}
        <DataInput name="OBJ" filetype="OBJ"/>
    {/if}
    {#if selectedMode === "STL"}
        <DataInput name="STL" filetype="STL"/>
    {/if}
    {#if selectedMode === "OBJ+MTL"}
        <DataInput name="MTL" filetype="MTL"/>
    {/if}
</div>