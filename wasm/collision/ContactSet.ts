import { Body } from "../body/Body";
import { Vec3 } from "../math/Vec3.simd";

export class ContactSet {

    A: Body;
    B: Body;

    // plane: Plane;

    lambda: f32 = 0;     //  λ   - lambda
    lambda_n: f32 = 0;   //  λn  - lambda N (normal)
    lambda_t: f32 = 0;   //  λn  - lambda T (tangential)

    /**
     * Contact point (world, on A)
     */
    p1: Vec3 = new Vec3(0.0, 0.0, 0.0);

    /**
     * Contact point (world, on B)
     */
    p2: Vec3 = new Vec3(0.0, 0.0, 0.0);

    /**
     * Contact point (local on A)
     */
    r1: Vec3 = new Vec3(0.0, 0.0, 0.0);

    /**
     * Contact point (local on B)
     */
    r2: Vec3 = new Vec3(0.0, 0.0, 0.0);

    /**
     * Contact normal
     */
    n: Vec3 = new Vec3(0.0, 0.0, 0.0);

    /**
     * Penetration depth
     */
    d: f32 = 0.0;

    /**
     * Relative velocity
     */
    vrel: Vec3 = new Vec3(0.0, 0.0, 0.0);

    /**
     * Normal velocity
     */
    vn: f32 = 0;

    e: f32 = 0; // Coefficient of restitution

    friction: f32 = 0;

    F: Vec3 = new Vec3(0, 0, 0); // Current constraint force
    Fn: f32 = 0; // Current constraint force (normal direction) == -contact.lambda_n / (h * h);

    constructor(A: Body, B: Body, normal: Vec3) {
        if (A === B || A.id == B.id)
            throw new Error('Cannot create a ContactSet with the same body');

        this.A = A;
        this.B = B;

        this.n = normal.clone();
        // this.plane = contactPlane.clone();
    }

    public update(): void {
        // @TODO maybe recalculate N as well
        const A = this.A;
        const B = this.B;

        const p1 = A.pose.p.clone().add(this.r1.clone().applyQuaternion(A.pose.q));
        const p2 = B.pose.p.clone().add(this.r2.clone().applyQuaternion(B.pose.q));

        this.p1 = p1;
        this.p2 = p2;
    }
};
