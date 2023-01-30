import { Quat } from './Quat';

// https://github.com/lume/glas/blob/main/src/as/math/Vector3.ts
export class Vec3 {

    public x: f32 = 0;
    public y: f32 = 0;
    public z: f32 = 0;

    // private lane: v128 = f32x4.splat(0);

    constructor(x: f32 = 0, y: f32 = 0, z: f32 = 0) {
        this.set(x, y, z);
    }
    
    static create(): Vec3 {
        return new Vec3();
    }

    @inline
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

    @inline
    add(a: Vec3): this {
        const l1 = f32x4(this.x, this.y, this.z, 0);
        const l2 = f32x4(a.x, a.y, a.z, 0);
        const res = f32x4.add(l1, l2);
        this._extract(res);

        return this;
    }

    @inline
    sub(a: Vec3): this {
        const l1 = f32x4(this.x, this.y, this.z, 0);
        const l2 = f32x4(a.x, a.y, a.z, 0);
        const res = f32x4.sub(l1, l2);
        this._extract(res);

        return this;
    }

    @inline
    addVectors(a: Vec3, b: Vec3): this {
        const l1 = f32x4(a.x, a.y, a.z, 0);
        const l2 = f32x4(b.x, b.y, b.z, 0);
        const res = f32x4.add(l1, l2);
        this._extract(res);

        return this;
    }

    @inline
    subVectors(a: Vec3, b: Vec3): this {
        const l1 = f32x4(a.x, a.y, a.z, 0);
        const l2 = f32x4(b.x, b.y, b.z, 0);
        const res = f32x4.sub(l1, l2);
        this._extract(res);

        return this;
    }

    /* @TODO remove? */
    @inline
	addScaledVector(v: Vec3, s: f32): this {
		this.x += v.x * s
		this.y += v.y * s
		this.z += v.z * s

		return this
	}

    /* Multiplication */

    @inline
    multiply(v: Vec3): this {
        const l1 = f32x4(this.x, this.y, this.z, 0);
        const l2 = f32x4(v.x, v.y, v.z, 0);
        const res = f32x4.mul(l1, l2);
        this._extract(res);

        return this;
    }

    @inline
    multiplyScalar(scalar: f32): this {
        const l1 = f32x4(this.x, this.y, this.z, 0);
        const l2 = f32x4.splat(scalar);
        const res = f32x4.mul(l1, l2);
        this._extract(res);

        return this;
    }

    @inline
    divideScalar(scalar: f32): this {
        return this.multiplyScalar(1 / scalar);
    }

    /* Vector math (self) */

    @inline
    lengthSq(): f32 {
        const l1 = f32x4(this.x, this.y, this.z, 0);
        const l2 = f32x4(this.x, this.y, this.z, 0);
        const res = f32x4.mul(l1, l2);
        
        return this._sum(res);
    }

    @inline
    length(): f32 {
        return Mathf.sqrt(this.lengthSq());
    }

    @inline
    normalize(): this {
        // @TODO use EPS
        return this.divideScalar(this.length() || 1);
    }

    /* Vector math (other vectors) */

    @inline
    dot(v: Vec3): f32 {
        return (this.x * v.x) + (this.y * v.y) + (this.z * v.z);
    }

    @inline
    cross(a: Vec3): this {
        return this.crossVectors(this, a);
    }

    @inline
    crossVectors(a: Vec3, b: Vec3): this {
        const ax = a.x,
            ay = a.y,
            az = a.z;
        const bx = b.x,
            by = b.y,
            bz = b.z;

        const l1 = f32x4(ay, az, az, ax);
        const l2 = f32x4(bz, by, bx, bz);
        const res = f32x4.mul(l1, l2);
        this.x = f32x4.extract_lane(res, 0) - f32x4.extract_lane(res, 1);
        this.y = f32x4.extract_lane(res, 2) - f32x4.extract_lane(res, 3);
        
        const l3 = f32x4(bx, 0, 0, by); // @TODO swizzle?
        const res2 = f32x4.mul(l1, l3);
        this.z = f32x4.extract_lane(res2, 3) - 
                    f32x4.extract_lane(res2, 0);

        return this;
    }

    @inline
    distanceTo(v: Vec3): f32 {
        return Mathf.sqrt(this.distanceToSquared(v));
    }

    @inline
    distanceToSquared(v: Vec3): f32 {
        const dx = this.x - v.x,
            dy = this.y - v.y,
            dz = this.z - v.z;

        return dx * dx + dy * dy + dz * dz;
    }

    /* Quaternions */
    
    @inline
    applyQuaternion(q: Quat): this {
        const x = this.x,
            y = this.y,
            z = this.z;
        const qx = q.x,
            qy = q.y,
            qz = q.z,
            qw = q.w;

        // calculate quat * vector

        const lq = f32x4(qx, qy, qz, qw);

        //              iy | ix ix ix
        const l1 = f32x4(z, z, y, x);
        const res1 = f32x4.mul(lq, l1);

        //              iz iz | iy iy
        const l2 = f32x4(y, x, x, y);  // @TODO swizzle?
        const res2 = f32x4.mul(lq, l2);

        //              iw iw iw | iz
        const l3 = f32x4(-x, y, z, z);
        const res3 = f32x4.mul(lq, l3);

        const ix = f32x4.extract_lane(res1, 1) - f32x4.extract_lane(res1, 2) + f32x4.extract_lane(res1, 3);
        const iy = f32x4.extract_lane(res2, 3) + f32x4.extract_lane(res2, 2) - f32x4.extract_lane(res1, 0);
        const iz = f32x4.extract_lane(res2, 0) - f32x4.extract_lane(res2, 1) + f32x4.extract_lane(res3, 3);
        const iw = f32x4.extract_lane(res3, 0) - f32x4.extract_lane(res3, 1) - f32x4.extract_lane(res3, 2);

        // calculate result * inverse quat
        // const lqinv = f32x4.neg(lq); // Inverse quat

        this.x = (ix * qw) + (iw * -qx) + (iy * -qz) - (iz * -qy);
        this.y = (iy * qw) + (iw * -qy) + (iz * -qx) - (ix * -qz);
        this.z = (iz * qw) + (iw * -qz) + (ix * -qy) - (iy * -qx);

        return this;
    }

    /* Static */

    @inline
    static mul(v: Vec3, s: f32): Vec3 {
        return v.clone().multiplyScalar(s);
    }

    @inline
    static div(v: Vec3, s: f32): Vec3 {
        return v.clone().divideScalar(s);
    }

    @inline
    static add(v1: Vec3, v2: Vec3): Vec3 {
        return new Vec3().addVectors(v1, v2);
    }

    @inline
    static sub(v1: Vec3, v2: Vec3): Vec3 {
        return new Vec3().subVectors(v1, v2);
    }

    /* Static math */

    @inline
    static normalize(v: Vec3): Vec3 {
        return v.clone().normalize();
    }

    @inline
    static cross(v1: Vec3, v2: Vec3): Vec3 {
        return new Vec3().crossVectors(v1, v2);
    }

    @inline
    static dot(v1: Vec3, v2: Vec3): f32 {
        return v1.dot(v2);
    }

    @inline
    _sum(lane: v128): f32 {
        return (
            f32x4.extract_lane(lane, 0) + 
            f32x4.extract_lane(lane, 1) + 
            f32x4.extract_lane(lane, 2)
        )
    }
    
    @inline
    _extract(lane: v128): void {
        this.x = f32x4.extract_lane(lane, 0);
        this.y = f32x4.extract_lane(lane, 1);
        this.z = f32x4.extract_lane(lane, 2);
    }
}
