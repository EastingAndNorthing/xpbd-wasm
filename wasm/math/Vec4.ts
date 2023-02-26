import { Quat } from './Quat';

// https://github.com/lume/glas/blob/main/src/as/math/Vector3.ts
export class Vec4 {

    public x: f32 = 0;
    public y: f32 = 0;
    public z: f32 = 0;
    public w: f32 = 0;

    // private lane: v128 = f32x4.splat(0);

    constructor(x: f32 = 0, y: f32 = 0, z: f32 = 0, w: f32 = 0) {
        this.set(x, y, z, w);
    }

    static create(): Vec4 {
        return new Vec4();
    }

    @inline
    set(x: f32, y: f32, z: f32, w: f32): this {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;
    }

    clone(): Vec4 {
        return new Vec4(this.x, this.y, this.z, this.w);
    }

    copy(v: Vec4): this {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;

        return this;
    }

}
