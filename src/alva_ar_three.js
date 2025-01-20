export class AlvaARConnectorTHREE {
    static Initialize(THREE) {
        return (pose, rotationQuaternion, translationVector) => {
            const m = new THREE.Matrix4().fromArray(pose);
            const r = new THREE.Quaternion().setFromRotationMatrix(m);
            const t = new THREE.Vector3(pose[12], pose[13], pose[14]);

            if (rotationQuaternion) rotationQuaternion.set(-r.x, r.y, r.z, r.w);
            if (translationVector) translationVector.set(t.x, -t.y, -t.z);
        };
    }
} 