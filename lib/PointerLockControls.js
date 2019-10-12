var PointerLockControls = function ( camera ) {

	var scope = this;
	var PI_2 = Math.PI / 2;

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 1.7;
	yawObject.position.x = -50
	yawObject.rotation.y = -PI_2
	yawObject.name = "PointerLockControls"
	yawObject.add( pitchObject );

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var maxVelocity = .5;
	var isOnObject = false;
	var canJump = false;

	var velocity = new THREE.Vector3();

	var coef = 5
	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;
		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	var mouse     = new THREE.Vector2(0,0) ;
	var raycaster = new THREE.Raycaster() ;
	var mouseClicked = false ;
	var world = null ;
	var origin = new THREE.Vector3() ;
	var ext = new THREE.Vector3() ;
	var objs = []
	function mouseDown(event){
		event.preventDefault() ;
		raycaster.setFromCamera(mouse,camera) ;
		var children = scene.children
		objs = []
		for (var i in children) {
			if (children[i].name === "PointerLockControls") continue
			objs.push(children[i])
		}
		var intersects = raycaster.intersectObjects(objs,true) ;
		if(intersects.length>0){
			pointeur.position.set(intersects[0].point.x,intersects[0].point.y,+intersects[0].point.z) ;
			mouseClicked = true ;
			world  = intersects[0].object.matrixWorld;
			origin = new THREE.Vector3(0,0,0) ;
			ext    = new THREE.Vector3(0,0,2) ;
			origin.applyMatrix4(world) ;
			ext.applyMatrix4(world) ;

		}
	}


	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

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
				if ( canJump === true ) velocity.y += 0.15;
				canJump = false;
				break;

		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

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

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'mousedown', mouseDown, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		canJump = boolean;

	};


	this.lookAt = function (origin){
		let direction = origin.sub(yawObject.position).normalize();
		pitchObject.rotation.x = Math.asin(direction.y);
		yawObject.rotation.y = Math.atan2(direction.x, direction.z) - Math.PI;

	}

	this.update = function ( delta ) {

		if ( scope.enabled === false ) return;

		delta *= 0.1;

		velocity.y -= coef * delta;

		if ( moveForward ) velocity.z -= coef * delta;
		if ( moveBackward ) velocity.z += coef * delta;
		if ( moveLeft ) velocity.x -= coef * delta;
		if ( moveRight ) velocity.x += coef * delta;


		if (!moveLeft && !moveRight) velocity.x += ( - velocity.x ) * coef * 7 * delta;
		if (!moveForward && !moveBackward) velocity.z += ( - velocity.z ) * coef * 7 * delta;


		if ( isOnObject === true ) {

			velocity.y = Math.max( 0, velocity.y );

		}
		if (Math.abs(velocity.x) > maxVelocity) velocity.x = velocity.x > 0 ? maxVelocity : - maxVelocity
		if (Math.abs(velocity.z) > maxVelocity) velocity.z = velocity.z > 0 ? maxVelocity : - maxVelocity
		yawObject.translateX( velocity.x );
		yawObject.translateY( velocity.y );
		yawObject.translateZ( velocity.z );

		if ( yawObject.position.y < 1.7 ) {

			velocity.y = 0;
			yawObject.position.y = 1.7;

			canJump = true;

		}

		if(mouseClicked) {
			yawObject.position.set(ext.x,ext.y,ext.z);

			this.lookAt(new THREE.Vector3(origin.x,origin.y,origin.z))
			mouseClicked = false ;

		}

	};

};
