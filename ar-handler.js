export class ARHandler {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.xrSession = null;
        this.hitTestSource = null;
    }

    async startARSession() {
        if (!navigator.xr) {
            console.error('ARHandler: WebXR not supported');
            throw new Error('WebXR not supported');
        }

        console.log('ARHandler: Requesting AR session...');
        try {
            const session = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['hit-test', 'local-floor']
            });
            console.log('ARHandler: AR session started successfully');

            this.xrSession = session;
            await this.sceneManager.initAR(session);
            
            this.setupHitTesting();
        } catch (error) {
            console.error('ARHandler: Failed to start AR session:', error);
            throw error;
        }
    }

    async setupHitTesting() {
        const referenceSpace = await this.xrSession.requestReferenceSpace('local-floor');
        const viewerSpace = await this.xrSession.requestReferenceSpace('viewer');
        this.hitTestSource = await this.xrSession.requestHitTestSource({
            space: viewerSpace
        });
    }
} 