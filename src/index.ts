import { Pose } from './body/Pose';
import { Quat } from './math/Quat';
import { Vec3 } from './math/Vec3';

assert(ASC_FEATURE_SIMD, "expected SIMD enabled");

export function add(a: i32, b: i32): i32 {
    return a + b;
}

export function benchmark(count: i32 = 10000): f64[] {
    // const results: f64[] = [];
    const results = new Array<f64>(count);

    const p = new Pose(new Vec3(1, 2, 3), new Quat(1, 2, 3, 1).normalize());
    
    const v = new Vec3(2, 3, 4);
    const q = new Quat(
        2,
        3,
        4,
        5
    ).normalize();

    for (let i = 0; i < count; i++) {

        p.transform(v);

        v.add(new Vec3(1, 2, 3));

        p.invTransform(v);

        // results.push(v.applyQuaternion(q).x);
        unchecked(results[i] = v.applyQuaternion(q).x);
    }

    return results;
}
