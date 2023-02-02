import { Body } from "../body/Body";
import { Vec3 } from "../math/Vec3.simd";

export class ContactSet {

    A: Body;
    B: Body;

    // plane: Plane;

    lambda: number = 0;     //  λ   - lambda
    lambda_n: number = 0;   //  λn  - lambda N (normal)
    lambda_t: number = 0;   //  λn  - lambda T (tangential)

    /**
     * Contact point (world, on A)
     */
    p1 = new Vec3(0.0, 0.0, 0.0);

    /**
     * Contact point (world, on B)
     */
    p2 = new Vec3(0.0, 0.0, 0.0);

    /**
     * Contact point (local on A)
     */
    r1 = new Vec3(0.0, 0.0, 0.0);

    /**
     * Contact point (local on B)
     */
    r2 = new Vec3(0.0, 0.0, 0.0);

    /**
     * Contact normal
     */
    n = new Vec3(0.0, 0.0, 0.0);

    /**
     * Penetration depth
     */
    d: number = 0.0;

    /**
     * Relative velocity
     */
    vrel = new Vec3(0.0, 0.0, 0.0);

    /**
     * Normal velocity
     */
    vn: number = 0;

    e: number = 0; // Coefficient of restitution

    friction: number = 0;

    F: Vec3 = new Vec3(0, 0, 0); // Current constraint force
    Fn: number = 0; // Current constraint force (normal direction) == -contact.lambda_n / (h * h);

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
