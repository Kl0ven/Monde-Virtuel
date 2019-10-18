
function updateLastSeenObject(dt) {
	raycaster.setFromCamera(center, camera);
	var o = raycaster.cast()
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
	const camPos = controls.getObject().position;
	// let nearestObjects = getNearestObjects(10, camPos);
	// let obj;
	// let intersect;
	// nearbyObjectsId = [];
	// for (var i in nearestObjects) {
	// 	obj = nearestObjects[i];
	// 	direction.subVectors(obj.worldPosition, camPos).normalize();
	// 	raycaster.set(camPos, direction);
	// 	intersect = raycaster.cast(true);
	// 	if (intersect === null) {
	// 		console.error("Not found");
	// 		continue;
	// 	}
	//
	// 	if (intersect.object.id == obj.id){
	// 		nearbyObjectsId.push(obj.id)
	//
	// 	} else {
	// 		console.log("not inetersect");
	// 	}
	// }
	// displaymanager.updateNames(nearbyObjectsId);
}


function getNearestObjects(radius, camPos){
	const allowedObjectType = ["Mesh"];
	let meshPos = new THREE.Vector3();
	let meshInRange = [];
	for (var i in annuaire) {
		let mesh = annuaire[i];
		if (allowedObjectType.indexOf(mesh.type) >=0 && mesh.name !== "sol") {
			meshPos = mesh.position.clone()
			meshPos.applyMatrix4(mesh.matrixWorld);
			console.log("camera", camPos, mesh.position, meshPos);
			// meshPos.divideScalar(2);
			if (camPos.distanceTo(meshPos) < radius) {
				meshInRange.push({"id": mesh.id, "worldPosition": meshPos});
				pointeur.position.copy(meshPos);
			}
		}
	}
	return meshInRange
}
