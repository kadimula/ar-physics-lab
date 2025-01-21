import { ARCamView } from './view.js';
import { UIController } from './ui-controller.js';
import { AlvaAR } from './alva_ar.js';
import { Camera, onFrame, resize2cover } from './utils.js';

class PhysicsLab {
    constructor() {
        console.log('PhysicsLab: Initializing...');
        this.ui = new UIController();
        this.init();
    }

    async init() {
        const config = {
            video: {
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
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
                await this.startDemo(media, $container, $canvas, $view);
            } catch (error) {
                console.error('Camera error:', error);
                this.ui.showFallbackExperience();
            }
        });
    }

    /**
     * startDemo
     * @param {*} media ; looks like { el: HTMLVideoElement, width: number, height: number }
     * @param {*} $container 
     * @param {*} $view 
     * @param {*} $canvas 
     */

    async startDemo(media, $container, $canvas, $view) {
        console.log("media");
        console.log(media);
        const $video = media.el;

        $canvas.width = $container.clientWidth;
        $canvas.height = $container.clientHeight;
        
        const size = resize2cover( $video.videoWidth, $video.videoHeight, $container.clientWidth, $container.clientHeight );

        $canvas.width = $container.clientWidth;
        $canvas.height = $container.clientHeight;
        $video.style.width = size.width + 'px';
        $video.style.height = size.height + 'px';
        
        const ctx = $canvas.getContext('2d', { alpha: false, desynchronized: true });
        
        this.alvaAR = await AlvaAR.Initialize($canvas.width, $canvas.height);
        const view = new ARCamView( $view, $canvas.width, $canvas.height );

        $container.appendChild( $canvas );
        $container.appendChild( $view );

        onFrame(() => {
            ctx.clearRect(0, 0, $canvas.width, $canvas.height);

            if (!document['hidden']) {

                ctx.drawImage( $video, 0, 0, $video.videoWidth, $video.videoHeight, size.x, size.y, size.width, size.height );
                const frame = ctx.getImageData( 0, 0, $canvas.width, $canvas.height );

                const pose = this.alvaAR.findCameraPose( frame );

                if( pose )
                {
                    view.updateCameraPose( pose );
                }
                else
                {
                    view.lostCamera();

                    const dots = this.alvaAR.getFramePoints();

                    for( const p of dots )
                    {
                        ctx.fillStyle = 'white';
                        ctx.fillRect( p.x, p.y, 2, 2 );
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