var Raycaster = function () {

	THREE.Raycaster.apply(this,arguments);

	var direction;
	var origin;
	var distance = 100;
	var endPoint = new THREE.Vector3();
	var line

	this.set = function (origin, direction){
		this.direction = direction;
		this.origin	= origin;
		THREE.Raycaster.prototype.set.call(this, origin, direction)
	}
	this.cast = function (debug = false){
		if (debug) {
			this.drawLine()
		}
		var objs = [];
		var ret = null;
		var children = scene.children;
		for (var i in children) {
			if (children[i].name === 'PointerLockControls') continue;
			objs.push(children[i]);
		}
		var result = raycaster.intersectObjects(objs, true);
		if (result.length > 0) {
			ret = result[0];
		}
		return ret;
	}

	this.drawLine = function (){
		// scene.remove(line);
		endPoint.addVectors ( this.origin, this.direction.multiplyScalar( distance ) );
		var geometry = new THREE.Geometry();
		geometry.vertices.push( this.origin );
		geometry.vertices.push( endPoint );
		var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
		line = new THREE.Line( geometry, material );
		// console.log(line);
		scene.add( line );
	}

}


Raycaster.prototype = Object.create(THREE.Raycaster.prototype);
Raycaster.prototype.constructor = Raycaster;