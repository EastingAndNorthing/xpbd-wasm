import { Body } from '../body/Body';
import { Quat } from '../math/Quat.simd';
import { Vec3 } from '../math/Vec3.simd';
// import { XPBDSolver } from './XPBDSolver';

export class Vec3Like {
    x: f32; 
    y: f32; 
    z: f32;
}

export class QuatLike {
    x: f32; 
    y: f32; 
    z: f32;
    w: f32;
}

/**
 * WebAssembly World
 */
export class World {

    public bodies: Array<Body> = [];
    private bodyIdx: u32 = u32(0);
    private bodyMemSize: u32 = u32(7);
    
    // private solver: XPBDSolver;

    constructor() {
        // this.solver = new XPBDSolver();
        // store<f32>(sizeof<f32>() * 10, 100);
    }
    
    addBody(
        body: Body, 
    ): void {
        this.bodies.push(body);

        /**
         * AssemblyScript cannot pass objects like a vec3/quat yet, so the 
         * associated data is set by the browser via WebAssembly linear memory
         */
        // const offset = this.bodyIdx + (this.bodyMemSize * sizeof<f32>());
        // store<f32>(offset + sizeof<f32>() * 0, position.x);
        // store<f32>(offset + sizeof<f32>() * 1, position.y);
        // store<f32>(offset + sizeof<f32>() * 2, position.z);
        // store<f32>(offset + sizeof<f32>() * 3, quaternion.x);
        // store<f32>(offset + sizeof<f32>() * 4, quaternion.y);
        // store<f32>(offset + sizeof<f32>() * 5, quaternion.z);
        // store<f32>(offset + sizeof<f32>() * 6, quaternion.w);

        this.bodyIdx++;
    }

    update(dt: f32): void {
        // store<f32>(sizeof<f32>() * 20, 101);
        // this.solver.update(this.bodies, [], dt, new Vec3(0, -10, 0));
    }
    
}
