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
});
