import * as THREE from 'three';
import { AlvaARConnectorTHREE } from './alva_ar_three.js';

export class SceneManager {
    constructor() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            canvas: document.createElement('canvas')
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Setup lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 0);
        this.scene.add(directionalLight);

        // Initialize the cube
        this.cube = this.createCube();
        this.scene.add(this.cube);

        // Initialize AlvaAR connector
        this.applyPose = AlvaARConnectorTHREE.Initialize(THREE);

        // Start render loop
        this.animate();

        console.log('Scene setup complete');
    }

    createCube() {
        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0.8
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
        
        // Update cube position and rotation
        this.cube.position.copy(position);
        this.cube.quaternion.copy(rotation);
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