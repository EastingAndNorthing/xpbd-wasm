import { Vec3 } from "../math/Vec3";
import { Support } from "./Support";

export class Simplex {

	points: Array<Support> = [];
	size: i32 = 0;

	constructor() {
		this.points = [];
		this.size = 0;
	}

	public assign(points: Support[]): this {
		for (let i = 0; i < points.length; i++) {
			const v = points[i];
			this.points[i] = v;
			
		}

		this.size = points.length;

		return this;
	}

	public push_front(point: Support): void {
		this.points = [point, this.points[0], this.points[1], this.points[2]];
		this.size = Math.min(this.size + 1, this.points.length);
	}

};