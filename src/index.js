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

    const points = [
        (0, 0, 1.070466),
        (0.7136442, 0, 0.7978784),
        (-0.3568221, 0.618034, 0.7978784),
        (-0.3568221, -0.618034, 0.7978784),
        (0.7978784, 0.618034, 0.3568221),
        (0.7978784, -0.618034, 0.3568221),
        (-0.9341724, 0.381966, 0.3568221),
        (0.1362939, 1, 0.3568221),
        (0.1362939, -1, 0.3568221),
        (-0.9341724, -0.381966, 0.3568221),
        (0.9341724, 0.381966, -0.3568221),
        (0.9341724, -0.381966, -0.3568221),
        (-0.7978784, 0.618034, -0.3568221),
        (-0.1362939, 1, -0.3568221),
        (-0.1362939, -1, -0.3568221),
        (-0.7978784, -0.618034, -0.3568221),
        (0.3568221, 0.618034, -0.7978784),
        (0.3568221, -0.618034, -0.7978784),
        (-0.7136442, 0, -0.7978784),
        (0, 0, -1.070466),
    ];

    const vertices = data.vertex;
    const indices = data.face;

    // calculate a center coordinate point for each face using the component wise average of the vertices
    const faceCenters = indices.map(face => {
        // replace each vertex index with the actual vertex coordinates
        const faceVertices = face.map(vertexIndex => vertices[vertexIndex]);
        // calculate the average of each component of the vertices
        const faceCenter = faceVertices.reduce((acc, vertex) => {
            return acc.map((component, index) => component + vertex[index]);
        }, [0, 0, 0]).map(component => component / faceVertices.length);

        return faceCenter;
    });

    // add the face centers to the vertices
    const allVertices = vertices.concat(faceCenters);

    // create a new array of indices that includes the face centers
    const allIndices = indices.map(face => face.concat(face.map(vertexIndex => vertexIndex + vertices.length)));


    console.log(vertices);
    console.log(indices);
    console.log(faceCenters);

    const geometry = new THREE.BoxGeometry();




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

    const tetrahedron = createPolyhedronMesah(POLYHEDRA.Dodecahedron);

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