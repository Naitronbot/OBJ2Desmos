import { Earcut } from "three/src/extras/Earcut.js";

class ModelParseError extends Error {};

type Vert = {x: number, y: number, z: number};
export type MeshData = {
    faces: number[][],
    vertices: Vert[]
};

abstract class ModelProcessor {
    meshData!: MeshData;

    constructor(dataString: string) {
        this.process(dataString);
    }

    triangulate(mesh?: MeshData) {
        mesh = mesh ?? this.meshData;
        let faces = mesh.faces;
        for (let i = 0; i < faces.length; i++) {
            if (faces[i].length > 3) {
                let face = faces.splice(i, 1)[0];
                let verts = [];
                for (let j = 0; j < face.length; j++) {
                    let index = face[j];
                    index -= index > 0 ? 1 : 0;
                    let vert = mesh.vertices.at(index);
                    if (vert === undefined) {
                        throw new ModelParseError(`Malformed OBJ: Vertex index ${index} does not exist on face ${face}`);
                    }
                    verts.push(vert.x, vert.y, vert.z);
                }
                let newIndices = Earcut.triangulate(verts, undefined, 3);
                for (let j = 0; j < newIndices.length; j += 3) {
                    mesh.faces.push([face[newIndices[j]], face[newIndices[j+1]], face[newIndices[j+2]]]);
                }
                i--;
            }
        }
    }

    abstract process(dataString: string): void;
}

export class ObjProcessor extends ModelProcessor {
    process(data: string) {
        let meshData = {faces: [] as number[][], vertices: [] as Vert[]};
        const lines = data.split("\n");

        for (let lineNum = 0; lineNum < lines.length; lineNum++) {
            const line = lines[lineNum];
            const splitLine = line.trim().split(" ");
            switch (splitLine[0]) {
                case 'v':
                    let [_,x,y,z] = splitLine.map(parseFloat);
                    meshData.vertices.push({x,y,z});
                    break;
                case 'f':
                    let currentFace: number[] = [];
                    for (let i = 1; i < splitLine.length; i++) {
                        let currentIndex = parseFloat(splitLine[i].split('/')[0]);
                        currentIndex = currentIndex > 0 ? currentIndex - 1 : meshData.vertices.length + currentIndex;

                        const currentVert = meshData.vertices.at(currentIndex);
                        if (currentVert === undefined) {
                            throw new ModelParseError(`Malformed OBJ: Vertex index ${currentIndex} does not exist on line ${lineNum}`);
                        }

                        currentFace.push(currentIndex);
                    }
                    meshData.faces.push(currentFace);
                    break;
            }
        }

        this.meshData = meshData;
    }
}