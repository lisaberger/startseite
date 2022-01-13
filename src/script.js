import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import elementsVertexShader from './shaders/elements/vertex.glsl'
import elementsFragmentShader from './shaders/elements/fragment.glsl'
import { TextureLoader } from 'three'

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureloader = new THREE.TextureLoader()
const particleTexture = textureloader.load('1.png')


/**
 * Elements
 */
const vertices = []
const materials = []

let parameters
let mouseX = 0, mouseY = 0


 for ( let i = 0; i < 500; i ++ ) {

    const x = Math.random() * 2000 - 1000;
    const y = Math.random() * 2000 - 1000;
    const z = Math.random() * 2000 - 1000;

    vertices.push( x, y, z );

}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

parameters = [
    [[ 1.0, 0.2, 0.5 ], 7 ],
    [[ 0.95, 0.1, 0.5 ], 4 ],
    [[ 0.90, 0.05, 0.5 ], 6 ],
    [[ 0.85, 0, 0.5 ], 5 ],
    [[ 0.80, 0, 0.5 ], 3 ]
];

for ( let i = 0; i < parameters.length; i ++ ) {

    const color = parameters[ i ][ 0 ];
    const size = parameters[ i ][ 1 ];

    materials[ i ] = new THREE.PointsMaterial({
        size: size,
        color: 0xB461D1,
        map: particleTexture,
        blending: THREE.AdditiveBlending, 
        depthTest: false, 
        transparent: true 
    });

    // materials[ i ].color.setHSL( color[ 0 ], color[ 1 ], color[ 2 ] );

    const particles = new THREE.Points( geometry, materials[ i ] );

    particles.rotation.x = Math.random() * 6;
    particles.rotation.y = Math.random() * 6;
    particles.rotation.z = Math.random() * 6;

    scene.add( particles );
}


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

document.body.style.touchAction = 'none';
document.body.addEventListener( 'pointermove', onPointerMove );

function onPointerMove( event ) {

    if ( event.isPrimary === false ) return;

    mouseX = event.clientX - sizes.width/2;
    mouseY = event.clientY - sizes.height/2;

}



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 2000)
camera.position.z = 1000
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // alpha: true
})
// renderer.setClearAlpha(0)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



/**
 * Animate
 */
const clock = new THREE.Clock()

const animate = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update material

    // Update controls
    controls.update()

    camera.position.x += ( mouseX - camera.position.x ) * 0.0008;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.0008;

	// camera.lookAt( scene.position );

	for ( let i = 0; i < scene.children.length; i ++ ) {

		const object = scene.children[ i ];

		if ( object instanceof THREE.Points ) {

			object.rotation.y = elapsedTime * ( i < 4 ? i + 1 : - ( i + 1 ) ) * 0.003;

		}

	}

	for ( let i = 0; i < materials.length; i ++ ) {

		const color = parameters[ i ][ 0 ];

		const h = ( 360 * ( color[ 0 ] + elapsedTime ) % 360 ) / 360;
					// materials[ i ].color.setHSL( h, color[ 1 ], color[ 2 ] );

	}

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(animate)
}

animate()