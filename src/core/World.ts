import * as WASM from '../../dist/wasm/release';
import { Object3D } from '../../types/Object3D';

/**
 * Browser / client World
 */
export class World {

    public objects: Array<Object3D> = [];

    private wasm: WebAssembly.Exports;
    private memory: WebAssembly.Memory;
    private f32arr: Float32Array;

    private bodyIdx = 0;
    private bodyMemSize = 7;

    constructor(instance: WebAssembly.Instance) {
        this.wasm = instance.exports;

        this.memory = instance.exports.memory as WebAssembly.Memory;
        this.f32arr = new Float32Array(this.memory.buffer);
    }

    addBody(Object3D: Object3D, sizeX = 1.0, sizeY = 1.0, sizeZ = 1.0): void {
        this.objects.push(Object3D);

        // @TODO add some nice glue here
        const addBox = this.wasm.addBox as typeof WASM.addBox;
        const addGround = this.wasm.addGround as typeof WASM.addGround;

        addBox(sizeX, sizeY, sizeZ);
        addGround();

        this.writeMemory(this.bodyIdx, [
            Object3D.position.x,
            Object3D.position.y,
            Object3D.position.z,
            Object3D.quaternion.x,
            Object3D.quaternion.y,
            Object3D.quaternion.z,
            Object3D.quaternion.w,
        ])

        Object3D.userData.physicsBody = this.bodyIdx;

        this.bodyIdx++;
    }

    public update(dt: number) {
        // const update = this.wasm.update as typeof WASM.update;
        // update(dt);

        this.syncState();
        
    }

    public syncState() {
        for (let i = 0; i < this.objects.length; i++) {
            const obj = this.objects[i];

            const ptr = i * this.bodyMemSize;

            obj.position.x   = this.f32arr[ptr + 0];
            obj.position.y   = this.f32arr[ptr + 1];
            obj.position.z   = this.f32arr[ptr + 2];
            obj.quaternion.x = this.f32arr[ptr + 3];
            obj.quaternion.y = this.f32arr[ptr + 4];
            obj.quaternion.z = this.f32arr[ptr + 5];
            obj.quaternion.w = this.f32arr[ptr + 6];
        }
    }

    private writeMemory(ptr: number, values: Array<number>) {
        for (let i = 0; i < values.length; i++) {
            this.f32arr[ptr + i] = values[i];
        }

        console.log(this.f32arr);
    }

}
