import * as THREE from 'three';
import { AlvaARConnectorTHREE } from './alva_ar_three.js';

export class SceneManager {
    constructor() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera with better AR settings
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
        this.camera.position.set(0, 0, 0); // Camera at origin
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            canvas: document.createElement('canvas')
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Setup lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Increased intensity
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);

        // Initialize the cube with larger size
        this.cube = this.createCube();
        this.scene.add(this.cube);

        // Initialize AlvaAR connector
        this.applyPose = AlvaARConnectorTHREE.Initialize(THREE);

        // Start render loop
        this.animate();

        console.log('Scene setup complete');
    }

    createCube() {
        // Make the cube larger and more visible
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0.9,
            shininess: 60
        });
        return new THREE.Mesh(geometry, material);
    }

    updateFromPose(pose) {
        if (!pose) return;

        // Create rotation quaternion and position vector
        const rotation = new THREE.Quaternion();
        const position = new THREE.Vector3();

        // Apply the pose to the cube using AlvaAR's connector
        this.applyPose(pose, rotation, position);
        
        // Add a slight offset to move the cube in front of the camera
        position.z -= 0.5; // Move cube 0.5 units away from camera
        position.y -= 0.2; // Move cube slightly down for better visibility

        // Update cube position and rotation
        this.cube.position.copy(position);
        this.cube.quaternion.copy(rotation);
        
        // Optional: Add some rotation animation
        this.cube.rotation.y += 0.01;
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }

    getCanvas() {
        return this.renderer.domElement;
    }

    // Remove the render method as A-Frame/AR.js handles rendering
    // Remove initAR as we're not using WebXR anymore
} 