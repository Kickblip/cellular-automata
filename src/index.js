import * as THREE from 'three';
import POLYHEDRA from './polyhedra.js';

import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

let camera, controls, scene, renderer, ascii, currentEffect;

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

    const label = document.getElementById("label");
    // update the text to show the current shape
    switch (sliderValue) {
        case "0":
            label.innerHTML = "Tetrahedron";
            break;
        case "1":
            label.innerHTML = "Cube";
            break;
        case "2":
            label.innerHTML = "Octahedron";
            break;
        case "3":
            label.innerHTML = "Dodecahedron";
            break;
        case "4":
            label.innerHTML = "Icosahedron";
            break;
    };

});

document.querySelector('.toggle-switch').addEventListener('click', function () {
    document.querySelector('.toggle-switch').classList.toggle('active');

    if (document.querySelector('.toggle-switch').classList.contains('active')) {
        document.body.removeChild(renderer.domElement);
        currentEffect = ascii;
        document.body.appendChild(currentEffect.domElement);
        controls = new TrackballControls(camera, currentEffect.domElement);
    }
    else {
        document.body.removeChild(ascii.domElement);
        currentEffect = renderer;
        document.body.appendChild(currentEffect.domElement);
        controls = new TrackballControls(camera, currentEffect.domElement);
    };
});


function createPolyhedronMesah(data) {

    // CUBE

    // const vertices = [
    //     -1, -1, -1,
    //     1, -1, -1,
    //     1, 1, -1,
    //     -1, 1, -1,
    //     -1, -1, 1,
    //     1, -1, 1,
    //     1, 1, 1,
    //     -1, 1, 1,
    // ];

    // const indices = [
    //     2, 1, 0, 0, 3, 2,
    //     0, 4, 7, 7, 3, 0,
    //     0, 1, 5, 5, 4, 0,
    //     1, 2, 6, 6, 5, 1,
    //     2, 3, 7, 7, 6, 2,
    //     4, 5, 6, 6, 7, 4
    // ];

    // const vertices = [
    //     0, 0, 1.224745, // A-0
    //     1.154701, 0, 0.4082483, // B-1
    //     -0.5773503, 1, 0.4082483, // C-2
    //     -0.5773503, -1, 0.4082483, // D-3
    //     0.5773503, 1, -0.4082483, // E-4
    //     0.5773503, -1, -0.4082483, // F-5
    //     -1.154701, 0, -0.4082483, // G-6
    //     0, 0, -1.224745 // H-7
    // ];

    const vertices = data.vertex.flat();

    const indices = data.face.flat();



    // // convert vertex data to THREE.js vectors
    // const vertex = []
    // for (let i = 0; i < data.vertex.length; i++)
    //     vertex.push(new THREE.Vector3(data.vertex[i][0], data.vertex[i][1], data.vertex[i][2]).multiplyScalar(100));

    // use the vertices and indices to create the faces of the cube. 

    // const points = [
    //     (0, 0, 1.070466),
    //     (0.7136442, 0, 0.7978784),
    //     (-0.3568221, 0.618034, 0.7978784),
    //     (-0.3568221, -0.618034, 0.7978784),
    //     (0.7978784, 0.618034, 0.3568221),
    //     (0.7978784, -0.618034, 0.3568221),
    //     (-0.9341724, 0.381966, 0.3568221),
    //     (0.1362939, 1, 0.3568221),
    //     (0.1362939, -1, 0.3568221),
    //     (-0.9341724, -0.381966, 0.3568221),
    //     (0.9341724, 0.381966, -0.3568221),
    //     (0.9341724, -0.381966, -0.3568221),
    //     (-0.7978784, 0.618034, -0.3568221),
    //     (-0.1362939, 1, -0.3568221),
    //     (-0.1362939, -1, -0.3568221),
    //     (-0.7978784, -0.618034, -0.3568221),
    //     (0.3568221, 0.618034, -0.7978784),
    //     (0.3568221, -0.618034, -0.7978784),
    //     (-0.7136442, 0, -0.7978784),
    //     (0, 0, -1.070466),
    // ]

    // How do I create a polyhedron from lists


    const geometry = new THREE.PolyhedronGeometry(vertices, indices, 200, 0);

    // create a buffer geometry from the vertices and indices
    // const geometry = new THREE.BufferGeometry();
    // geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([vertices]), 3));
    // geometry.setIndex(new THREE.BufferAttribute(new Uint32Array([indices]), 5));




    /*
    The list of eight triangular faces of the octahedron, where each face is represented by a list 
    of three vertex indices that correspond to the vertices that form the corners of the triangular face.
    */

    // const geometry = new THREE.PolyhedronGeometry(vertices, indices, 200, 0);

    const material = new THREE.MeshPhongMaterial({ flatShading: true });

    const polyhedron = new THREE.Mesh(geometry, material);

    return polyhedron;


}


function init() {

    document.querySelector('.toggle-switch').classList.toggle('active');

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 150;
    camera.position.z = 500;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0, 0, 0);

    const pointLight1 = new THREE.PointLight(0xffffff1);
    pointLight1.position.set(500, 500, 500);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.25);
    pointLight2.position.set(- 500, - 500, - 500);
    scene.add(pointLight2);



    // add a tetrahedron to the scene
    // const tetrahedron = new THREE.Mesh(new THREE.TetrahedronGeometry(200, 0), new THREE.MeshPhongMaterial({ flatShading: true }));

    const tetrahedron = createPolyhedronMesah(POLYHEDRA.Cube);

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

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    ascii = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true });
    ascii.setSize(window.innerWidth, window.innerHeight);
    ascii.domElement.style.color = 'white';
    ascii.domElement.style.backgroundColor = 'black';

    // Special case: append effect.domElement, instead of renderer.domElement.
    // AsciiEffect creates a custom domElement (a div container) where the ASCII elements are placed.

    currentEffect = ascii;

    document.body.appendChild(currentEffect.domElement);

    controls = new TrackballControls(camera, currentEffect.domElement);

    //

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    ascii.setSize(window.innerWidth, window.innerHeight);

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

    currentEffect.render(scene, camera);

}