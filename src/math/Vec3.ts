import { Quat } from './Quat';

// https://github.com/lume/glas/blob/main/src/as/math/Vector3.ts
export class Vec3 {

    public x: f32 = 0; // @TODO f64 option at some point?
    public y: f32 = 0;
    public z: f32 = 0;

    constructor(x: f32 = 0, y: f32 = 0, z: f32 = 0) {
        this.set(x, y, z);
    }

    set(x: f32, y: f32, z: f32): this {
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    clone(): Vec3 {
        return new Vec3(this.x, this.y, this.z);
    }

    copy(v: Vec3): this {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;

        return this;
    }

    /* Addition and subtraction */

    add(a: Vec3): this {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;

        return this;
    }

    // @TODO implement operator overloading
    // @operator('+')
    // __op(other: Vec3): Vec3  {
    //     return new Vec3(
    //         this.x + other.x,
    //         this.y + other.y,
    //         this.z + other.z
    //     )
    // }

    sub(a: Vec3): this {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;

        return this;
    }

    addVectors(a: Vec3, b: Vec3): this {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;

        return this;
    }

    subVectors(a: Vec3, b: Vec3): this {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;

        return this;
    }

    /* @TODO remove? */
	addScaledVector(v: Vec3, s: f32): this {
		this.x += v.x * s
		this.y += v.y * s
		this.z += v.z * s

		return this
	}

    /* Multiplication */

    multiply(v: Vec3): this {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;

        return this;
    }

    multiplyScalar(scalar: f32): this {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;

        return this;
    }

    divideScalar(scalar: f32): this {
        return this.multiplyScalar(1 / scalar);
    }

    /* Vector math (self) */

    lengthSq(): f32 {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    length(): f32 {
        return Mathf.sqrt(this.lengthSq());
    }

    normalize(): this {
        return this.divideScalar(this.length() || 1);
    }

    /* Vector math (other vectors) */

    dot(v: Vec3): f32 {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(a: Vec3): this {
        return this.crossVectors(this, a);
    }

    crossVectors(a: Vec3, b: Vec3): this {
        const ax = a.x,
            ay = a.y,
            az = a.z;
        const bx = b.x,
            by = b.y,
            bz = b.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;
    }

    distanceTo(v: Vec3): f32 {
        return Mathf.sqrt(this.distanceToSquared(v));
    }

    distanceToSquared(v: Vec3): f32 {
        const dx = this.x - v.x,
            dy = this.y - v.y,
            dz = this.z - v.z;

        return dx * dx + dy * dy + dz * dz;
    }

    /* Quaternions */

    applyQuaternion(q: Quat): this {
        var x = this.x,
            y = this.y,
            z = this.z;
        var qx = q.x,
            qy = q.y,
            qz = q.z,
            qw = q.w;

        // calculate quat * vector

        var ix = qw * x + qy * z - qz * y;
        var iy = qw * y + qz * x - qx * z;
        var iz = qw * z + qx * y - qy * x;
        var iw = -qx * x - qy * y - qz * z;

        // calculate result * inverse quat

        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

        return this;
    }

    /* Static */

    static mul(v: Vec3, s: f32): Vec3 {
        return v.clone().multiplyScalar(s);
    }

    static div(v: Vec3, s: f32): Vec3 {
        return v.clone().divideScalar(s);
    }

    static add(v1: Vec3, v2: Vec3): Vec3 {
        return new Vec3().addVectors(v1, v2);
    }

    static sub(v1: Vec3, v2: Vec3): Vec3 {
        return new Vec3().subVectors(v1, v2);
    }

    /* Static math */

    static normalize(v: Vec3): Vec3 {
        return v.clone().normalize();
    }

    static cross(v1: Vec3, v2: Vec3): Vec3 {
        return new Vec3().crossVectors(v1, v2);
    }

    static dot(v1: Vec3, v2: Vec3): f32 {
        return v1.dot(v2);
    }
}
