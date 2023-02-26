import { CollisionPair } from "../collision/CollisionPair";
import { ContactSet } from "../collision/ContactSet";
import { ColliderType, MeshCollider, PlaneCollider } from "../collider/Collider";
import { Body } from '../body/Body';
import { Vec3 } from "../math/Vec3.simd";
import { GjkEpa } from "../gjk-epa/GjkEpa";

export class XPBDSolver {

    static numSubsteps: i8 = 20;
    static h: f32 = 0.000833333333; //(1 / 60) / XPBDSolver.numSubsteps;

    // private narrowPhase: GjkEpa = new GjkEpa();

    public update(bodies: Array<Body>, constraints: Array<u8>, dt: f32, gravity: Vec3): void {

        // if (dt === 0)
        //     return;

        // const h = dt / this.numSubsteps;
        const h: f32 = (1 / 60) / XPBDSolver.numSubsteps;
        // const h = (1 / 120) / this.numSubsteps;
        // const h: f32 = XPBDSolver.h;
        
        const collisions = this.collectCollisionPairs(bodies, dt);

        // store<f32>(sizeof<f32>() * 30, <f32>collisions.length);

        for (let i = 0; i < XPBDSolver.numSubsteps; i++) {

            /* (3.5)
             * At each substep we iterate through the pairs
             * checking for actual collisions.
             */
            const contacts = this.getContacts(collisions);

            for (let j = 0; j < bodies.length; j++)
                bodies[j].integrate(h, gravity);

            // for (let j = 0; j < constraints.length; j++)
            //     constraints[j].solvePos(h);

            this.solvePositions(contacts, h);

            for (let j = 0; j < bodies.length; j++)
                bodies[j].update(h);

            // for (let j = 0; j < constraints.length; j++)
            //     constraints[j].solveVel(h);

            this.solveVelocities(contacts, h);
        }

        for (let i = 0; i < bodies.length; i++) {
            bodies[i].force.set(0, 0, 0);
            bodies[i].torque.set(0, 0, 0);

            bodies[i].writeMemory();
        }
    }

    private collectCollisionPairs(bodies: Array<Body>, dt: f32): Array<CollisionPair> {

        const collisions: Array<CollisionPair> = [];

        const combinations: Array<string> = [];

        for (let i = 0; i < bodies.length; i++) {
            const A = unchecked(bodies[i]);

            for (let j = 0; j < bodies.length; j++) {
                const B = unchecked(bodies[j]);

                if (!A.isDynamic && !B.isDynamic)
                    continue;

                if (A.id == B.id)
                    continue;

                const guid: string = [A.id, B.id].sort().toString();

                if (combinations.includes(guid))
                    continue;

                /* (3.5) k * dt * vbody */
                const collisionMargin: f32 = 2.0 * dt * Vec3.sub(A.vel, B.vel).length();

                switch(A.collider.colliderType) {
                    case ColliderType.ConvexMesh :
                        switch(B.collider.colliderType) {
                            case ColliderType.Plane : {

                                const MC = A.collider as MeshCollider;
                                const PC = B.collider as PlaneCollider;

                                let deepestPenetration: f32 = 0.0;

                                // This should be a simple AABB check instead of actual loop over all vertices
                                for(let i = 0; i < MC.uniqueIndices.length; i++) {
                                    const v: Vec3 = MC.vertices[MC.uniqueIndices[i]];

                                    // const contactPointW = CoordinateSystem.localToWorld(v, A.pose.q, A.pose.p);
                                    const contactPointW = A.localToWorld(v);
                                    const signedDistance = contactPointW.clone().sub(B.pose.p).dot(PC.normal);
                                    // const signedDistance = PC.plane.distanceToPoint(contactPointW);

                                    deepestPenetration = Mathf.min(deepestPenetration, signedDistance);
                                }

                                if(deepestPenetration < collisionMargin) {
                                    collisions.push(new CollisionPair( A, B ));
                                }

                                break;
                            }
                            default: break;
                        }
                    break;
                }
            }
        }

        return collisions;
    }

