var DisplayManager = function () {
	var currentId = [];
	var container = document.getElementById('nearbyObjects');

	this.updateNames = function (newId) {
		let n;
		let actualId = [];
		let createdId = [];
		for (var i in newId) {
			n = newId[i];
			actualId.push(n);
			if (currentId.indexOf(n) < 0){
				// nouvelle entée
				createdId.push(n);
				this.addElement(n);
			}
		}
		let diff = this.arr_diff(currentId, actualId);
		let toDelete = this.arr_diff(diff, createdId);

		for (var i in toDelete) {
			this.deleteElement(toDelete[i]);
		}
		currentId = actualId;
	}


	this.addElement = function(n){
		let obj = scene.getObjectById(n);
		if (obj.userData.hasOwnProperty("properName")){
			let div = document.createElement("div");
			div.setAttribute("id", "name" + n);
			div.append(obj.userData.properName);
			container.append(div);
		}
	}

	this.deleteElement = function(n){
		document.getElementById('name' + n).remove()
	}

	this.arr_diff = function (a1, a2) {

		var a = [], diff = [];

		for (var i = 0; i < a1.length; i++) {
			a[a1[i]] = true;
		}

		for (var i = 0; i < a2.length; i++) {
			if (a[a2[i]]) {
				delete a[a2[i]];
			} else {
				a[a2[i]] = true;
			}
		}
		for (var k in a) {
			diff.push(parseInt(k));
		}

		return diff;
	}

}
