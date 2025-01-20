import * as THREE from 'three';

export class SceneManager {
    constructor() {
        this.scene = new THREE.Scene();
        
        // Setup lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 0);
        this.scene.add(directionalLight);

        console.log('Scene setup complete');
    }

    // Remove the render method as A-Frame/AR.js handles rendering
    // Remove initAR as we're not using WebXR anymore
} 