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

    triangulateMesh() {
        this.meshData = this.triangulate(this.meshData);
    }

    protected triangulate(meshData: MeshData) {
        // TODO
        return meshData;
    }

    abstract process(dataString: string): void;
}

export class ObjProcessor extends ModelProcessor {
    process(data: string): void {
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