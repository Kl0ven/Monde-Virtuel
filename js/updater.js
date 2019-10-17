
function updateLastSeenObject(dt) {
	var o = controls.raycaster()
	if (o ===null) return;
	if (o.object.id == lastObjectSeenID){
		lastObjectSeenTime += dt;
	} else {
		lastObjectSeenID = o.object.id;
		lastObjectSeenTime = 0
		info.style.opacity = 0;
	}

	if (lastObjectSeenTime > focusTimeThreshold && o.object.userData.hasOwnProperty('comment')){
		let info = document.getElementById('info')
		info.innerText = o.object.userData.comment;
		info.style.opacity = 1;
	}

}

function updateCloseByObject() {
	let nearestObjects = getNearestObjects(10);
}


function getNearestObjects(radius){
	const allowedObjectType = ["Mesh"];
	const camPos = controls.getObject().position;
	let meshPos = new THREE.Vector3();
	let meshInRange = [];
	for (var i in annuaire) {
		let mesh = annuaire[i];
		if (allowedObjectType.indexOf(mesh.type) >=0 && mesh.name !== "sol") {
			meshPos = mesh.position.clone()
			meshPos.applyMatrix4(mesh.matrixWorld);
			meshPos.divideScalar(2);
			if (camPos.distanceTo(meshPos) < radius) {
				meshInRange.push({"id": mesh.id, "worldPosition": meshPos});
			}
		}
	}
	return meshInRange
}
