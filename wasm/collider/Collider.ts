import { Quat } from "../math/Quat.simd";
import { Vec3 } from "../math/Vec3.simd";

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

    public updateRotation(q: Quat): void {
        // console.log('updateRotation not implemented')
    }

};

export class PlaneCollider extends Collider {
    colliderType: ColliderType = ColliderType.Plane;

    normal: Vec3 = new Vec3(0.0, 1.0, 0.0);
    normalRef: Vec3 = new Vec3(0.0, 1.0, 0.0);
    
    // size = new Vec2(1.0, 1.0);
    // plane = new Plane(new Vec3(0, 1, 0));

    constructor(normal: Vec3) {
        super();

        this.normal = normal.normalize();
        this.normalRef = this.normal.clone();
        // this.plane = new Plane(normal);
    }

    override updateRotation(q: Quat): void {
        this.normalRef.applyQuaternion(q);
    }
};

export class MeshCollider extends Collider {
    colliderType: ColliderType = ColliderType.ConvexMesh;
    
    // @TODO dynamically set collider vertices based on given mesh vertices
    setGeometry(
        width: f32 = 1.0, 
        height: f32 = 1.0, 
        depth: f32 = 1.0
    ): this {

        // type: 'box'|'tetra'|'point'

        // if (type == 'point') {
        //     this.vertices = [new Vec3(0, 0, 0)];
        //     this.indices = [ 0 ];
        //     this.uniqueIndices = [ 0 ];
        // }

        // if (type == 'box') {
            this.vertices = [
                new Vec3(-width/2, height/2, depth/2 ),
                new Vec3(-width/2, -height/2, depth/2 ),
                new Vec3(width/2, height/2, depth/2 ),
                new Vec3(width/2, -height/2, depth/2 ),
                new Vec3(width/2, height/2, -depth/2 ),
                new Vec3(width/2, -height/2, -depth/2 ),
                new Vec3(-width/2, height/2, -depth/2 ),
                new Vec3(-width/2, -height/2, -depth/2 ),
            ];

            this.indices = [ 0, 1, 2, 3, 4, 5, 6, 7 ];
            this.uniqueIndices = [ 0, 1, 2, 3, 4, 5, 6, 7 ];
        // }

        // if (type == 'tetra') {
        //     const size = width;
        //     const sqrt8over9 = 0.9428090415820633658 * size;
        //     const sqrt2over9 = 0.4714045207910316829 * size;
        //     const sqrt2over3 = 0.8164965809277260327 * size;
        //     const oneThird = 0.333333333333333333 * size;

        //     this.vertices = [
        //         new Vec3(0, -oneThird, sqrt8over9),
        //         new Vec3(sqrt2over3, -oneThird, -sqrt2over9), 
        //         new Vec3(-sqrt2over3, -oneThird, -sqrt2over9),
        //         new Vec3(0, size, 0),
        //     ];

        //     this.uniqueIndices = [
        //         2, 1, 0,
        //         1, 2, 3,
        //         0, 3, 2,
        //         1, 3, 0,
        //     ];
        // }

        return this;
    }
};
