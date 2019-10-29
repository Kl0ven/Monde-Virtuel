class Cell {
	constructor(position, map, debug=false) {
		this.position = position;
		this.debug = debug;
		this.value;
		this.map = map;
		this.wall = false;
		this.empty = true;
	}

	displayCell(){
		this.geometry = new THREE.PlaneGeometry(this.map.cellSize, this.map.cellSize);
		this.material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.FrontSide} );
		this.plane = new THREE.Mesh( this.geometry, this.material );
		this.plane.position.copy(this.to3DVect(0));
		this.plane.rotateX(-Math.PI/2);
		this.updateColor();
		scene.add(this.plane);
	}

	to3DVect(height){
		return new THREE.Vector3(this.position.x, height, this.position.y);
	}

	updateColor(){
		this.material.color.setHSL((1-this.value) * (2/3), 1,0.5);
	}

	setColor(style){
		if (!this.debug) return;
		this.material.color.setStyle(style);
	}

	setWall(isWall){
		this.wall = isWall;
		if (isWall) {
			this.empty = false;
			this.value = 0;
			if (this.debug) {
				this.displayCell();
			}
		}
	}

	setValue(v){
		this.empty = false;
		this.value = v;
		if (this.debug) this.displayCell();
		if (v === 0 && this.wall === false) this.empty = true;
	}

	createBox3(height){
		let box = new THREE.Box3();
		let size = new THREE.Vector3(this.map.cellSize, height, this.map.cellSize);
		box.setFromCenterAndSize(this.to3DVect(height/2),size)
		return box;
	}

	diffPotentiel(cell){
		return this.value - cell.value;
	}
}
