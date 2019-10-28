/* global THREE, scene, pointeur */
/* exported PointerLockControls, test */

var PointerLockControls = function (camera) {
	var scope = this;
	var PI_2 = Math.PI / 2;

	var pitchObject = new THREE.Object3D();
	pitchObject.add(camera);

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 1.7;
	yawObject.position.x = -50;
	yawObject.rotation.y = -PI_2;
	yawObject.name = 'PointerLockControls';
	yawObject.add(pitchObject);

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var maxVelocity = 0.5;
	var isOnObject = false;
	var canJump = false;

	var velocity = new THREE.Vector3();

	var coef = 5;

	var mouseClicked = false;
	var world = null;
	var origin = new THREE.Vector3();
	var ext = new THREE.Vector3();
	var nextCellDir = new THREE.Vector3();
	var totalVelocity = new THREE.Vector3();
	var isSpotOn = false;

	var onMouseMove = function (event) {
		if (scope.enabled === false) return;
		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
	};

	function mouseDown (event) {
		if (scope.enabled === false) return;
		event.preventDefault();
		raycaster.setFromCamera(center, camera);
		let obj = raycaster.cast();
		console.log(obj);
		if (obj !== null) {
			pointeur.position.set(obj.point.x, obj.point.y, +obj.point.z);
			mouseClicked = true;
			world = obj.object.matrixWorld;
			origin = new THREE.Vector3(0, 0, 0);
			ext = new THREE.Vector3(0, 0, 2);
			origin.applyMatrix4(world);
			ext.applyMatrix4(world);
		}
	}

	var onKeyDown = function (event) {
		switch (event.keyCode) {
			case 38: // up
			case 90: // w
			moveForward = true;
			break;

			case 37: // left
			case 81: // a
			moveLeft = true; break;

			case 40: // down
			case 83: // s
			moveBackward = true;
			break;

			case 39: // right
			case 68: // d
			moveRight = true;
			break;

			case 32: // space
			if (canJump === true) velocity.y += 0.15;
			canJump = false;
			break;
		}
	};

	var onKeyUp = function (event) {
		switch (event.keyCode) {
			case 38: // up
			case 90: // w
			moveForward = false;
			break;

			case 37: // left
			case 81: // a
			moveLeft = false;
			break;

			case 40: // down
			case 83: // a
			moveBackward = false;
			break;

			case 39: // right
			case 68: // d
			moveRight = false;
			break;
		}
	};

	document.addEventListener('mousemove', onMouseMove, false);
	document.addEventListener('mousedown', mouseDown, false);
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);

	this.enabled = false;

	this.getObject = function () {
		return yawObject;
	};

	this.isOnObject = function (boolean) {
		isOnObject = boolean;
		canJump = boolean;
	};

	this.lookAt = function (origin) {
		let direction = origin.sub(yawObject.position).normalize();
		pitchObject.rotation.x = Math.asin(direction.y);
		yawObject.rotation.y = Math.atan2(direction.x, direction.z) - Math.PI;
	};

	this.getNearestPoiDirection = function(){
		let [nextCell, spotOn] =  map.getNextCell();
		if (nextCell == null) return new THREE.Vector3();
		if (spotOn){
			if (!isSpotOn){
				yawObject.position.copy(nextCell.to3DVect(yawObject.position.y));
				isSpotOn = true;
			}
			return new THREE.Vector3();
		}
		isSpotOn = false;
		let cellPosition = nextCell.to3DVect(yawObject.position.y);
		nextCellDir.subVectors(cellPosition, yawObject.position).normalize();
		return nextCellDir;
	}
	this.displayArrow = function (dir,color){
		let origin = new THREE.Vector3();
		origin.copy(yawObject.position);
		origin.y = 1;


		var arrowHelper = new THREE.ArrowHelper( dir, origin, 3, color );
		scene.add( arrowHelper );
	}


	this.update = function (delta) {
		if (scope.enabled === false) return;

		delta *= 0.1;

		velocity.y -= coef * delta;

		if (moveForward) velocity.z -= coef * delta;
		if (moveBackward) velocity.z += coef * delta;
		if (moveLeft) velocity.x -= coef * delta;
		if (moveRight) velocity.x += coef * delta;

		if (!moveLeft && !moveRight) velocity.x += (-velocity.x) * coef * 7 * delta;
		if (!moveForward && !moveBackward) velocity.z += (-velocity.z) * coef * 7 * delta;

		if (isOnObject === true) {
			velocity.y = Math.max(0, velocity.y);
		}

		velocity.clampScalar(-maxVelocity, maxVelocity);

		let poiDir = this.getNearestPoiDirection();
		poiDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), -yawObject.rotation.y)
		poiDir.multiplyScalar(maxVelocity * (-(2/3) * velocity.length() +0.5));

		totalVelocity.addVectors(velocity, poiDir);

		if (debug) {
			this.displayArrow(poiDir, 0xff0000 );
			this.displayArrow(velocity.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), yawObject.rotation.y), 0x00ff00 );
			this.displayArrow(totalVelocity, 0x00ffff);
		}

		yawObject.translateX(totalVelocity.x);
		yawObject.translateY(totalVelocity.y);
		yawObject.translateZ(totalVelocity.z);

		if (yawObject.position.y < 1.7) {
			velocity.y = 0;
			yawObject.position.y = 1.7;
			canJump = true;
		}

		if (mouseClicked) {
			yawObject.position.set(ext.x, ext.y, ext.z);
			this.lookAt(new THREE.Vector3(origin.x, origin.y, origin.z));
			mouseClicked = false;
		}
	};
};
