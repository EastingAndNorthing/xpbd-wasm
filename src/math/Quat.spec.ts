import { Quat } from './Quat';
import { x, y, z, w, eps } from '../test-constants.spec';

describe('Quat', () => {
    test('Reference equality', () => {
        const ref = new Quat();
        expect<Quat>(ref).toBe(ref, 'Reference Equality');
    });

    test('Quaternion constructor / set', () => {
        const a = new Quat();
        expect(a.x).toBe(0);
        expect(a.y).toBe(0);
        expect(a.z).toBe(0);
        expect(a.w).toBe(1);

        const b = new Quat(x, y, z, w);
        expect(b.x).toBe(x);
        expect(b.y).toBe(y);
        expect(b.z).toBe(z);
        expect(b.w).toBe(w);
    });

    test('inverse/conjugate', () => {
        const a = new Quat(x, y, z, w);
        const b = a.clone().conjugate();

        expect(a.x).toBe(-b.x);
        expect(a.y).toBe(-b.y);
        expect(a.z).toBe(-b.z);
        expect(a.w).toBe(b.w);
    });

    test('length', () => {
        const a = new Quat(x, y, z, w);
        expect(a.length()).toBeCloseTo(7.348469257354736, 11);
    });

    describe('multiplyQuaternions/multiply', () => {
        const q1 = new Quat(x, y, z, w);
        const q2 = new Quat(0.5, 0.5, 0.5, 1.0);

        const res = new Quat().multiplyQuaternions(q1, q2);

        expect(res.x).toBe(4.0, 'x component');
        expect(res.y).toBe(6.5, 'y component');
        expect(res.z).toBe(6.0, 'z component');
        expect(res.w).toBe(0.5, 'w component');
    });
});
