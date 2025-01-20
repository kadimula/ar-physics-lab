import * as THREE from 'three';

export class ARHandler {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.markerRoot = new THREE.Group();
        this.isRunning = false;
    }

    async startARSession() {
        try {
            console.log('ARHandler: Starting AR session with AR.js');
            
            // Get the A-Frame scene and marker
            const aframeScene = document.querySelector('a-scene');
            const marker = document.querySelector('a-marker');
            
            // Add our Three.js scene to the marker
            marker.object3D.add(this.markerRoot);
            this.markerRoot.add(this.sceneManager.scene);

            // Setup marker detection events
            marker.addEventListener('markerFound', () => {
                console.log('Marker Found');
                this.isRunning = true;
            });

            marker.addEventListener('markerLost', () => {
                console.log('Marker Lost');
                this.isRunning = false;
            });

            // Add some test content
            this.addTestContent();

        } catch (error) {
            console.error('ARHandler: Failed to start AR session:', error);
            throw error;
        }
    }

    addTestContent() {
        // Add a simple cube to test marker detection
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshNormalMaterial();
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 0.5, 0); // Position slightly above the marker
        this.markerRoot.add(cube);
    }
} 