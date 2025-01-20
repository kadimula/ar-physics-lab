import * as THREE from 'three';

export class ARHandler {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.markerRoot = new THREE.Group();
        this.isRunning = false;
    }

    async startARSession() {
        try {
            console.log('ARHandler: Starting AR session with AlvaAR');
            
            // Get the A-Frame scene
            const aframeScene = document.querySelector('a-scene');
            this.markerRoot.add(this.sceneManager.scene);
            aframeScene.appendChild(this.markerRoot); // Add markerRoot to the scene

            // Add some test content
            this.addTestContent();

        } catch (error) {
            console.error('ARHandler: Failed to start AR session:', error);
            throw error;
        }
    }

    addTestContent() {
        // Add a simple cube to test placement
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshNormalMaterial();
        const cube = new THREE.Mesh(geometry, material);
        
        // Set the position based on the camera pose
        const cameraPose = this.alvaAR.findCameraPose(); // Get the camera pose
        if (cameraPose) {
            cube.position.set(cameraPose[12], cameraPose[13], cameraPose[14]); // tx, ty, tz
        } else {
            cube.position.set(0, 0.5, 0); // Default position if no pose found
        }
        
        this.markerRoot.add(cube);
    }
} 