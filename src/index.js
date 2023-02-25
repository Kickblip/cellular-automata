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

function createPolyhedronMesh(polyhedron) {

    const geometry = new THREE.BufferGeometry();

    // extract vertex data from JSON object
    const vertexData = polyhedron.vertex;
    const vertices = new Float32Array(vertexData.length);
    for (let i = 0; i < vertexData.length; i++) {
        vertices[i] = vertexData[i];
    }

    // create buffer attribute for vertex positions
    const positionAttribute = new THREE.BufferAttribute(vertices, 3);
    geometry.setAttribute('position', positionAttribute);

    // extract index data from JSON object
    const indexData = polyhedron.face;
    const indices = new Uint16Array(indexData.length);
    for (let i = 0; i < indexData.length; i++) {
        indices[i] = indexData[i];
    }

    // create buffer attribute for face indices
    const indexAttribute = new THREE.BufferAttribute(indices, 1);
    geometry.setIndex(indexAttribute);


    const material = new THREE.MeshPhongMaterial({ flatShading: true });
    const mesh = new THREE.Mesh(geometry, material);

    return mesh;

};
function polyhedronDataToMesh(data) {
    const polyhedron = new THREE.Object3D();

    // convert vertex data to THREE.js vectors
    const vertices = data.vertex.map(v => new THREE.Vector3().fromArray(v).multiplyScalar(100));
    const vertexGeometry = new THREE.SphereGeometry(6, 12, 6);
    const vertexMaterial = new THREE.MeshLambertMaterial({ color: 0x222244 });
    const vertexSingleMesh = new THREE.Mesh(vertexGeometry);

    const vertexAmalgam = new THREE.BufferGeometry();
    for (let i = 0; i < data.vertex.length; i++) {
        const vMesh = vertexSingleMesh.clone();
        vMesh.position.copy(vertices[i]);
        vertexAmalgam.merge(vMesh.geometry, vMesh.matrix);
    }
    const vertexMesh = new THREE.Mesh(vertexAmalgam, vertexMaterial);
    polyhedron.add(vertexMesh);

    // convert edge data to cylinders
    const edgeMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
    const edgeAmalgam = new THREE.BufferGeometry();
    for (let i = 0; i < data.edge.length; i++) {
        const index0 = data.edge[i][0];
        const index1 = data.edge[i][1];
        const eMesh = cylinderMesh(vertices[index0], vertices[index1], edgeMaterial);
        edgeAmalgam.merge(eMesh.geometry, eMesh.matrix);
    }
    const edgeMesh = new THREE.Mesh(edgeAmalgam, edgeMaterial);
    polyhedron.add(edgeMesh);

    // convert face data to a single (triangulated) geometry
    const faceMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        vertexColors: THREE.FaceColors,
        side: THREE.FrontSide,
        transparent: true,
        opacity: 0.8
    });
    const faceColors = {
        3: new THREE.Color(0xcc0000),
        4: new THREE.Color(0x00cc00),
        5: new THREE.Color(0x0000cc),
        6: new THREE.Color(0xcccc00),
        7: new THREE.Color(0x999999),
        8: new THREE.Color(0x990099),
        9: new THREE.Color(0xff6600),
        10: new THREE.Color(0x6666ff)
    };

    const geometry = new THREE.BufferGeometry();
    geometry.vertices = vertices;
    let faceIndex = 0;
    for (let faceNum = 0; faceNum < data.face.length; faceNum++) {
        for (let i = 0; i < data.face[faceNum].length - 2; i++) {
            geometry.faces[faceIndex] = new THREE.Face3(
                data.face[faceNum][0],
                data.face[faceNum][i + 1],
                data.face[faceNum][i + 2]
            );
            geometry.faces[faceIndex].color = faceColors[data.face[faceNum].length];
            faceIndex++;
        }
    }

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    const faces = new THREE.Mesh(geometry, faceMaterial);
    faces.scale.multiplyScalar(1.01);
    polyhedron.add(faces);

    const interiorMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        vertexColors: THREE.FaceColors,
        side: THREE.BackSide
    });

    const interiorFaces = new THREE.Mesh(geometry, interiorMaterial);
    interiorFaces.scale.multiplyScalar(0.99);
    polyhedron.add(interiorFaces);

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

    const tetrahedron = createPolyhedronMesh(POLYHEDRA.Tetrahedron);

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