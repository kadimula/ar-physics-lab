export class UIController {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.startButton = document.getElementById('start-button');
        this.arExperience = document.getElementById('ar-experience');
        this.fallbackExperience = document.getElementById('fallback-experience');
        this.experimentTitle = document.getElementById('experiment-title');
        this.instructionPanel = document.getElementById('instruction-panel');
        this.landingPage = document.getElementById('landing-page');
    }

    async showLoadingScreen() {
        this.loadingScreen.classList.remove('hidden');
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    hideLoadingScreen() {
        this.loadingScreen.classList.add('hidden');
    }

    showStartButton() {
        this.startButton.classList.remove('hidden');
    }

    hideLandingPage() {
        this.landingPage.style.display = 'none';
    }

    createARScene() {
        const scene = document.createElement('a-scene');
        scene.setAttribute('embedded', '');
        
        const camera = document.createElement('a-entity');
        camera.setAttribute('camera', '');

        scene.appendChild(camera);

        document.body.appendChild(scene);
    }

    showARScene() {
        const aframeScene = document.querySelector('a-scene');
        aframeScene.style.display = 'block';
    }

    showARExperience() {
        this.arExperience.classList.remove('hidden');
    }

    showFallbackExperience() {
        this.fallbackExperience.classList.remove('hidden');
    }

    updateInstructions(text) {
        this.instructionPanel.textContent = text;
    }

    updateExperimentTitle(text) {
        this.experimentTitle.textContent = text;
    }
}