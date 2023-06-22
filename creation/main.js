
import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import * as dat from './node_modules/dat.gui/build/dat.gui.module.js';




// DAT.GUI
const gui = new dat.GUI();
const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 50,
    heightSegments: 50
  }
}
gui.add(world.plane, 'width', 1, 800).onChange(generatePlane);
gui.add(world.plane, 'height', 1, 800).onChange(generatePlane);
gui.add(world.plane, 'widthSegments', 1, 100).onChange(generatePlane);
gui.add(world.plane, 'heightSegments', 1, 100).onChange(generatePlane);



// GENERATE PLANE FUNCTION
function generatePlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width, 
    world.plane.height, 
    world.plane.widthSegments, 
    world.plane.heightSegments
    );
  
  // const {array} = planeMesh.geometry.attributes.position;

  //   for (let i = 0; i < array.length; i += 3){
  //     const x = array[i];
  //     const y = array[i + 1];
  //     const z = array[i + 2];
      
  //     array[i +2] = z + Math.random()
  //   }

  // VERTICES POSITION RANDOM
  const {array} = planeMesh.geometry.attributes.position;

  const randomValues = []

    for (let i = 0; i < array.length; i++){

      if(i % 3 === 0 ) {
        const x = array[i];
        const y = array[i + 1];
        const z = array[i + 2];
        
        array[i] = x + (Math.random() - 0.5) * 3
        array[i + 1] = y + (Math.random() - 0.5) * 3
        array[i +2] = z + (Math.random() - 0.5) * 5
      }
      

      randomValues.push(Math.random() * Math.PI * 2)
    }

    planeMesh.geometry.attributes.position.randomValues = randomValues

    planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array
  
  const colors = []
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
      colors.push(0, 0.19, 0.4)

    }
    planeMesh.geometry.setAttribute(
      'color', 
      new THREE.BufferAttribute(new Float32Array(colors), 3) 
      
      )
}



// SCENE CREATION
const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  100,
  innerWidth / innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight); 
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

// const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
// const mesh = new THREE.Mesh(boxGeometry, material);

// scene.add(mesh);


// ORBIT CONTROLS
new OrbitControls(camera, renderer.domElement);
camera.position.z = 60;

const planeGeometry = new THREE.PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthSegments,
  world.plane.heightSegments
  );
const planeMaterial = new THREE.MeshPhongMaterial({ 
  // color: 0xff0000, 
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

scene.add(planeMesh);




// COLOR ATTRIBUTE ADDITION
generatePlane()


// const colors = []
// for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
//   colors.push(0, 0.19, 0.4)
// }
// planeMesh.geometry.setAttribute(
//   'color', 
//   new THREE.BufferAttribute(new Float32Array(colors), 3) 
  
//   )


// LIGHTING
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, -1)
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1)
scene.add(backLight);


const mouse = {
  x: undefined,
  y: undefined
}

let frame = 0;
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.01;

  planeMesh.rotation.x += 0.0003;
  planeMesh.rotation.y += 0.001;
  planeMesh.rotation.z += 0.001;


  // VERTICES MOVEMENT ANIMATION
  frame += 0.01;
  const { array, originalPosition, randomValues } = planeMesh.geometry.attributes.position
  for (let i = 0; i < array.length; i += 3){
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.009;

    array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.003;
  }
  planeMesh.geometry.attributes.position.needsUpdate = true;

  // MOUSE HOVER
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(planeMesh)

  if (intersects.length > 0) {
    
    const {color} = intersects[0].object.geometry.attributes

    color.setX(intersects[0].face.a, 0.1)
    color.setY(intersects[0].face.a, 0.5)
    color.setZ(intersects[0].face.a, 1)

    color.setX(intersects[0].face.b, 0.1)
    color.setY(intersects[0].face.b, 0.5)
    color.setZ(intersects[0].face.b, 1)

    color.setX(intersects[0].face.c, 0.1)
    color.setY(intersects[0].face.c, 0.5)
    color.setZ(intersects[0].face.c, 1)

    color.needsUpdate = true


    const initialColor = {
      r:  0,
      g: .19,
      b: .4
    }
    const hoverColor = {
      r:  0.1,
      g: .5,
      b: 1
    }
    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
      color.setX(intersects[0].face.a, hoverColor.r)
      color.setY(intersects[0].face.a, hoverColor.g)
      color.setZ(intersects[0].face.a, hoverColor.b)

      color.setX(intersects[0].face.b, hoverColor.r)
      color.setY(intersects[0].face.b, hoverColor.g)
      color.setZ(intersects[0].face.b, hoverColor.b)

      color.setX(intersects[0].face.c, hoverColor.r)
      color.setY(intersects[0].face.c, hoverColor.g)
      color.setZ(intersects[0].face.c, hoverColor.b)
      }
    })

  }
  
}

animate();



addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = - (event.clientY / innerHeight) * 2 + 1
})
