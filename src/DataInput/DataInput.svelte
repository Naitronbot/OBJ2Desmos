<style src="./DataInput.css"></style>

<script lang='ts'>
    export let content: string = "";
    export let name: string;
    export let filetype: string;
    let fileInput: HTMLInputElement;

    async function handleUpload() {
        const file = fileInput.files?.item(0);
        const fileText = await file?.text();
        content = fileText ?? "";
        fileInput.value = "";
    }
</script>

<div class="data-input">
    <div class="title-wrapper">
        <h1>{name} Data</h1>
    </div>
    <textarea bind:value={content}></textarea>
    <button on:click={() => fileInput.click()}>Upload {name} <img src="/src/assets/upload.svg" alt="Upload"/></button>
    <input on:change={handleUpload} accept={"."+filetype} type="file" bind:this={fileInput} hidden>
</div>