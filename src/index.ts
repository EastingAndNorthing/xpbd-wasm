import { Vec3 } from './math/Vec3';
import { Vec3 as Vec3SIMD } from './math/Vec3.simd';

assert(ASC_FEATURE_SIMD, "Expected SIMD to be enabled");

export * from './benchmark/benchmark';
