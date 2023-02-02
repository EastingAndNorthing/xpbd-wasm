
export type QuatLike = {
    x: number;
    y: number;
    z: number;
    w: number;
    
    fromArray: (array: number[]) => void;
    toArray: () => number[];
}
