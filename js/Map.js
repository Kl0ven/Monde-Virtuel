class Map {
	constructor(size, nbCell, debug=false) {
		this.size = size;
		this.nbCell = nbCell;
		this.cellSize = size / nbCell;
		this.debug = debug;
		this.cells = [];
		this.createCell();
		this.UpdateWall();
		this.computeCellValue();
	}


	createCell(){
		for (var x = -this.size/2 + this.cellSize/2; x < this.size/2; x += this.cellSize) {
			let line = [];
			for (var z = -this.size/2 + this.cellSize/2; z < this.size/2; z  += this.cellSize) {
				line.push(new Cell(new THREE.Vector2(x, z), this, this.debug));
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
				if (this.debug){
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
		console.log(children);
		// for (var i in children) {
		// 	let child = children[i];
		// 	console.log(child);
		// 	if (child.userData.hasOwnProperty('poi') && child.userData.poi){
		// 		console.log(child);
		// 		// for (var i = 0; i < this.cells.length; i++) {
		// 		// 	let ligne = this.cells[i];
		// 		// 	for (var j = 0; j < ligne.length; j++) {
		// 		// 		let cell = ligne[j];
		// 		// 		if (boundingBox.intersectsBox(cell.createBox3(1))) {
		// 		// 			cell.setWall(true);
		// 		// 		}
		// 		// 	}
		// 		// }
		//
		// 	}
		// }
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
}
