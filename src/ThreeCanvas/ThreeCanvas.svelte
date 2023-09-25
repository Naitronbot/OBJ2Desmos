<style src="./ThreeCanvas.css"></style>

<script lang='ts'>
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import type { MeshData } from '../obj2desmos';

    export let model: MeshData | undefined;
    
    let rootElem: HTMLElement;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let ambient: THREE.AmbientLight;
    let directional: THREE.DirectionalLight;
    let controls: OrbitControls;
    let geometry: THREE.BufferGeometry;
    let material: THREE.MeshPhongMaterial;

    function anim() {
        controls.update();
        directional.position.set(camera.position.x + 1, camera.position.y + 1, camera.position.z);
        renderer.render(scene, camera);
    }

    function resize() {
        camera.aspect = rootElem.clientWidth/rootElem.clientHeight;
        renderer.setSize(rootElem.clientWidth, rootElem.clientHeight, false);
        camera.updateProjectionMatrix();
        requestAnimationFrame(anim);
    }

    $: model, updateModel();
    let mesh: THREE.Mesh;
    function updateModel() {
        scene?.remove(mesh);
        geometry?.dispose();
        material?.dispose();

        if (!model) return;

        geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(model.vertices.flatMap(a => Object.values(a)) as []);
        const indices = model.faces.flat();
        
        geometry.setIndex(indices);
        geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
        geometry.computeVertexNormals();

        material = new THREE.MeshPhongMaterial({"color": 0x00ff00, "specular": 0x444444, "flatShading": true});

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        requestAnimationFrame(anim);
    }

    onMount(() => {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111111);

        updateModel();

        camera = new THREE.PerspectiveCamera(75, rootElem.clientWidth/rootElem.clientHeight, 0.1, 1000);
        camera.position.x = 1;
        camera.position.y = 1;
        camera.position.z = 2;

        renderer = new THREE.WebGLRenderer({"antialias": true});
        renderer.setSize(rootElem.clientWidth, rootElem.clientHeight, false);

        ambient = new THREE.AmbientLight(0xffffff, 0.5);
        directional = new THREE.DirectionalLight();
        directional.position.set(1,1,2);
        scene.add(ambient);
        scene.add(directional);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.update();

        rootElem.appendChild(renderer.domElement);
        renderer.domElement.addEventListener("mousemove", () => requestAnimationFrame(anim));
        renderer.domElement.addEventListener("touchmove", e => {e.preventDefault(); requestAnimationFrame(anim)}, {passive: false});
        renderer.domElement.addEventListener("wheel", e => {e.preventDefault(); requestAnimationFrame(anim)}, {passive: false});

        requestAnimationFrame(anim);

        return () => {
            ambient?.dispose();
            directional?.dispose();
            controls?.dispose();
            geometry?.dispose();
            material?.dispose();
            renderer?.dispose();
        }
    });
</script>

<svelte:window on:resize={resize}/>

<div class="three-wrapper" bind:this={rootElem}>

</div>