import { ARHandler } from './ar-handler.js';
import { SceneManager } from './scene-manager.js';
import { UIController } from './ui-controller.js';

class PhysicsLab {
    constructor() {
        console.log('PhysicsLab: Initializing...');
        this.ui = new UIController();
        this.sceneManager = new SceneManager();
        this.arHandler = new ARHandler(this.sceneManager);
        
        this.init();
    }

    async init() {
        await this.ui.showLoadingScreen();
        this.initARExperience();
    }

    initARExperience() {
        this.ui.showStartButton();
        document.getElementById('start-button').addEventListener('click', async () => {
            try {
                await this.arHandler.startARSession();
                this.ui.hideLoadingScreen();
                this.ui.showARExperience();
                this.ui.updateInstructions('Point your camera at the Hiro marker');
            } catch (error) {
                console.error('Failed to start AR:', error);
                this.ui.showFallbackExperience();
            }
        });
    }
}

// Start the application when A-Frame is ready
document.addEventListener('DOMContentLoaded', () => {
    new PhysicsLab();
}); 