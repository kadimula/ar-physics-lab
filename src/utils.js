export class Camera {
    static async Initialize(config) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(config);
            const video = document.createElement('video');
            video.srcObject = stream;
            video.playsInline = true;
            
            await new Promise(resolve => {
                video.onloadedmetadata = () => {
                    video.play();
                    resolve();
                };
            });

            return {
                el: video,
                width: video.videoWidth,
                height: video.videoHeight
            };
        } catch (error) {
            throw new Error(`Failed to initialize camera: ${error.message}`);
        }
    }
}

export function resize2cover(canvas, width, height) {
    const ratio = Math.max(canvas.width / width, canvas.height / height);
    return {
        width: width * ratio,
        height: height * ratio,
        x: (canvas.width - width * ratio) / 2,
        y: (canvas.height - height * ratio) / 2
    };
}

export function onFrame(callback, fps = 30) {
    let then = performance.now();
    const interval = 1000 / fps;

    const animate = (now) => {
        requestAnimationFrame(animate);
        const delta = now - then;

        if (delta > interval) {
            then = now - (delta % interval);
            if (callback() === false) return;
        }
    };
    
    requestAnimationFrame(animate);
} 