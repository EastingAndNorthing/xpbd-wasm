export class Quat {
    public x: f32 = 0;
    public y: f32 = 0;
    public z: f32 = 0;
    public w: f32 = 1;

    constructor(x: f32 = 0, y: f32 = 0, z: f32 = 0, w: f32 = 1) {
        this.set(x, y, z, w);
    }

    @inline
    _extract(lane: v128): void {
        this.x = f32x4.extract_lane(lane, 0);
        this.y = f32x4.extract_lane(lane, 1);
        this.z = f32x4.extract_lane(lane, 2);
    }

    set(x: f32 = 0, y: f32 = 0, z: f32 = 0, w: f32 = 1): this {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;
    }

    copy(source: Quat): this {
        this.x = source.x;
        this.y = source.y;
        this.z = source.z;
        this.w = source.w;

        return this;
    }

    clone(): Quat {
        return new Quat(this.x, this.y, this.z, this.w);
    }

    /* Math (self) */

    lengthSq(): f32 {
        // return (
        //     this.x * this.x +
        //     this.y * this.y +
        //     this.z * this.z +
        //     this.w * this.w
        // );

        const l1 = f32x4(this.x, this.y, this.z, this.w);
        const l2 = f32x4(this.x, this.y, this.z, this.w);
        const res = f32x4.mul(l1, l2);
        
        return this._sum(res);
    }

    length(): f32 {
        return Mathf.sqrt(this.lengthSq());
    }

    normalize(): this {
        let l = this.length();

        // @TODO use EPS instead
        if (l === 0) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;
        } else {
            l = 1 / l;

            this.x = this.x * l;
            this.y = this.y * l;
            this.z = this.z * l;
            this.w = this.w * l;
        }

        return this;
    }

    /**
     * Returns the rotational conjugate of this quaternion. The conjugate of a
     * quaternion represents the same rotation in the opposite direction about the
     * rotational axis.
     */
    conjugate(): this {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;

        return this;
    }

    /**
     * Alias of {@link conjugate()}
     */
    inverse(): this {
        return this.conjugate();
    }

    /* Multiplication */

    multiply(q: Quat): this {
        return this.multiplyQuaternions(this, q);
    }

    multiplyQuaternions(a: Quat, b: Quat): this {
        const qax = a.x,
            qay = a.y,
            qaz = a.z,
            qaw = a.w;

        const qbx = b.x,
            qby = b.y,
            qbz = b.z,
            qbw = b.w;

        // this.x = (qax * qbw) + (qaw * qbx) + (qay * qbz) - (qaz * qby);
        // this.y = (qay * qbw) + (qaw * qby) + (qaz * qbx) - (qax * qbz);
        // this.z = (qaz * qbw) + (qaw * qbz) + (qax * qby) - (qay * qbx);
        // this.w = (qaw * qbw) - (qax * qbx) - qay * qby - qaz * qbz;

        const lx1 = f32x4(qax, qaw, qay, qaz);
        const lx2 = f32x4(qbw, qbx, qbz, qby);
        const resX = f32x4.mul(lx1, lx2);

        const ly1 = f32x4(qay, qaw, qaz, qax);
        const ly2 = f32x4(qbw, qby, qbx, qbz);
        const resY = f32x4.mul(ly1, ly2);

        const lz1 = f32x4(qaz, qaw, qax, qay);
        const lz2 = f32x4(qbw, qbz, qby, qbx);
        const resZ = f32x4.mul(lz1, lz2);

        const lw1 = f32x4(qaw, qax, qay, qaz);
        const lw2 = f32x4(qbw, qbx, qby, qbz);
        const resW = f32x4.mul(lw1, lw2);

        this.x = (
            f32x4.extract_lane(resX, 0) + 
            f32x4.extract_lane(resX, 1) + 
            f32x4.extract_lane(resX, 2) - 
            f32x4.extract_lane(resX, 3)
        );

        this.y = (
            f32x4.extract_lane(resY, 0) + 
            f32x4.extract_lane(resY, 1) + 
            f32x4.extract_lane(resY, 2) - 
            f32x4.extract_lane(resY, 3)
        );

        this.z = (
            f32x4.extract_lane(resZ, 0) + 
            f32x4.extract_lane(resZ, 1) + 
            f32x4.extract_lane(resZ, 2) - 
            f32x4.extract_lane(resZ, 3)
        );

        this.w = (
            f32x4.extract_lane(resW, 0) -
            f32x4.extract_lane(resW, 1) - 
            f32x4.extract_lane(resW, 2) - 
            f32x4.extract_lane(resW, 3)
        );

        return this;
    }

    @inline
    _sum(lane: v128): f32 {
        return (
            f32x4.extract_lane(lane, 0) + 
            f32x4.extract_lane(lane, 1) + 
            f32x4.extract_lane(lane, 2) + 
            f32x4.extract_lane(lane, 3)
        )
    }
}

