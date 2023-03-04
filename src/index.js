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
    const faceCenters = indices.map((face) => {
        if (face.length > 3) {
            // replace each vertex index with the actual vertex coordinates
            const faceVertices = face.map(vertexIndex => vertices[vertexIndex]);
            // calculate the average of each component of the vertices
            const faceCenter = faceVertices.reduce((acc, vertex) => {
                return acc.map((component, index) => component + vertex[index]);
            }, [0, 0, 0]).map(component => component / faceVertices.length);
            // return the face center coordinates to the faceCenters array
            return faceCenter;
        }
        // if there are 3 vertices in the face, skip the face
    });

    // add new coordinates to the vertices array
    let faceIndicesStart;
    if (faceCenters) {
        faceIndicesStart = vertices.length - 1;
        vertices.push(...faceCenters);
    };

    for (let i = 0; i < indices.length; i++) {
        if (indices[i].length > 3) {
            const newFaceIndices = [];
            // if there are more than 3 vertices in the face, iterate through it and break it into the triangles
            for (let j = 0; j < indices[i].length; j++) {
                // [0, 1, 4, 7, 2] [coordinates of center of face]
                // [0, X, 1] [1, X, 4] [4, X, 7] [7, X, 2] [2, X, 0] where X is the index of the center of the face
                const currentVertex = indices[i][j];
                const nextVertex = indices[i][j + 1] || indices[i][0];
                // faces and face center indices are in the same order
                const faceCenterIndex = faceIndicesStart + i + 1;

                // break the face array into multiple triangle arrays
                newFaceIndices.push([currentVertex, faceCenterIndex, nextVertex]);

            };
            // replace the face array with the new triangle arrays
            indices[i] = newFaceIndices;
        };
    };

    // flatten the indices array and the vertices array
    // const flattenedIndices = new Uint32Array([indices.flat(Infinity)]);
    // const flattenedVertices = new Float32Array([vertices.flat(Infinity)]);
    const flattenedIndices = indices.flat(Infinity);
    const flattenedVertices = vertices.flat(Infinity);

    // Dodecahedron
    // 12 faces
    // 20 vertices
    // pentagonal faces
    // 3 coordinates per vertex
    // center point coordinates added to the end of the vertex array


    console.log(vertices); // 3 coordinates for 20 vertices and 12 face vertices - 96 vertices total
    console.log(indices); // original 20 vertices and 12 face vertices
    // 3 values per triangle - 5 triangles per face - 12 faces - 60 triangles - 180 indices

    // convert the index number to letter in the alphabet and console log the entire array
    // do it so that 0=A, 1=B, 2=C, etc.

    // iterate through the entire array and convert the numbers to letter then print the new array of letters

    let lettersIndex = [];
    for (let i = 0; i < flattenedIndices.length; i++) {
        const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
        lettersIndex.push(letters[flattenedIndices[i]]);
    };
    lettersIndex = lettersIndex.reduce((acc, letter, index) => {
        if (index % 3 === 0) {
            acc.push([letter]);
        } else {
            acc[acc.length - 1].push(letter);
        }
        return acc;
    }, []);

    console.log(lettersIndex);


    // console.log(faceCenters);
    // console.log(flattenedIndices);
    // console.log(flattenedVertices);

    // PROBLEM: arrays are being flatted properly, but the resulting geometry is not being rendered properly


    // create a new polyhedron geometry using the flattened indices and vertices arrays
    // const geometry = new THREE.BufferGeometry();
    // geometry.setAttribute('position', new THREE.BufferAttribute(flattenedVertices, 3));
    // geometry.setIndex(new THREE.BufferAttribute(flattenedIndices, 1));

    // create polyhedron geometry
    const geometry = new THREE.PolyhedronGeometry(flattenedVertices, flattenedIndices, 200, 0);



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

    // currentPolyhedron.rotation.y += 0.005;
    // currentPolyhedron.rotation.x += 0.005;
    // currentPolyhedron.rotation.z += 0.005;

    controls.update();

    currentEffect.render(scene, camera);

}