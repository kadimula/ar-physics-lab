import * as THREE from 'three';
import { AlvaARConnectorTHREE } from './alva_ar_three.js';

export class SceneManager {
    constructor() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera with better AR settings
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            canvas: document.createElement('canvas')
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Setup lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);

        // Initialize the cube at a fixed position in world space
        this.cube = this.createCube();
        this.cube.position.set(0, 0, -1); // Fixed position in front of initial camera position
        this.scene.add(this.cube);

        // Initialize AlvaAR connector
        this.applyPose = AlvaARConnectorTHREE.Initialize(THREE);

        // Add camera transform group to handle pose updates
        this.cameraGroup = new THREE.Group();
        this.cameraGroup.add(this.camera);
        this.scene.add(this.cameraGroup);

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
        return new THREE.Mesh(geometry, material);
    }

    updateFromPose(pose) {
        if (!pose) return;

        // Create rotation quaternion and position vector for camera
        const rotation = new THREE.Quaternion();
        const position = new THREE.Vector3();

        // Apply the pose to get camera position/rotation
        this.applyPose(pose, rotation, position);

        // Update camera group transform (inverse of the pose)
        this.cameraGroup.position.copy(position);
        this.cameraGroup.quaternion.copy(rotation);
        
        // Invert the camera group's transform
        this.cameraGroup.position.multiplyScalar(-1);
        this.cameraGroup.quaternion.invert();
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