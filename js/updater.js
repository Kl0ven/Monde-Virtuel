
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
	let camPos = new THREE.Vector3();
	camera.getWorldPosition(camPos);
	let nearestObjects = getNearestObjects(20, camPos);
	let obj;
	let intersect;
	nearbyObjectsId = [];
	for (var i in nearestObjects) {
		obj = nearestObjects[i];
		direction.subVectors(obj.worldPosition, camPos).normalize();
		raycaster.set(camPos, direction);
		intersect = raycaster.cast();
		if (intersect === null) {
			continue;
		}
		if (intersect.object.id == obj.id){
			nearbyObjectsId.push(obj.id)
		}
	}
	displaymanager.updateNames(nearbyObjectsId);
}


function getNearestObjects(radius, camPos){
	const allowedObjectType = ["Mesh"];
	let meshPos = new THREE.Vector3();
	let meshInRange = [];
	for (var i in annuaire) {
		let mesh = annuaire[i];
		if (allowedObjectType.indexOf(mesh.type) >=0 && mesh.name !== "sol") {
			mesh.getWorldPosition(meshPos);
			if (camPos.distanceTo(meshPos) < radius) {
				meshInRange.push({"id": mesh.id, "worldPosition": meshPos.clone()});
			}
		}
	}
	return meshInRange
}


function updateCellValue(dt){
	if (map === undefined) return;
	let [x, z] = map.getCamCellPos();
	if (x == null) return;
	let camCell = map.getCellAtIndex(x,z);

	if (camCell == lastCellIn){
		lastCellInTime += dt;
	} else {
		lastCellIn = camCell;
		lastCellInTime = 0
	}

	if (lastCellInTime > cellTimeThreshold && camCell.value == 1){
		map.resetPoiCells(camCell);
	}

}
