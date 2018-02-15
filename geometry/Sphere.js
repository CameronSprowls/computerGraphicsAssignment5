/**
 * Created by Hans Dulimarta on 2/1/17.
 */
//import {toRadian} from "../gl-matrix-2.4.0/src/gl-matrix/common";

class Sphere extends Object3D {
  /**
   * Create a 3D sphere with tip at the Z+ axis and base on the XY plane
   * @param {Object} gl      the current WebGL context
   * @param {Number} radius  radius of the sphere
   * @param {Number} subDiv  number of recursive subdivisions
   * @param {vec3}   col1    color #1 to use
   */
    constructor (gl, radius, subDiv, col1) {
        super(gl);
        /* if colors are undefined, generate random colors */
        if (typeof col1 === "undefined")
            this.col1 = vec3.fromValues(Math.random(), Math.random(), Math.random());

        this.col1 = vec3.fromValues(Math.random(), Math.random(), Math.random());
        this.radius = radius;

        let seedA = vec3.fromValues(1, 1, 1);
        vec3.normalize(seedA, seedA);
        vec3.scale (seedA, seedA, radius);

        let seedB = vec3.fromValues(-1, -1, 1);
        vec3.normalize(seedB, seedB);
        vec3.scale (seedB, seedB, radius);

        let seedC = vec3.fromValues(-1, 1, -1);
        vec3.normalize(seedC, seedC);
        vec3.scale (seedC, seedC, radius);

        let seedD = vec3.fromValues(1, -1, -1);
        vec3.normalize(seedD, seedD);
        vec3.scale (seedD, seedD, radius);

        this.vertices = [];
        this.indices = [];
        this.indLength = 0;
        this.colors = [];

        // Get the points through recursive subdivision four times
        this.subDivideCircle(seedC, seedB, seedA, subDiv);
        this.subDivideCircle(seedD, seedA, seedB, subDiv);
        this.subDivideCircle(seedA, seedD, seedC, subDiv);
        this.subDivideCircle(seedB, seedC, seedD, subDiv);

        this.colors.push(this.col1[0], this.col1[1], this.col1[2]);

        // Populate indices
        for (let i = 0; i < this.indLength; i++){
            this.indices.push(i);
        }
        this.indices.push(0);

        this.colorBuff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(this.colors), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(this.vertices), gl.STATIC_DRAW);

        this.indBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(this.indices), gl.STATIC_DRAW);
        this.primitives.push({type: gl.TRIANGLES, buffer: this.indBuff, numPoints: this.indices.length/3});
  }

    /***
     * Get this to work
     * @param point1
     * @param point2
     * @param point3
     * @param subDiv
     */
    subDivideCircle(point1, point2, point3, subDiv) {
        if (subDiv > 0) {

            let midpoint1 = vec3.create();
            let midpoint2 = vec3.create();
            let midpoint3 = vec3.create();

            // Get the midpoints of all the vectors, normalize, and scale them
            vec3.add(midpoint1, point1, point2);
            midpoint1 = vec3.fromValues(midpoint1[0]/2, midpoint1[1]/2, midpoint1[2]/2);
            vec3.normalize(midpoint1, midpoint1);
            vec3.scale(midpoint1, midpoint1, this.radius);

            vec3.add(midpoint2, point2, point3);
            midpoint2 = vec3.fromValues(midpoint2[0]/2, midpoint2[1]/2, midpoint2[2]/2);
            vec3.normalize(midpoint2, midpoint2);
            vec3.scale(midpoint2, midpoint2, this.radius);

            vec3.add(midpoint3, point1, point3);
            midpoint3 = vec3.fromValues(midpoint3[0]/2, midpoint3[1]/2, midpoint3[2]/2);
            vec3.normalize(midpoint3, midpoint3);
            vec3.scale(midpoint3, midpoint3, this.radius);

            this.subDivideCircle(point1, midpoint1, midpoint3, subDiv-1);
            this.subDivideCircle(midpoint1, point2, midpoint2, subDiv-1);
            this.subDivideCircle(midpoint3, midpoint2, point3, subDiv-1);
            this.subDivideCircle(midpoint2, midpoint3, midpoint1, subDiv-1);

        } else {
            this.vertices.push(point1[0], point1[1], point1[2]);
            this.colors.push(this.col1[0], this.col1[1], this.col1[2]);

            this.vertices.push(point2[0], point2[1], point2[2]);
            this.colors.push(this.col1[0], this.col1[1], this.col1[2]);

            this.vertices.push(point3[0], point3[1], point3[2]);
            this.colors.push(this.col1[0], this.col1[1], this.col1[2]);

            this.indLength += 9;
        }
    }


}