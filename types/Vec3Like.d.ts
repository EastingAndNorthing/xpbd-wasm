
export type Vec3Like = {
    x: number;
    y: number;
    z: number;

    fromArray: (array: number[]) => void;
    toArray: () => number[];
}
