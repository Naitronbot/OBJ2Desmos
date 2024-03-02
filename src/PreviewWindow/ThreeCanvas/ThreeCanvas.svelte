<style src="./ThreeCanvas.css"></style>

<script lang='ts'>
    /* 
     * SETTINGS TO ADD
     * Toggle Smooth Shading
     * Toggle Backface Culling
     */

    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import type Model from '../../OBJ2Desmos/Model';

    export let model: Model | undefined;
    export let gridLines: boolean;
    
    let rootElem: HTMLElement;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let ambient: THREE.AmbientLight;
    let directional: THREE.DirectionalLight;
    let controls: OrbitControls;
    let geometry: THREE.BufferGeometry;
    let material: THREE.MeshPhongMaterial;
    let gridHelper: THREE.GridHelper;

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

    function createCamera() {
        camera = new THREE.PerspectiveCamera(75, rootElem.clientWidth/rootElem.clientHeight, 0.1, 1000);
        camera.position.x = 1;
        camera.position.y = 1;
        camera.position.z = 2;

        controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.update();
    }

    export function resetCamera() {
        createCamera();
        requestAnimationFrame(anim);
    }

    $: model, updateModel();
    $: gridLines, updateModel();
    let mesh: THREE.Mesh;
    function updateModel() {
        if (!scene) return;

        scene.remove(mesh);
        scene.remove(gridHelper);
        geometry?.dispose();
        material?.dispose();
        
        if (gridLines) {
            gridHelper = new THREE.GridHelper(10, 10, new THREE.Color(0x888888), new THREE.Color(0x444444));
            scene.add(gridHelper);
        }

        if (model) {
            model.triangulate();

            geometry = new THREE.BufferGeometry();
            const vertices = new Float32Array(model.vertices.flatMap(a => Object.values(a)) as []);
            const indices = model.faces.flat();
            
            geometry.setIndex(indices);
            geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
            geometry.computeVertexNormals();

            material = new THREE.MeshPhongMaterial({"color": 0x00ff00, "specular": 0x444444, "flatShading": true});

            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
        }

        requestAnimationFrame(anim);
    }

    onMount(() => {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111111);

        updateModel();

        renderer = new THREE.WebGLRenderer({"antialias": true});
        renderer.setSize(rootElem.clientWidth, rootElem.clientHeight, false);

        createCamera();

        ambient = new THREE.AmbientLight(0xffffff, 0.5);
        directional = new THREE.DirectionalLight();
        directional.position.set(1,1,2);
        scene.add(ambient);
        scene.add(directional);

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