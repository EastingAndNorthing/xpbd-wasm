import { Pose } from "../body/Pose";
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
    verticesWorldSpace: Array<Vec3> = [];

    indices: Array<i8> = [];
    uniqueIndices: Array<i8> = [];

    public updateGlobalPose(pose: Pose): void {
        // console.log('updateRotation not implemented')
    }

    /* GJK */
    public findFurthestPoint(dir: Vec3): Vec3 {
        return new Vec3();
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

    // override updateRotation(q: Quat): void {
    //     // this.normalRef.applyQuaternion(q);
    // }
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

            for (let i = 0; i < this.vertices.length; i++) {
                unchecked(this.verticesWorldSpace[i] = this.vertices[i].clone());
            }

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


    public override updateGlobalPose(pose: Pose): void {

        for (let i = 0; i < this.vertices.length; i++) {
            const v = this.vertices[i];

            this.verticesWorldSpace[i]
                .copy(v)
                .applyQuaternion(pose.q)
                .add(pose.p);

        }
    }

    /* GJK */
    public override findFurthestPoint(dir: Vec3): Vec3 {
        
        const maxPoint = new Vec3();
        let maxDist = -Infinity;
    
        for (let i = 0; i < this.verticesWorldSpace.length; i++) {
            const vertex = this.verticesWorldSpace[i];
            const distance = vertex.dot(dir);

            if (distance > maxDist) {
                maxDist = distance;
                maxPoint.copy(vertex);
            }
        }
    
        return maxPoint;
    }
};
