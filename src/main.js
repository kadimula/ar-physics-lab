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
        const size = resize2cover($canvas, media.width, media.height);
        const ctx = $canvas.getContext('2d', { alpha: false, desynchronized: true });
        
        this.alvaAR = await AlvaAR.Initialize($canvas.width, $canvas.height);
        
        $container.appendChild($canvas);
        $container.appendChild($view);

        onFrame(() => {
            ctx.clearRect(0, 0, $canvas.width, $canvas.height);

            if (!document['hidden']) {
                // Draw video frame to canvas
                ctx.drawImage(media.el, 0, 0, media.width, media.height, size.x, size.y, size.width, size.height);
                const frame = ctx.getImageData(0, 0, $canvas.width, $canvas.height);

                // Process frame with AlvaAR
                const pose = this.alvaAR.findCameraPose(frame);
                if (pose) {
                    console.log('Camera Pose:', pose);
                    // Update 3D scene with pose
                    this.sceneManager.updateFromPose(pose);
                }
            }
            return true;
        }, 30);
    }
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PhysicsLab();
}); 