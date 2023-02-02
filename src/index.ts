import { World } from './core/World';

export * from './core/World';
export * from './core/Body';

// https://github.com/torch2424/wasm-by-example/blob/master/demo-util/
export async function init(importObject?: WebAssembly.Imports): Promise<World> {
    
    let response: WebAssembly.WebAssemblyInstantiatedSource;

    const url = new URL('wasm/release.wasm', import.meta.url);

    if (!importObject) {
        importObject = {
            env: {
                abort(_msg: unknown, _file: unknown, line: unknown, column: unknown) {
                    console.error(`WASM abort called: ${_file} -> ${line}:${column}`, _msg);
                },
                console(_msg: unknown) {
                    console.log(_msg);
                }
            }
        };
    }

    // Check if the browser supports streaming instantiation
    if (WebAssembly.instantiateStreaming) {
        // Fetch the module, and instantiate it as it is downloading
        response = await WebAssembly.instantiateStreaming(
            fetch(url.href),
            importObject
        );
    } else {
        // Fallback to using fetch to download the entire module
        // And then instantiate the module
        const fetchAndInstantiateTask = async () => {
            const wasmArrayBuffer = await fetch(url.href).then(response =>
                response.arrayBuffer()
            );
            return WebAssembly.instantiate(wasmArrayBuffer, importObject);
        };
        response = await fetchAndInstantiateTask();
    }

    const instance = response.instance;
    const exports = instance.exports;
    const memory = exports.memory as WebAssembly.Memory;

    // const benchQuat = exports.benchQuat as typeof WASM.benchQuat;
    // benchQuat(1000);

    return new World(instance);
};


// const runWasm = async () => {
//     // Instantiate our wasm module
//     const wasmModule = await XPBD.init();

//     wasmModule.benchQuat();

//     // Get our exports object, with all of our exported Wasm Properties
//     const exports = wasmModule.instance.exports;

//     // Get our memory object from the exports
//     const memory = exports.memory;

//     // Create a Uint8Array to give us access to Wasm Memory
//     const wasmByteMemoryArray = new Uint8Array(memory.buffer);

//     // Let's read index zero from JS, to make sure Wasm wrote to
//     // wasm memory, and JS can read the "passed" value from Wasm
//     console.log(wasmByteMemoryArray[0]); // Should Log "24".

//     // Next let's write to index one, to make sure we can
//     // write wasm memory, and Wasm can read the "passed" value from JS
//     wasmByteMemoryArray[1] = 15;
//     console.log(exports.readWasmMemoryAndReturnIndexOne()); // Should Log "15"
// };
// runWasm();

