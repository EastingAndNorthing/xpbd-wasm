
export enum ColliderType {
    BOX,
    PLANE
}

export class Body {

    mesh: any;
    colliderType: any;

    constructor(colliderType: ColliderType, mesh: any) {
        this.colliderType = colliderType;
        this.mesh = mesh;
    }

}
