// The entry file of your WebAssembly module.

import { Vec3 } from "./math/Vec3";

export function add(a: i32, b: i32): i32 {
  return a + b;
}

export function testModule(): f32 {
  const v = new Vec3(0,0,0);
  const v2 = new Vec3(0,5,0);

  const dist = v.distanceTo(v2);

  return dist;
}
