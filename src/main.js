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
        document.getElementById('start-button').addEventListener('click', () => {
            this.arHandler.startARSession();
            this.ui.hideLoadingScreen();
            this.ui.showARExperience();
        });
    }
}

// Start the application
window.addEventListener('load', () => {
    new PhysicsLab();
}); 