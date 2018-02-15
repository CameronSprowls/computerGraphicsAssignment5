/**
 * Created by Hans Dulimarta.
 */

class Object3D {
  constructor(gl) {
    this.vertexBuff = gl.createBuffer();
    this.colorBuff = null;
    /* primitives is an array of objects with the following fields:
        type:        gl.POINTS, gl.LINES, ....
        numElements: size of the index array for drawElements
        buffer:      buffer of type gl.ELEMENT_ARRAY_BUFFER

       Each object in this array is used by gl.drawElements()
     */
    this.primitives = [];
    this.coordFrame = mat4.create();
  }

  static linkShaderAttrib (attribs) {
    for (let k in attribs)
      Object3D[k] = attribs[k];
  }

  static linkShaderUniform(unis) {
    for (let k in unis)
      Object3D[k] = unis[k];
  }

  draw (gl) {
    gl.uniformMatrix4fv(Object3D.model,
        false, /* matrix is NOT transposed */
        this.coordFrame);

    /* select the vertex buffer */
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuff);
    gl.vertexAttribPointer(Object3D.positionAttr, 3, gl.FLOAT, false, 0, 0);
    /* select the color buffer if it is defined */
    if (this.colorBuff != null) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuff);
      gl.vertexAttribPointer(Object3D.colorAttr, 3, gl.FLOAT, false, 0, 0);
    }

    for (let k = 0; k < this.primitives.length; k++) {
      let obj = this.primitives[k];

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.buffer);
      gl.drawElements(obj.type, obj.numPoints, gl.UNSIGNED_SHORT, 0);


    }
  }
}
