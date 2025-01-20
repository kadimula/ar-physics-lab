import { SceneManager } from './scene-manager.js';
import { UIController } from './ui-controller.js';
import { AlvaAR } from './alva_ar.js';

class PhysicsLab {
    constructor() {
        console.log('PhysicsLab: Initializing...');
        this.ui = new UIController();
        this.sceneManager = new SceneManager();
        
        this.init();
    }

    async init() {
        await this.ui.showLoadingScreen();
        this.initARExperience();
    }

    async initARExperience() {
        this.ui.showStartButton();
        document.getElementById('start-button').addEventListener('click', async () => {
            console.log('Start button clicked');
            this.ui.hideLandingPage();
            this.ui.createARScene();
            try {
                this.alvaAR = await AlvaAR.Initialize(window.innerWidth, window.innerHeight);
                this.ui.hideLoadingScreen();
                this.ui.showARExperience();
                this.ui.updateInstructions('Point your camera at a flat surface');
                
                this.startARSession();
            } catch (error) {
                console.error('Failed to start AR:', error);
                this.ui.showFallbackExperience();
            }
        });
    }

    startARSession() {
        const frame = {};
        const orientation = {};
        const motion = [];

        const cameraPose = this.alvaAR.findCameraPoseWithIMU(frame, orientation, motion);
        if (cameraPose) {
            console.log('Camera Pose:', cameraPose);
        }
    }
}

// Start the application when A-Frame is ready
document.addEventListener('DOMContentLoaded', () => {
    new PhysicsLab();
}); 