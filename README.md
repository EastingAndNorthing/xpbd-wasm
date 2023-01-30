# XPBD physics solver in WebAssembly 🚀
Note: work in progress ;)

Physics solver built with AssemblyScript. Based on Extended Position Based Dynamics by [Matthias Müller](https://github.com/matthias-research).

For a working implementation of XPBD featuring TypeScript and THREE.js, see https://github.com/EastingAndNorthing/three 

## Development
`npm install` - Install dependencies

`npm run watch` - Runs the development testing suite

`npm run build` - Build the project

## Notes
https://www.assemblyscript.org/built-with-assemblyscript.html
https://github.com/lume/glas

- SIMD: 
    - https://github.com/WebAssembly/simd/blob/main/proposals/simd/SIMD.md
    - `ASC_FEATURE_SIMD` 

### Memory / GC
https://github.com/WebAssembly/gc
https://github.com/AssemblyScript/assemblyscript/issues/230
