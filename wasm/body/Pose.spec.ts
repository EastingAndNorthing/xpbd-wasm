import { Pose } from './Pose';
import { x, y, z, w, eps } from '../test-constants.spec';
import { Vec3 } from '../math/Vec3.simd';
import { Quat } from '../math/Quat.simd';

describe('Pose', () => {
    test('Pose constructor', () => {
        const ref = new Pose();
        expect<Pose>(ref).toBe(ref, 'Reference Equality');
    });

    test('copy', () => {
        const p = new Pose(new Vec3(x, y, z), new Quat(x, y, z, w));
        const copy = new Pose().copy(p);

        check(copy.p, x, y, z);
    });

    test('clone', () => {
        const p = new Pose(new Vec3(x, y, z), new Quat(x, y, z, w));
        const copy = p.clone();

        check(copy.p, x, y, z);
    });

    test('translate/invTranslate', () => {
        const p = new Pose(new Vec3(x, y, z), new Quat(x, y, z, w).normalize());
        const v = new Vec3(x, y, z);
        
        p.translate(v);
        check(v, 2 * x, 2 * y, 2 * z);

        p.invTranslate(v);
        check(v, x, y, z);

    });

    test('rotate/invRotate', () => {
        const p = new Pose(new Vec3(x, y, z), new Quat(x, y, z, w).normalize());
        const v = new Vec3(x, y, z);
        
        p.rotate(v);
        check(v, 1.9999998807907104, 3.000000238418579, 4.0, 6);
        
        p.invRotate(v);
        check(v, x, y, z, 6);

    });
});

function check(v: Vec3, x: f32, y: f32, z: f32, decimals: i32 = 0): void {
    if (!decimals) {
        expect(v.x).toBe(x);
        expect(v.y).toBe(y);
        expect(v.z).toBe(z);
    } else {
        expect(v.x).toBeCloseTo(x, decimals);
        expect(v.y).toBeCloseTo(y, decimals);
        expect(v.z).toBeCloseTo(z, decimals);
    }
}
