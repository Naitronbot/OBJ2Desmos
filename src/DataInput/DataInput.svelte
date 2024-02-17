<style src="./DataInput.css"></style>

<script lang='ts'>
    export let value: string = "";
    export let name: string;
    export let filetype: string;
    let fileInput: HTMLInputElement;
    let dragging: "dragging" | "" = "";

    async function droppedImage(e: DragEvent) {
        e.preventDefault();
        
        const files = e.dataTransfer?.items;
        if (files) {
            const fileText = await [...files]
                .find(file => file.kind === "file")
                ?.getAsFile()
                ?.text();

            if (fileText) {
                value = fileText;
            }
        }

        dragging = "";
    }

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
    <textarea
        class={dragging}
        on:drop={droppedImage}
        on:dragover={(e) => e.preventDefault()}
        on:dragenter={() => dragging = "dragging"}
        on:dragleave={() => dragging = ""}
        bind:value
    ></textarea>
    <button
        on:click={() => fileInput.click()}
        on:drop={droppedImage}
        on:dragover={(e) => e.preventDefault()}
        >Upload {name} <img src="/src/assets/upload.svg" alt="Upload"
    /></button>
    <input on:change={handleUpload} accept={"."+filetype} type="file" bind:this={fileInput} hidden>
</div>