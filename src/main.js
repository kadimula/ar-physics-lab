import { SceneManager } from './scene-manager.js';
import { UIController } from './ui-controller.js';
import { AlvaAR } from './alva_ar.js';
import { Camera, onFrame, resize2cover } from './utils.js';

class PhysicsLab {
    constructor() {
        console.log('PhysicsLab: Initializing...');
        this.ui = new UIController();
        this.sceneManager = new SceneManager();
        this.init();
    }

    async init() {
        const config = {
            video: {
                facingMode: 'environment',
                aspectRatio: 16 / 9,
                width: { ideal: 1280 }
            },
            audio: false
        };

        this.initARExperience(config);
    }

    async initARExperience(config) {
        const $container = document.getElementById('container');
        const $view = document.createElement('div');
        const $canvas = document.createElement('canvas');
        const $overlay = document.getElementById('overlay');
        const $start = document.getElementById('start-button');
        const $splash = document.getElementById('splash');

        $start.addEventListener('click', async () => {
            $overlay.remove();
            try {
                const media = await Camera.Initialize(config);
                await this.startDemo(media, $container, $view, $canvas);
            } catch (error) {
                console.error('Camera error:', error);
                this.ui.showFallbackExperience();
            }
        });
    }

    async startDemo(media, $container, $view, $canvas) {
        // Set canvas size to match container
        $canvas.width = $container.clientWidth;
        $canvas.height = $container.clientHeight;
        
        const size = resize2cover($canvas, media.width, media.height);
        const ctx = $canvas.getContext('2d', { alpha: false, desynchronized: true });
        
        this.alvaAR = await AlvaAR.Initialize($canvas.width, $canvas.height);
        
        // Add both canvases to the container
        $container.appendChild($canvas); // Video canvas
        $container.appendChild(this.sceneManager.getCanvas()); // THREE.js canvas
        
        // Style the THREE.js canvas
        const threeCanvas = this.sceneManager.getCanvas();
        threeCanvas.style.position = 'absolute';
        threeCanvas.style.top = '0';
        threeCanvas.style.left = '0';
        threeCanvas.style.width = '100%';
        threeCanvas.style.height = '100%';
        threeCanvas.style.pointerEvents = 'none';

        let lastPoseTime = 0;
        const MIN_POSE_INTERVAL = 1000 / 30; // Max 30 pose updates per second

        onFrame(() => {
            ctx.clearRect(0, 0, $canvas.width, $canvas.height);

            if (!document['hidden']) {
                // Draw video frame to canvas
                ctx.drawImage(media.el, 0, 0, media.width, media.height, 
                             size.x, size.y, size.width, size.height);
                const frame = ctx.getImageData(0, 0, $canvas.width, $canvas.height);

                const now = performance.now();
                if (now - lastPoseTime >= MIN_POSE_INTERVAL) {
                    // Process frame with AlvaAR
                    const pose = this.alvaAR.findCameraPose(frame);
                    if (pose) {
                        requestAnimationFrame(() => {
                            this.sceneManager.updateFromPose(pose);
                        });
                        lastPoseTime = now;
                    }
                }
            }
            return true;
        }, 60);

        // Handle window resize
        window.addEventListener('resize', () => {
            $canvas.width = $container.clientWidth;
            $canvas.height = $container.clientHeight;
            const newSize = resize2cover($canvas, media.width, media.height);
            Object.assign(size, newSize);
            
            // Update THREE.js canvas size
            this.sceneManager.renderer.setSize(window.innerWidth, window.innerHeight);
            this.sceneManager.camera.aspect = window.innerWidth / window.innerHeight;
            this.sceneManager.camera.updateProjectionMatrix();
        });
    }
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PhysicsLab();
}); 