    public getContacts(collisions: Array<CollisionPair>): Array<ContactSet> {

        const contacts: Array<ContactSet> = [];

        for (let i = 0; i < collisions.length; i++) {
            const collision = unchecked(collisions[i]);

            const A = collision.A;
            const B = collision.B;

            switch(A.collider.colliderType) {
                case ColliderType.ConvexMesh :
                    switch(B.collider.colliderType) {
                        case ColliderType.Plane : {
                            this._meshPlaneContact(contacts, A, B);
                            break;
                        }
                        default: break;
                    }
                break;
            }
        }

        return contacts;
    }

    public _meshPlaneContact(contacts: Array<ContactSet>, A: Body, B: Body): void {
        const MC = A.collider as MeshCollider;
        const PC = B.collider as PlaneCollider;

        const N = new Vec3().copy(PC.normal);

        // @TODO check if vertex is actually inside plane size :)
        // @TODO maybe check if all vertices are in front of the plane first (skip otherwise)
        for(let i = 0; i < MC.uniqueIndices.length; i++) {

            /* (26) - p1 */
            const r1 = unchecked(MC.vertices[MC.uniqueIndices[i]]);;
            const p1 = unchecked(MC.verticesWorldSpace[MC.uniqueIndices[i]]);

            /* (26) - p2 */
            // const signedDistance = PC.plane.distanceToPoint(contactPointW);
            const signedDistance = Vec3.dot(N, Vec3.sub(p1, B.pose.p));
            const p2 = Vec3.sub(p1, Vec3.mul(N, signedDistance));
            // const r2 = CoordinateSystem.worldToLocal(p2, B.pose.q, B.pose.p);
            const r2 = B.worldToLocal(p2);

            /* (3.5) Penetration depth -- Note: sign was flipped! */
            // const d = - N.dot(Vec3.sub(p1, p2));
            const d = -signedDistance; // This matches the calculation above!

            /* (3.5) if d ≤ 0 we skip the contact */
            if (d <= 0.0)
                continue;

            const contact = new ContactSet(A, B, N);
            contact.d = signedDistance;

            contact.r1 = r1;
            contact.r2 = r2;
            contact.p1 = p1;
            contact.p2 = p2;

            /* (29) Set initial relative velocity */
            contact.vrel = Vec3.sub(
                contact.A.getVelocityAt(contact.p1),
                contact.B.getVelocityAt(contact.p2)
            );
            contact.vn = contact.vrel.dot(contact.n);

            contact.e = 0.5 * (A.bounciness + B.bounciness);
            contact.friction = 0.5 * (A.staticFriction + B.staticFriction);

            // this.debugContact(contact);
            
            contacts.push(contact);
        }
    }

    private solvePositions(contacts: Array<ContactSet>, h: f32): void {
        for(let i = 0; i < contacts.length; i++) {
            unchecked(this._solvePenetration(contacts[i], h));
            unchecked(this._solveFriction(contacts[i], h));
        }
    }

    private _solvePenetration(contact: ContactSet, h: f32): void {

        /* (26) - p1 & p2 */
        contact.update();

        /* (3.5) Penetration depth -- Note: sign was flipped! */
        contact.d = - Vec3.dot(Vec3.sub(contact.p1, contact.p2), contact.n);

        /* (3.5) if d ≤ 0 we skip the contact */
        if(contact.d <= 0.0)
            return;

        /* (3.5) Resolve penetration (Δx = dn using a = 0 and λn) */
        const dx = Vec3.mul(contact.n, contact.d);

        const delta_lambda = XPBDSolver.applyBodyPairCorrection(
            contact.A,
            contact.B,
            dx,
            0.0,
            h,
            contact.p1,
            contact.p2,
            false
        );

        /* (5) Update Lagrange multiplier */
        contact.lambda_n += delta_lambda;
    }

