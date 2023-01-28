import { Quat } from "../math/Quat";
import { Vec3 } from "../math/Vec3";

export enum ColliderType {
    Plane,
    ConvexMesh
    // Box,
    // Sphere,
};

export class Collider {

    colliderType: ColliderType = ColliderType.Plane;

    vertices: Array<Vec3> = [];
    indices: Array<number> = [];
    uniqueIndices: Array<number> = [];

    // relativePos: Vec3 = new Vec3();

    public updateRotation(q: Quat): void {
        // console.log('updateRotation not implemented')
    }

};



export class PlaneCollider extends Collider {
    colliderType = ColliderType.Plane;

    normal = new Vec3(0.0, 1.0, 0.0);
    normalRef = new Vec3(0.0, 1.0, 0.0);
    
    // size = new Vec2(1.0, 1.0);
    // plane = new Plane(new Vec3(0, 1, 0));

    constructor(normal: Vec3) {
        super();

        this.normal = normal.normalize();
        this.normalRef = this.normal.clone();
        // this.plane = new THREE.Plane(normal);
    }

    override updateRotation(q: Quat) {
        this.normalRef.applyQuaternion(q);
    }
};