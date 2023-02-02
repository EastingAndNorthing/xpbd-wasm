import { Vec3 } from "../math/Vec3.simd";
import { Quat } from "../math/Quat.simd";

export class Pose {

    public p: Vec3;
    public q: Quat;

    constructor(p: Vec3 = new Vec3(), q: Quat = new Quat()) {
        this.p = p.clone();
        this.q = q.clone();
    }

    public clone(): Pose {
        return new Pose(this.p, this.q);
    }

    public copy(other: Pose): this {
        this.p.copy(other.p);
        this.q.copy(other.q);

        return this;
    }

    /** Applies this pose position to a vector */
    public translate(v: Vec3): void {
        v.add(this.p);
    }
    
    /** Subtracts this pose position from a vector */
    public invTranslate(v: Vec3): void {
        v.sub(this.p);
    }
    
    /** Applies this pose rotation to a vector */
    public rotate(v: Vec3): void {
        v.applyQuaternion(this.q);
    }

    /** Applies the inverse/conjugate of this pose rotation to a vector */
    public invRotate(v: Vec3): void {
        // @TODO prevent creating a copy here
        const inv = this.q.clone().conjugate();
        v.applyQuaternion(inv);
    }

    /** Applies the position and rotation of this pose to a vector */
    public transform(v: Vec3): void {
        v.applyQuaternion(this.q);
        v.add(this.p);
    }

    /** Applies the inverse position and rotation of this pose to a vector */
    public invTransform(v: Vec3): void {
        v.sub(this.p);
        this.invRotate(v);
    }

    /** Applies this pose to a given pose */
    public transformPose(pose: Pose): void {
        pose.q.multiplyQuaternions(this.q, pose.q);
        this.rotate(pose.p);
        pose.p.add(this.p);
    }
}