    private _solveFriction(contact: ContactSet, h: f32): void {

        /* (3.5)
         * To handle static friction we compute the relative
         * motion of the contact points and its tangential component
         */

        /* (26) Positions in current state and before the substep integration */
        const p1prev = contact.p1 // A.prevPose.p.clone().add(contact.r1.clone().applyQuaternion(A.prevPose.q));
        const p2prev = contact.p1 // B.prevPose.p.clone().add(contact.r2.clone().applyQuaternion(B.prevPose.q));
        contact.update();

        /* (27) (28) Relative motion and tangential component */
        const dp = Vec3.sub(
            Vec3.sub(contact.p1, p1prev),
            Vec3.sub(contact.p1, p2prev)
        );
        /* Note: the sign of dp_t was flipped! (Eq. 28) */
        const dp_t = Vec3.sub(
            Vec3.mul(contact.n, contact.n.dot(dp)),
            dp
        );

        /* (3.5)
         * To enforce static friction, we apply Δx = Δp_t
         * at the contact points with a = 0 but only if
         * λ_t < μ_s * λ_n.
         *
         * Note: with 1 position iteration, lambdaT is always zero!
         */
        if (contact.lambda_t > contact.friction * contact.lambda_n) {
            XPBDSolver.applyBodyPairCorrection(
                contact.A,
                contact.B,
                dp_t,
                0.0,
                h,
                contact.p1,
                contact.p2,
                false,
            );
        }

    }

    private solveVelocities(contacts: Array<ContactSet>, h: f32): void {

        /* (3.6) Velocity level */
        for(let i = 0; i < contacts.length; i++) {
            const contact = unchecked(contacts[i]);

            const dv = new Vec3();

            /* (29) Relative normal and tangential velocities
             *
             * Recalculate v and vn since the velocities are
             * solved *after* the body update step.
             */
            const v = Vec3.sub(
                contact.A.getVelocityAt(contact.p1),
                contact.B.getVelocityAt(contact.p2)
            );
            const vn = Vec3.dot(v, contact.n);
            const vt = Vec3.sub(v, Vec3.mul(contact.n, vn));

            /* (30) Friction */
            const Fn = -contact.lambda_n / (h * h);
            const friction = Mathf.min(h * contact.friction * Fn, vt.length());
            dv.sub(Vec3.normalize(vt).multiplyScalar(friction));

            /* (31, 32) @TODO dampening */

            /* (34) Restitution
             *
             * To avoid jittering we set e = 0 if vn is small (`threshold`).
             *
             * Note:
             * `vn_tilde` was already calculated before the position solve (Eq. 29)
             */
            const threshold: f32 = 2.0 * 9.81 * h;
            const e: f32 = Mathf.abs(vn) <= threshold ? 0.0 : contact.e;
            const vn_tilde: f32 = contact.vn;
            const restitution: f32 = -vn + Mathf.max(-e * vn_tilde, 0.0);
            dv.add(Vec3.mul(contact.n, restitution));

            /* (33) Velocity update */
            XPBDSolver.applyBodyPairCorrection(
                contact.A,
                contact.B,
                dv,
                0.0,
                h,
                contact.p1,
                contact.p2,
                true
            );
        }
    }

    static applyBodyPairCorrection(
        body0: Body | null,
        body1: Body | null,
        corr: Vec3,
        compliance: f32,
        dt: f32,
        pos0: Vec3 | null = null,
        pos1: Vec3 | null = null,
        velocityLevel: boolean = false
    ): f32
    {

        const C = corr.length();

        if (C < 0.000001)
            return 0;

        const n = Vec3.normalize(corr);

        const w0 = body0 ? body0.getInverseMass(n, pos0) : 0.0;
        const w1 = body1 ? body1.getInverseMass(n, pos1) : 0.0;

        const w = w0 + w1;
        if (w == 0.0)
            return 0;

        const dlambda = -C / (w + compliance / dt / dt);
        n.multiplyScalar(-dlambda);

        if (body0) body0.applyCorrection(n, pos0, velocityLevel);
        if (body1) body1.applyCorrection(n.multiplyScalar(-1.0), pos1, velocityLevel);

        return dlambda;
    }
}
