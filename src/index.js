import * as THREE from 'three';

import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

let camera, controls, scene, renderer, effect;

let polyhedrons, currentPolyhedron;

init();
animate();

// get the value of the slider when it is changed
document.getElementById("faceSlider").addEventListener("input", function () {
    // get the value of the slider
    let sliderValue = document.getElementById("faceSlider").value;
    // remove the current shape from the scene
    scene.remove(currentPolyhedron);
    // set the current shape to the shape that corresponds to the slider value
    currentPolyhedron = polyhedrons[sliderValue];
    // add the new shape to the scene
    scene.add(currentPolyhedron);

    // update the text to show the current shape
    switch (sliderValue) {
        case "0":
            document.getElementById("label").innerHTML = "Tetrahedron";
            break;
        case "1":
            document.getElementById("label").innerHTML = "Cube";
            break;
        case "2":
            document.getElementById("label").innerHTML = "Octahedron";
            break;
        case "3":
            document.getElementById("label").innerHTML = "Dodecahedron";
            break;
        case "4":
            document.getElementById("label").innerHTML = "Icosahedron";
            break;
    };

});

function init() {

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 150;
    camera.position.z = 500;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0, 0, 0);

    const pointLight1 = new THREE.PointLight(0xffffff);
    pointLight1.position.set(500, 500, 500);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.25);
    pointLight2.position.set(- 500, - 500, - 500);
    scene.add(pointLight2);



    // add a tetrahedron to the scene
    const tetrahedron = new THREE.Mesh(new THREE.TetrahedronGeometry(200, 0), new THREE.MeshPhongMaterial({ flatShading: true }));

    // add a cube to the scene
    const cube = new THREE.Mesh(new THREE.BoxGeometry(200, 200, 200), new THREE.MeshPhongMaterial({ flatShading: true }));

    // add a octahedron to the scene
    const octahedron = new THREE.Mesh(new THREE.OctahedronGeometry(200, 0), new THREE.MeshPhongMaterial({ flatShading: true }));

    // add a dodecahedron to the scene
    const dodecahedron = new THREE.Mesh(new THREE.DodecahedronGeometry(200, 0), new THREE.MeshPhongMaterial({ flatShading: true }));

    // add a icosahedron to the scene
    const icosahedron = new THREE.Mesh(new THREE.IcosahedronGeometry(200, 0), new THREE.MeshPhongMaterial({ flatShading: true }));

    // add all the shapes to an array
    polyhedrons = [tetrahedron, cube, octahedron, dodecahedron, icosahedron];

    currentPolyhedron = polyhedrons[2];

    scene.add(currentPolyhedron);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true });
    effect.setSize(window.innerWidth, window.innerHeight);
    effect.domElement.style.color = 'white';
    effect.domElement.style.backgroundColor = 'black';

    // Special case: append effect.domElement, instead of renderer.domElement.
    // AsciiEffect creates a custom domElement (a div container) where the ASCII elements are placed.

    document.body.appendChild(effect.domElement);

    controls = new TrackballControls(camera, effect.domElement);

    //

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    effect.setSize(window.innerWidth, window.innerHeight);

}

//

function animate() {

    requestAnimationFrame(animate);

    render();

}

function render() {

    currentPolyhedron.position.y += 0.005;
    currentPolyhedron.rotation.x += 0.005;
    currentPolyhedron.rotation.z += 0.005;

    controls.update();

    effect.render(scene, camera);

}