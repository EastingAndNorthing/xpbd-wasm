export class Quat {
    public x: f32 = 0;
    public y: f32 = 0;
    public z: f32 = 0;
    public w: f32 = 1;

    constructor(x: f32 = 0, y: f32 = 0, z: f32 = 0, w: f32 = 1) {
        this.set(x, y, z, w);
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
        return (
            this.x * this.x +
            this.y * this.y +
            this.z * this.z +
            this.w * this.w
        );
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

        this.x = (qax * qbw) + (qaw * qbx) + (qay * qbz) - (qaz * qby);
        this.y = (qay * qbw) + (qaw * qby) + (qaz * qbx) - (qax * qbz);
        this.z = (qaz * qbw) + (qaw * qbz) + (qax * qby) - (qay * qbx);
        this.w = (qaw * qbw) - (qax * qbx) - qay * qby - qaz * qbz;

        return this;
    }
}

