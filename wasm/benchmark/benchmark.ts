import { Pose } from '../body/Pose';
import { Quat } from '../math/Quat';
import { Quat as QuatSIMD } from '../math/Quat.simd';
import { Vec3 } from '../math/Vec3';
import { Vec3 as Vec3SIMD } from '../math/Vec3.simd';

export function benchQuat(count: i32 = 100): Array<f32> {
    const q1 = new Quat(1, 2, 3, 4);
    const q2 = new Quat(1, 2, 3, 4);
    const q3 = new Quat();

    const result: Array<f32> = [];

    for (let i = 0; i < count; i++) {
        q3.multiplyQuaternions(q1.normalize(), q2.normalize()).normalize();
        result.push(q3.length());
    }

    return result;
}

export function benchQuatSIMD(count: i32 = 100): Array<f32> {
    const q1 = new QuatSIMD(1, 2, 3, 4);
    const q2 = new QuatSIMD(1, 2, 3, 4);
    const q3 = new QuatSIMD();

    const result: Array<f32> = [];

    for (let i = 0; i < count; i++) {
        q3.multiplyQuaternions(q1.normalize(), q2.normalize()).normalize();
        result.push(q3.length());
    }

    return result;
}

export function benchVec3(count: i32 = 100): boolean {
    const v = new Vec3(1, 2, 3);
    const v2 = new Vec3(1, 2, 1);
    const q2 = new Quat(1, 2, 3, 1).normalize();

    const result: Array<f32> = [];

    for (let i = 0; i < count; i++) {
        v.applyQuaternion(q2);
        v.multiply(v2);
        v.normalize();
        result.push(v.length());
    }

    return result[0] < 1.01;
    // return result;
}

export function benchVec3SIMD(count: i32 = 100): boolean {
    const v = new Vec3SIMD(1, 2, 3);
    const v2 = new Vec3SIMD(1, 2, 1);
    const q2 = new QuatSIMD(1, 2, 3, 1).normalize();

    const result: Array<f32> = [];

    for (let i = 0; i < count; i++) {
        v.applyQuaternion(q2);
        v.multiply(v2);
        v.normalize();
        result.push(v.length());
    }

    return result[0] < 1.01;
    // return result;
}

export function benchmarkIntegration(count: i32 = 100): usize {

    const ptr: usize = 0;
    const f32size = sizeof<f32>();

    const p = new Pose(new Vec3(1, 2, 3), new Quat(1, 2, 3, 1).normalize());
    
    const v = new Vec3(1, 3, 4);
    const q = new Quat(
        2,
        3,
        4,
        5
    ).normalize();

    for (let i = 0; i < count; i++) {

        // p.transform(v);

        // v.add(new Vec3(Mathf.random(), Mathf.random(), Mathf.random()));

        // p.invTransform(v);

        // results.push(v.applyQuaternion(q).x);
        // unchecked(results[i] = v.applyQuaternion(q).x);
        // view.setFloat32(i, v.applyQuaternion(q).x);

        p.p.add(v);

        store<f32>(ptr + i * f32size, p.p.x);
    }

    // return view;
    // return results;
    return ptr;
}

