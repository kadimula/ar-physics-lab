import * as THREE from 'three';

export class SceneManager {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.setupScene();
    }

    setupScene() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 0);
        this.scene.add(directionalLight);

        // Add scene helper
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
        
        // Add grid helper
        const gridHelper = new THREE.GridHelper(10, 10);
        this.scene.add(gridHelper);
        
        console.log('Scene setup complete:', {
            renderer: this.renderer,
            camera: this.camera,
            scene: this.scene
        });
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
} 