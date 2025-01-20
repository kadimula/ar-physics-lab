export class UIController {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.startButton = document.getElementById('start-button');
        this.arExperience = document.getElementById('ar-experience');
        this.fallbackExperience = document.getElementById('fallback-experience');
        this.experimentTitle = document.getElementById('experiment-title');
        this.instructionPanel = document.getElementById('instruction-panel');
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

    showARExperience() {
        this.arExperience.classList.remove('hidden');
        this.updateInstructions('Scan the room to find a flat surface');
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