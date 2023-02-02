import { Quat } from "./Quat.simd";
import { Vec3 } from "./Vec3.simd";

export class CoordinateSystem {

    static localToWorld(localVector: Vec3, rotation: Quat, translation: Vec3): Vec3 {
        return new Vec3()
            .copy(localVector)
            .applyQuaternion(rotation)
            .add(translation);
    }

    static worldToLocal(worldVector: Vec3, rotation: Quat, translation: Vec3): Vec3 {
        return new Vec3()
            .copy(worldVector)
            .sub(translation)
            .applyQuaternion(rotation.clone().conjugate())
    }
}
