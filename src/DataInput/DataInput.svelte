<style src="./DataInput.css"></style>

<script lang='ts'>
    export let value: string = "";
    export let name: string;
    export let filetype: string;
    let fileInput: HTMLInputElement;

    async function handleUpload() {
        const file = fileInput.files?.item(0);
        const fileText = await file?.text();
        value = fileText ?? "";
        fileInput.value = "";
    }
</script>

<div class="data-input">
    <div class="title-wrapper">
        <h1>{name} Data</h1>
    </div>
    <textarea bind:value></textarea>
    <button on:click={() => fileInput.click()}>Upload {name} <img src="/src/assets/upload.svg" alt="Upload"/></button>
    <input on:change={handleUpload} accept={"."+filetype} type="file" bind:this={fileInput} hidden>
</div>