import { ARHandler } from '../ar-handler.js';
import { SceneManager } from '../view.js';
import { UIController } from '../ui-controller.js';

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
        
        console.log('PhysicsLab: Checking WebXR support...');
        if (navigator.xr) {
            try {
                const isARSupported = await navigator.xr.isSessionSupported('immersive-ar');
                console.log('PhysicsLab: AR supported:', isARSupported);
                if (isARSupported) {
                    this.initARExperience();
                } else {
                    console.warn('PhysicsLab: AR not supported, falling back...');
                    this.initFallbackExperience();
                }
            } catch (error) {
                console.error('PhysicsLab: Error checking AR support:', error);
                this.initFallbackExperience();
            }
        } else {
            console.warn('PhysicsLab: WebXR not available, falling back...');
            this.initFallbackExperience();
        }
    }

    initARExperience() {
        this.ui.showStartButton();
        document.getElementById('start-button').addEventListener('click', async () => {
            try {
                await this.arHandler.startARSession();
                this.ui.hideLoadingScreen();
                this.ui.showARExperience();
            } catch (error) {
                console.error('Failed to start AR session:', error);
                this.initFallbackExperience();
            }
        });
    }

    initFallbackExperience() {
        this.ui.hideLoadingScreen();
        this.ui.showFallbackExperience();
    }
}

// Start the application
window.addEventListener('load', () => {
    new PhysicsLab();
}); 