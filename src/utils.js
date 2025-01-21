export class Camera
{
    static async Initialize( constraints = {} )
    {
        if( 'facingMode' in constraints && 'deviceId' in constraints )
        {
            throw new Error( `Camera settings 'deviceId' and 'facingMode' are mutually exclusive.` );
        }

        if( 'facingMode' in constraints && !['environment', 'user'].includes( constraints.facingMode ) )
        {
            throw new Error( `Camera settings 'facingMode' can only be 'environment' or 'user'.` );
        }

        const setupUserMediaStream = async ( permission ) =>
        {
            if( permission && permission.state === 'denied' )
            {
                throw new Error( `Failed to access camera: Permission denied.` );
            }

            try
            {
                const stream = await navigator.mediaDevices.getUserMedia( constraints );
                const video = document.createElement( 'video' );
                video.setAttribute( 'autoplay', 'autoplay' );
                video.setAttribute( 'playsinline', 'playsinline' );
                video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
                video.srcObject = stream;

                return new Promise( ( resolve, reject ) =>
                {
                    video.onloadedmetadata = () =>
                    {
                        const settings = stream.getVideoTracks()[0].getSettings();
                        const tw = settings.width;
                        const th = settings.height;
                        const vw = video.videoWidth;
                        const vh = video.videoHeight;

                        if (vw !== tw || vh !== th) {
                            console.warn(`Video dimensions mismatch: width: ${tw}/${vw}, height: ${th}/${vh}`);
                        }

                        video.style.width = `${vw}px`;
                        video.style.height = `${vh}px`;
                        video.width = vw;
                        video.height = vh;
                        video.play();

                        resolve( new Camera( video ) );
                    };

                    video.onerror = () =>
                    {
                        reject( new Error( `Failed to load video metadata.` ) );
                    };
                } );
            }
            catch( error )
            {
                throw new Error( `Failed to access camera: ${error.message}` );
            }
        };

        if( navigator.permissions && navigator.permissions.query )
        {
            try
            {
                const permission = await navigator.permissions.query( { name: 'camera' } );
                return await setupUserMediaStream( permission );
            }
            catch
            {
                return await setupUserMediaStream();
            }
        }
        else
        {
            return await setupUserMediaStream();
        }
    }

    constructor( videoElement )
    {
        this.el = videoElement;
        this.width = videoElement.videoWidth;
        this.height = videoElement.videoHeight;

        this._canvas = document.createElement( 'canvas' );
        this._canvas.width = this.width;
        this._canvas.height = this.height;
        this._ctx = this._canvas.getContext( '2d', { willReadFrequently: true } );
    }

    getImageData()
    {
        this._ctx.clearRect( 0, 0, this.width, this.height );
        this._ctx.drawImage( this.el, 0, 0, this.width, this.height );

        return this._ctx.getImageData( 0, 0, this.width, this.height );
    }
}

export function resize2cover( srcW, srcH, dstW, dstH )
{
    const rect = {};

    if( dstW / dstH > srcW / srcH )
    {
        const scale = dstW / srcW;
        rect.width = ~~(scale * srcW);
        rect.height = ~~(scale * srcH);
        rect.x = 0;
        rect.y = ~~((dstH - rect.height) * 0.5);
    }
    else
    {
        const scale = dstH / srcH;
        rect.width = ~~(scale * srcW);
        rect.height = ~~(scale * srcH);
        rect.x = ~~((dstW - rect.width) * 0.5);
        rect.y = 0;
    }

    return rect;
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