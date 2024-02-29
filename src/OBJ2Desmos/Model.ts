import { Earcut } from "three/src/extras/Earcut.js";

export class ModelParseError extends Error {};

export type Vert = {x: number, y: number, z: number};

export default class Model {
    vertices: Vert[];
    faces: number[][];

    constructor(vertices?: Vert[], faces?: number[][]) {
        this.vertices = vertices ?? [];
        this.faces = faces ?? [];
    }

    triangulate() {
        for (let i = 0; i < this.faces.length; i++) {
            if (this.faces[i].length > 3) {
                let face = this.faces.splice(i, 1)[0];
                let verts = [];
                for (let j = 0; j < face.length; j++) {
                    let index = face[j];
                    index -= index > 0 ? 1 : 0;
                    let vert = this.vertices.at(index);
                    if (vert === undefined) {
                        throw new ModelParseError(`Malformed OBJ: Vertex index ${index} does not exist on face ${face}`);
                    }
                    verts.push(vert.x, vert.y, vert.z);
                }
                let newIndices = Earcut.triangulate(verts, undefined, 3);
                for (let j = 0; j < newIndices.length; j += 3) {
                    this.faces.push([face[newIndices[j]], face[newIndices[j+1]], face[newIndices[j+2]]]);
                }
                i--;
            }
        }
    }

    static fromObj(data: string) {
        let meshData = { faces: [] as number[][], vertices: [] as Vert[] };
        const lines = data.split("\n");
    
        lines.forEach((line, lineNum) => {
            const splitLine = line.trim().split(" ");
            switch (splitLine[0]) {
                case "v":
                    let [_, x, y, z] = splitLine.map(parseFloat);
                    meshData.vertices.push({ x, y, z });
                    break;
                case "f":
                    let currentFace: number[] = [];
                    for (let i = 1; i < splitLine.length; i++) {
                        let currentIndex = parseFloat(splitLine[i].split("/")[0]);
                        currentIndex = currentIndex > 0
                            ? currentIndex - 1
                            : meshData.vertices.length + currentIndex;
    
                        const currentVert = meshData.vertices.at(currentIndex);
                        if (currentVert === undefined) {
                            throw new ModelParseError(
                                `Malformed OBJ: Vertex index ${currentIndex} does not exist on line ${lineNum}`
                            );
                        }
            
                        currentFace.push(currentIndex);
                    }
                    meshData.faces.push(currentFace);
                    break;
            }
        });

        return new this(meshData.vertices, meshData.faces);
    }
}