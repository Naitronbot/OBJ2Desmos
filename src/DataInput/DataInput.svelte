<style src="./DataInput.css"></style>

<script lang='ts'>
    export let content: string = "";
    export let name: string;
</script>

<div class="data-input">
    <div class="title-wrapper">
        <h1>{name} Data</h1>
    </div>
    <textarea>{content}</textarea>
    <button>Upload {name} <img src="/src/assets/upload.svg" alt="Upload"/></button>
</div>