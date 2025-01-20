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

        // Add pose smoothing variables
        this.lastPosition = new THREE.Vector3();
        this.lastRotation = new THREE.Quaternion();
        this.smoothingFactor = 0.1; // Lower = smoother but more latency
        this.isFirstPose = true;

        // Start render loop
        this.animate();

        console.log('Scene setup complete');
    }

    createCube() {
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0.9,
            shininess: 60
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 0, -1); // Set initial position in front of camera
        return cube;
    }

    updateFromPose(pose) {
        if (!pose) return;

        const rotation = new THREE.Quaternion();
        const position = new THREE.Vector3();

        // Apply the pose to get new position/rotation
        this.applyPose(pose, rotation, position);

        if (this.isFirstPose) {
            // On first pose, set position directly
            this.cube.position.copy(position);
            this.cube.quaternion.copy(rotation);
            this.lastPosition.copy(position);
            this.lastRotation.copy(rotation);
            this.isFirstPose = false;
            return;
        }

        // Smooth position
        this.cube.position.lerp(position, this.smoothingFactor);
        this.cube.quaternion.slerp(rotation, this.smoothingFactor);

        // Update last known good values
        this.lastPosition.copy(this.cube.position);
        this.lastRotation.copy(this.cube.quaternion);

        // Optional: Add very subtle rotation animation
        this.cube.rotation.y += 0.001;
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