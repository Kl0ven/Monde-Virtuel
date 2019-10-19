class Cell {
	constructor(position, map, debug=false) {
		this.position = position;
		this.debug = debug;
		this.value = Math.random();
		this.map = map;
		if (debug) this.displayCell();
	}

	displayCell(){
		var geometry = new THREE.PlaneGeometry(this.map.cellSize, this.map.cellSize);
		var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.FrontSide} );
		var plane = new THREE.Mesh( geometry, material );
		plane.position.copy(this.to3DVect(0));
		plane.rotateX(-Math.PI/2);
		material.color.setHSL(this.value, 1,0.5);
		scene.add( plane );
	}

	to3DVect(height){
		return new THREE.Vector3(this.position.x, height, this.position.y)
	}
}
