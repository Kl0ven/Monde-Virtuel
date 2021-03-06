class Map {
	constructor(size, nbCell, iter) {
		this.size = size;
		this.nbCell = nbCell;
		this.cellSize = size / nbCell;
		this.cells = [];
		this.iteration = iter;
		this.coefPotentiel = 0.95;
		this.createCell();
		this.UpdateWall();
		this.computeCellValue();
	}


	createCell(){
		for (var x = -this.size/2 + this.cellSize/2; x < this.size/2; x += this.cellSize) {
			let line = [];
			for (var z = -this.size/2 + this.cellSize/2; z < this.size/2; z  += this.cellSize) {
				line.push(new Cell(new THREE.Vector2(x, z), this, debugMap));
			}
			this.cells.push(line);
		}
	}

	UpdateWall(){
		let children = scene.children;
		for (var i in children) {
			let child = children[i];
			if (child.userData.hasOwnProperty('wall') && child.userData.wall){
				let boundingBox = new THREE.Box3();
				boundingBox.setFromObject(child)
				if (debugMap){
					var box = new THREE.Box3Helper( boundingBox, 0xffff00 );
					scene.add( box );
				}
				for (var i = 0; i < this.cells.length; i++) {
					let ligne = this.cells[i];
					for (var j = 0; j < ligne.length; j++) {
						let cell = ligne[j];
						if (boundingBox.intersectsBox(cell.createBox3(1))) {
							cell.setWall(true);
						}
					}
				}

			}
		}
	}

	computeCellValue(){
		let children = this.getPOI()
		let r = this.cellSize;
		let v = 1;
		for (var z = 0; z < this.iteration; z++) {
			for (var i in children) {
				let child = children[i];
				var i = this.getCellAtPos(this.getWatchingPosition(child))
				if (i === null) continue
				let pos = i.to3DVect(0);
				let cells = this.getCircleEmptyCells(r, pos, true);
				for (var c in cells) {
					cells[c].setValue(v)
				}
			}
			r += this.cellSize;
			v *= this.coefPotentiel;
		}
		this.fillemptyCell();
	}


	resetPoiCells(centerCell) {
		let r = this.cellSize;
		let v = 1;
		for (var z = 0; z < this.iteration; z++) {
				let cells = this.getCircleEmptyCells(r,  centerCell.to3DVect(0), false);
				for (var c in cells) {
					if (cells[c].value <= v) {
						cells[c].setValue(0);
						cells[c].setColor('violet')
					}
					else {
						cells[c].setColor('#F0F8FF')
					}

				}
			r += this.cellSize;
			v *= this.coefPotentiel;
		}


	}

	fillemptyCell(){
		for (var i = 0; i < this.cells.length; i++) {
			let ligne = this.cells[i];
			for (var j = 0; j < ligne.length; j++) {
				let cell = ligne[j];
				if (cell.empty) {
					cell.setValue(0);
				}
			}
		}
	}
	getWatchingPosition(obj){
		let world = obj.matrixWorld;
		let ext = new THREE.Vector3(0, 0, 2);
		ext.applyMatrix4(world);
		return ext;
	}

	getCircleEmptyCells(r, poi_pos, empty){
		let cells = []
		for (var i = 0; i < this.cells.length; i++) {
			let ligne = this.cells[i];
			for (var j = 0; j < ligne.length; j++) {
				let cell = ligne[j];
				if ((empty ? cell.empty : !cell.empty) && this.isCellInCircle(cell.position, poi_pos, r)){
					cells.push(cell);
				}
			}

		}
		return cells;
	}

	isCellInCircle(cellCenter, circleCenter, r) {
		let a = cellCenter.x;
		let b = cellCenter.y;
		let x = circleCenter.x;
		let y = circleCenter.z
		var dist_points = (a - x) * (a - x) + (b - y) * (b - y);
		r *= r;
		if (dist_points < r) {
			return true;
		}
		return false;
	}

	getPOI(obj){
		let poi = []
		scene.traverse( function( node ) {
			if ( node instanceof THREE.Mesh && node.userData.hasOwnProperty("poi") && node.userData.poi) {
				poi.push(node)
			}
		} );
		return poi
	}

	getCamCellPos(){
		let camPos = new THREE.Vector3();
		camera.getWorldPosition(camPos);
		let x =  Math.floor(camPos.x / this.cellSize) + this.nbCell/2;
		let z = Math.floor(camPos.z / this.cellSize) + this.nbCell/2;
		if (x < 0 || x > this.nbCell-1 || z < 0 || z > this.nbCell-1 ){
			return [null];
		}
		return [x, z];
	}

	getCellAtPos(pos){
		let x =  Math.floor(pos.x / this.cellSize) + this.nbCell/2;
		let z = Math.floor(pos.z / this.cellSize) + this.nbCell/2;
		if (x < 0 || x > this.nbCell-1 || z < 0 || z > this.nbCell-1 ){
			return null;
		}
		return this.getCellAtIndex(x,z);
	}

	getCellAtIndex(x,y){
		return this.cells[x][y];
	}

	getNextCell(){
		let [x, z] = this.getCamCellPos()
		if (x == null){
			return [null, false];
		}
		let camCell = this.cells[x][z];
		if (camCell.value === 1) return [camCell, true];
		let max = 0;
		let maximisingCell = null;
		for (var i = x-1; i <= x+1; i++) {
			for (var j = z-1; j <= z+1; j++) {
				if (i == x && j == z) continue;
				if (i < 0 || i > this.nbCell-1 || j < 0 || j > this.nbCell-1) continue;
				let cell = this.cells[i][j]

				if  (cell.diffPotentiel(camCell) > max){
					max = cell.diffPotentiel(camCell);
					maximisingCell = cell;
				}
			}
		}
		return [maximisingCell, false];
	}
}
