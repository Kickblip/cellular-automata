import * as THREE from 'three';
import POLYHEDRA from '../dist/polyhedra.js';

import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

let camera, controls, scene, renderer, ascii, currentEffect;

let polyhedrons, currentPolyhedron;

init();
animate();


setTimeout(function () {
    // if the slider value is 2 (initial value) after 2.5 seconds, slowly raise the opacity of the hint element
    if (document.getElementById("faceSlider").value === "2") {
        let opacity = 0;
        const interval = setInterval(function () {
            opacity += 0.1;
            document.getElementById("hint").style.opacity = opacity;
            if (opacity >= 1) {
                clearInterval(interval);
            };
        }, 100);
    }
}, 2500);

// get the value of the slider when it is changed
document.getElementById("faceSlider").addEventListener("input", function () {
    // hide the hint element
    document.getElementById("hint").style.display = "none";

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
        // if the face has 3 vertices, skip the face
        return null;
    });

    // remove null values from faceCenters array
    for (let i = 0; i < faceCenters.length; i++) {
        if (faceCenters[i] === null) {
            faceCenters.splice(i, 1);
            i--;
        };
    }


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

    // flatten arrays so they can be used by the BufferGeometry
    const flattenedIndices = indices.flat(Infinity);
    const flattenedVertices = vertices.flat(Infinity);


    console.log(vertices);
    console.log(indices);
    console.log(faceCenters);
    console.log(flattenedVertices);
    console.log(flattenedIndices);


    // create a new polyhedron geometry using the flattened indices and vertices arrays
    // const geometry = new THREE.BufferGeometry();
    // geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(flattenedVertices), 3));
    // geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(flattenedIndices), 3));



    // create polyhedron geometry
    const geometry = new THREE.PolyhedronGeometry(flattenedVertices, flattenedIndices, 200, 0);


    geometry.computeVertexNormals();


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

    const tetrahedron = createPolyhedronMesah(POLYHEDRA.Tetrahedron);

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

    console.log(polyhedrons);

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
    currentPolyhedron.rotation.x += 0.005;
    currentPolyhedron.rotation.z += 0.005;

    controls.update();

    currentEffect.render(scene, camera);

}