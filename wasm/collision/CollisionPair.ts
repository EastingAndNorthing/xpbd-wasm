import { Body } from "../body/Body";

export class CollisionPair {
    constructor(
        public A: Body,
        public B: Body,
    ) {
        if (A === B || A.id == B.id)
            throw new Error('Cannot create a CollisionPair with the same body');
    }
};
