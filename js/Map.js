class Map {
  constructor(size, nbCell, debug=false) {
    this.size = size;
	this.nbCell = nbCell;
	this.cellSize = size / nbCell;
	this.debug = debug;
	this.cells = [];
	this.createCell();
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
}
