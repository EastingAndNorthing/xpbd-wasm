import { Collider } from '../collider/Collider';
import { Pose } from './Pose';
// import { Vec3 } from '../math/Vec3.simd';
// import { Quat } from '../math/Quat.simd';

export class Body {

    public id: u32 = 0;

    public collider: Collider;

    public pose: Pose = new Pose();
    public prevPose: Pose = new Pose();

    // public vel = new Vec3(0.0, 0.0, 0.0);
    // public omega = new Vec3(0.0, 0.0, 0.0);

    // /* Pre velocity solve velocities */
    // public velPrev = new Vec3(0.0, 0.0, 0.0);
    // public omegaPrev = new Vec3(0.0, 0.0, 0.0);

    // // private mass = 1.0;
    // private invMass = 1.0;
    // private invInertia = new Vec3(1.0, 1.0, 1.0);
    // public get mass() { return 1 / this.invMass; }

    // public force = new Vec3();
    // public torque = new Vec3();
    // public gravity = 1.0;

    // public bounciness = 0.5; // coefficient of restitution (e)
    // public staticFriction = 0.5;
    // public dynamicFriction = 0.3;

    // public isDynamic = true;

    // static maxRotationPerSubstep = 0.5;

    constructor(collider: Collider) {
        this.collider = collider;

        return this;
    }

    // public addTo(world: World): this {
    //     world.addBody(this);

    //     return this;
    // }

    // public setPos(x: number, y: number, z: number): this {
    //     this.pose.p.set(x, y, z);

    //     return this;
    // }

    // public setStatic(): this {
    //     this.isDynamic = false;
    //     this.gravity = 0.0;
    //     this.invMass = 0.0;
    //     this.invInertia = new Vec3(0.0);

    //     this.updateCollider();

    //     return this;
    // }

    // public setBox(size: Vec3, density = 1.0): this {
    //     let mass = size.x * size.y * size.z * density;
    //     this.invMass = 1.0 / mass;
    //     mass /= 12.0;
    //     this.invInertia.set(
    //         1.0 / (size.y * size.y + size.z * size.z) / mass,
    //         1.0 / (size.z * size.z + size.x * size.x) / mass,
    //         1.0 / (size.x * size.x + size.y * size.y) / mass);

    //     return this;
    // }

    // public getVelocityAt(pos: Vec3, usePrevVelocity = false): Vec3 {

    //     if (!this.isDynamic)
    //         return new Vec3(0, 0, 0);

    //     const v = usePrevVelocity ? this.velPrev.clone() : this.vel.clone();
    //     const o = usePrevVelocity ? this.omegaPrev.clone() : this.omega.clone();
    //     const p = usePrevVelocity ? this.prevPose.p.clone() : this.pose.p.clone();

    //     return Vec3.add(v, Vec3.cross(o, Vec3.sub(pos, p)));
    // }

    // public getInverseMass(normal: Vec3, pos: Vec3 | null = null): number {
    //     if (!this.isDynamic)
    //         return 0;

    //     let n = new Vec3();

    //     if (pos === null)
    //         n.copy(normal);
    //     else {
    //         n.subVectors(pos, this.pose.p);
    //         n.cross(normal);
    //     }

    //     this.pose.invRotate(n);
    //     let w =
    //         n.x * n.x * this.invInertia.x +
    //         n.y * n.y * this.invInertia.y +
    //         n.z * n.z * this.invInertia.z;

    //     if (pos !== null && pos.length() > 0.00001)
    //         w += this.invMass;

    //     return w;
    // }

    // public applyCorrection(corr: Vec3, pos: Vec3 | null = null, velocityLevel = false): void {
    //     if (!this.isDynamic)
    //         return;

    //     let dq = new Vec3();

    //     if (pos === null)
    //         dq.copy(corr);
    //     else {
    //         if (velocityLevel)
    //             this.vel.addScaledVector(corr, this.invMass);
    //         else
    //             this.pose.p.addScaledVector(corr, this.invMass);

    //         dq.subVectors(pos, this.pose.p);
    //         dq.cross(corr);
    //     }

    //     this.pose.invRotate(dq);
    //     dq.set(
    //         this.invInertia.x * dq.x,
    //         this.invInertia.y * dq.y,
    //         this.invInertia.z * dq.z
    //     );
    //     this.pose.rotate(dq);

    //     if (velocityLevel)
    //         this.omega.add(dq);
    //     else
    //         this.applyRotation(dq);

    // }

    // public applyRotation(rot: Vec3, scale: number = 1.0): void {

    //     // Safety clamping. This happens very rarely if the solver
    //     // wants to turn the body by more than 30 degrees in the
    //     // orders of milliseconds
    //     let maxPhi = 0.5;
    //     let phi = rot.length();
    //     if (phi * scale > maxPhi)
    //         scale = maxPhi / phi;

    //     let dq = new Quat(
    //         rot.x * scale,
    //         rot.y * scale,
    //         rot.z * scale,
    //         0.0
    //     );
    //     dq.multiply(this.pose.q);

    //     this.pose.q.set(
    //         this.pose.q.x + 0.5 * dq.x,
    //         this.pose.q.y + 0.5 * dq.y,
    //         this.pose.q.z + 0.5 * dq.z,
    //         this.pose.q.w + 0.5 * dq.w
    //     );
    //     this.pose.q.normalize();
    // }

    // public integrate(dt: number, gravity: Vec3): void {
    //     if (!this.isDynamic)
    //         return;

    //     this.prevPose.copy(this.pose);

    //     this.vel.add(Vec3.mul(gravity, this.gravity * dt));
    //     this.vel.add(Vec3.mul(this.force, this.invMass * dt));
    //     this.omega.addScaledVector(this.torque.clone().multiply(this.invInertia), dt);
    //     this.pose.p.addScaledVector(this.vel, dt);
    //     this.applyRotation(this.omega, dt);

    // }

    // public update(dt: number): void {
    //     if (!this.isDynamic)
    //         return;

    //     this.velPrev.copy(this.vel);
    //     this.omegaPrev.copy(this.omega);

    //     this.vel.subVectors(this.pose.p, this.prevPose.p);
    //     this.vel.multiplyScalar(1.0 / dt);

    //     let dq = new Quat;
    //     dq.multiplyQuaternions(this.pose.q, this.prevPose.q.conjugate());

    //     this.omega.set(
    //         dq.x * 2.0 / dt,
    //         dq.y * 2.0 / dt,
    //         dq.z * 2.0 / dt
    //     );

    //     if (dq.w < 0.0)
    //         this.omega.set(-this.omega.x, -this.omega.y, -this.omega.z);

    //     if (this.vel.length() < 0.005)
    //         this.vel.multiplyScalar(0);

    //     if (this.omega.length() < 0.005)
    //         this.omega.multiplyScalar(0);

    //     this.updateCollider();
    // }

    // // @TODO move to XPBD browser/client side
    // // public applyForceW(force: Vec3, worldPos: Vec3 = new Vec3(0,0,0)) {
    // //     const F = force.clone();

    // //     this.force.add(F);
    // //     this.torque.add(F.cross(this.pose.p.clone().sub(worldPos)))
    // // }

    // public updateCollider() {
    //     this.collider.updateRotation(this.pose.q);
    // }

}
