import { Vec3 } from './Vec3.simd';
import { Quat } from './Quat.simd';
import { x, y, z, w, eps } from '../test-constants.spec';

describe('Vec3', () => {
    test('Reference equality', () => {
        const ref = new Vec3();
        expect<Vec3>(ref).toBe(ref, 'Reference Equality');
    });

    test('Should perform a memory comparison', () => {
        const a = new Vec3(1, 2, 3);
        const b = new Vec3(1, 2, 3);

        expect<Vec3>(a).toStrictEqual(
            b,
            'a and b have the same values, (discluding child references)'
        );
    });

    /* Addition and subtraction */

    test('add', () => {
        const a = new Vec3(x, y, z);
        const b = new Vec3(-x, -y, -z);

        a.add(b);
        expect(a.x).toBe(0);
        expect(a.y).toBe(0);
        expect(a.z).toBe(0);

        const c = new Vec3();
        c.addVectors(b, b);
        expect(c.x).toBe(-2 * x);
        expect(c.y).toBe(-2 * y);
        expect(c.z).toBe(-2 * z);
    });

    test('sub', () => {
        const a = new Vec3(x, y, z);
        const b = new Vec3(-x, -y, -z);

        a.sub(b);
        expect(a.x).toBe(2 * x);
        expect(a.y).toBe(2 * y);
        expect(a.z).toBe(2 * z);

        const c = new Vec3();
        c.subVectors(a, a);
        expect(c.x).toBe(0);
        expect(c.y).toBe(0);
        expect(c.z).toBe(0);
    });

    /* Multiplication */

    test('multiplyScalar', () => {
        const a = new Vec3(1, 2, 3);
        a.multiplyScalar(2.5);
        check(a, 2.5, 5, 7.5);
    });

    test('multiply', () => {
        const a = new Vec3(1, 2, 3);
        check(a.multiply(new Vec3(2, 2, 2)), 2, 4, 6);
    });

    test('mul', () => {
        const a = new Vec3(1, 2, 3);
        check(Vec3.mul(a, 2), 2, 4, 6);
    });

    /* Vector math (self) */
	
    test('length', () => {
        // This also checks length squared ;)
		const a = new Vec3(1, 2, 3)
		expect(a.length()).toBeCloseTo(3.74165738677, 11)
	})

    test('normalize', () => {
		const a = new Vec3(x, 0, 0)
		const b = new Vec3(0, -y, 0)
		const c = new Vec3(0, 0, z)

		a.normalize()
		expect(a.length()).toBe(1)
		expect(a.x).toBe(1)

		b.normalize()
		expect(b.length()).toBe(1)
		expect(b.y).toBe(-1)

		c.normalize()
		expect(c.length()).toBe(1)
		expect(c.z).toBe(1)
	})

    /* Vector math (other vectors) */

    test('dot', () => {
        const a = new Vec3(x, y, z);
        const b = new Vec3(-x, -y, -z);
        const c = new Vec3();

        let result = a.dot(b);
        expect(result).toBe(-x * x - y * y - z * z);

        result = a.dot(c);
        expect(result).toBe(0);
    });

    test('cross', () => {
        const a = new Vec3(x, y, z);
        const b = new Vec3(2 * x, -y, f32(0.5 * z));
        const crossed = new Vec3(18, 12, -18);

        a.cross(b);
        expect(Mathf.abs(a.x - crossed.x)).toBeLessThan(eps);
        expect(Mathf.abs(a.y - crossed.y)).toBeLessThan(eps);
        expect(Mathf.abs(a.z - crossed.z)).toBeLessThan(eps);
    });

    test('crossVectors', () => {
        const a = new Vec3(x, y, z);
        const b = new Vec3(x, -y, z);
        const c = new Vec3();
        const crossed = new Vec3(24, 0, -12);

        c.crossVectors(a, b);
        expect(Mathf.abs(c.x - crossed.x)).toBeLessThan(eps);
        expect(Mathf.abs(c.y - crossed.y)).toBeLessThan(eps);
        expect(Mathf.abs(c.z - crossed.z)).toBeLessThan(eps);
    });

    test('distanceToSquared', () => {
        const a = new Vec3(1, 3, 4);
        const b = new Vec3(3, 2, 5);
        expect(a.distanceToSquared(b)).toBe(6);
    });

    test('distanceTo', () => {
        const a = new Vec3(1, 3, 4);
        const b = new Vec3(3, 2, 5);
        expect(a.distanceTo(b)).toBeCloseTo(2.449489742783178, 15);
    });

    /* Quaternions */

    test('applyQuaternion', () => {
        const a = new Vec3(x, y, z);

        a.applyQuaternion(new Quat());
        expect(a.x).toBe(x, 'Identity rotation: check x');
        expect(a.y).toBe(y, 'Identity rotation: check y');
        expect(a.z).toBe(z, 'Identity rotation: check z');

        a.applyQuaternion(new Quat(x, y, z, w));
        expect(a.x).toBe(108, 'Normal rotation: check x');
        expect(a.y).toBe(162, 'Normal rotation: check y');
        expect(a.z).toBe(216, 'Normal rotation: check z');
    });

    // test('should compare strings', () => {
    //   expect<string>('a=' + '200').toBe('a=200', 'both strings are equal');
    // });

    // test('should compare values', () => {
    //   expect<i32>(10).toBeLessThan(200);
    //   expect<i32>(1000).toBeGreaterThan(200);
    //   expect<i32>(1000).toBeGreaterThanOrEqual(1000);
    //   expect<i32>(1000).toBeLessThanOrEqual(1000);
    // });

    // test('can log some values to the console', () => {
    //   log<string>('Hello world!'); // strings!
    //   log<f64>(3.1415); // floats!
    //   log<u8>(244); // integers!
    //   log<u64>(0xffffffff); // long values!
    //   log<ArrayBuffer>(new ArrayBuffer(50)); // bytes!
    // });
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
