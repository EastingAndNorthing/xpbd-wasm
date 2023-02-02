import { QuatLike } from "./QuatLike";
import { Vec3Like } from "./Vec3Like";

/**
 * Stripped down definition of Object3D (THREE.js)
 */
export class Object3D {

    constructor();

    /**
     * Unique number of this object instance.
     */
    id: number;

    uuid: string;

    /**
     * Optional name of the object (doesn't need to be unique).
     * @default ''
     */
    name: string;

    /**
     * @default 'Object3D'
     */
    type: string;

    // /**
    //  * Object's parent in the scene graph.
    //  * @default null
    //  */
    // parent: Object3D | null;

    /**
     * Array with object's children.
     * @default []
     */
    children: Object3D[];

    /**
     * Up direction.
     * @default THREE.Object3D.DefaultUp.clone()
     */
    up: Vec3Like;

    /**
     * Object's local position.
     * @default new THREE.Vec3Like()
     */
    readonly position: Vec3Like;

    /**
     * Object's local rotation (Euler angles), in radians.
     * @default new THREE.Euler()
     */
    readonly rotation: Vec3Like;

    /**
     * Object's local rotation as a Quaternion.
     * @default new THREE.Quaternion()
     */
    readonly quaternion: QuatLike;

    /**
     * Object's local scale.
     * @default new THREE.Vec3Like()
     */
    readonly scale: Vec3Like;

    /**
     * An object that can be used to store custom data about the Object3d. It should not hold references to functions as these will not be cloned.
     * @default {}
     */
    userData: { [key: string]: any };

    /**
     * Used to check whether this or derived classes are Object3Ds. Default is true.
     * You should not change this, as it is used internally for optimisation.
     */
    readonly isObject3D: true;

    static DefaultUp: Vec3Like;
    static DefaultMatrixAutoUpdate: boolean;
    static DefaultMatrixWorldAutoUpdate: boolean;

    // /**
    //  * Applies the matrix transform to the object and updates the object's position, rotation and scale.
    //  */
    // applyMatrix4(matrix: Matrix4): void;

    /**
     * Applies the rotation represented by the quaternion to the object.
     */
    applyQuaternion(quaternion: QuatLike): this;

    /**
     * axis -- A normalized vector in object space.
     * angle -- angle in radians
     * @param axis A normalized vector in object space.
     * @param angle angle in radians
     */
    setRotationFromAxisAngle(axis: Vec3Like, angle: number): void;

    /**
     * Calls setRotationFromEuler(euler) on the .quaternion.
     * @param euler Euler angle specifying rotation amount.
     */
    setRotationFromEuler(euler: Vec3Like): void;

    /**
     * Copy the given quaternion into .quaternion.
     * @param q normalized Quaternion
     */
    setRotationFromQuaternion(q: QuatLike): void;

    /**
     * Rotate an object along an axis in object space. The axis is assumed to be normalized.
     * @param axis	A normalized vector in object space.
     * @param angle	The angle in radians.
     */
    rotateOnAxis(axis: Vec3Like, angle: number): this;

    /**
     * Rotate an object along an axis in world space. The axis is assumed to be normalized. Method Assumes no rotated parent.
     * @param axis	A normalized vector in object space.
     * @param angle	The angle in radians.
     */
    rotateOnWorldAxis(axis: Vec3Like, angle: number): this;

    /**
     * Rotates the object around x axis in local space.
     * @param angle the angle to rotate in radians.
     */
    rotateX(angle: number): this;

    /**
     * Rotates the object around y axis in local space.
     * @param angle the angle to rotate in radians.
     */
    rotateY(angle: number): this;

    /**
     * Rotates the object around z axis in local space.
     * @param angle the angle to rotate in radians.
     */
    rotateZ(angle: number): this;

    /**
     * Translate an object by distance along an axis in object space. The axis is assumed to be normalized.
     * @param axis	A normalized vector in object space.
     * @param distance	The distance to translate.
     */
    translateOnAxis(axis: Vec3Like, distance: number): this;

    /**
     * Translates object along x axis by distance.
     * @param distance Distance.
     */
    translateX(distance: number): this;

    /**
     * Translates object along y axis by distance.
     * @param distance Distance.
     */
    translateY(distance: number): this;

    /**
     * Translates object along z axis by distance.
     * @param distance Distance.
     */
    translateZ(distance: number): this;

    /**
     * Updates the vector from local space to world space.
     * @param vector A local vector.
     */
    localToWorld(vector: Vec3Like): Vec3Like;

    /**
     * Updates the vector from world space to local space.
     * @param vector A world vector.
     */
    worldToLocal(vector: Vec3Like): Vec3Like;

    /**
     * Optionally, the x, y and z components of the world space position.
     * Rotates the object to face a point in world space.
     * This method does not support objects having non-uniformly-scaled parent(s).
     * @param vector A world vector to look at.
     */
    lookAt(vector: Vec3Like): void;
    lookAt(x: number, y: number, z: number): void;

    getWorldPosition(target: Vec3Like): Vec3Like;
    getWorldQuaternion(target: QuatLike): QuatLike;
    getWorldScale(target: Vec3Like): Vec3Like;
    getWorldDirection(target: Vec3Like): Vec3Like;

    // toJSON(meta?: { geometries: any; materials: any; textures: any; images: any }): any;

}
