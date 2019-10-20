var dt;
var chrono = null;
var annuaire = null;
var scene = null;
var renderer = null;
var camera = null;

var listener = null;
var sound = null;
var sound1 = null;

var controls = null;
var windowHalfX = window.innerWidth / 2.0;
var windowHalfY = window.innerHeight / 2.0;

var pointeur;
var isPointerLocked = false
var center = new THREE.Vector2(0, 0);
var ray = null
var data;

var lastObjectSeenID;
var lastObjectSeenTime;
var focusTimeThreshold = 2

var direction = new THREE.Vector3();
var raycaster = new Raycaster();
var displaymanager;
var map;


function init(){
	modeFPS()
	displaymanager = new DisplayManager();
	chrono = new THREE.Clock();

	annuaire = {};

	renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	scene = new THREE.Scene();
	scene.name = "scene"
	enregistrerDansAnnuaire("scene",scene);

	camera = new THREE.PerspectiveCamera(70.0, window.innerWidth/window.innerHeight, 0.1, 100.0);
	camera.position.set(0,0,0);
	camera.lookAt(new THREE.Vector3(0.0,0,0.0));


	listener = new THREE.AudioListener();
	camera.add(listener);

	add_crosshair();

	window.addEventListener('resize', function(){
		windowHalfX = window.innerWidth  / 2.0;
		windowHalfY = window.innerHeight / 2.0;
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth , window.innerHeight);

	});


	controls = new PointerLockControls(camera);
	scene.add( controls.getObject() );

	chrono.start();
	// window.setInterval(updateCloseByObject,1000);
};

function enregistrerDansAnnuaire(nom,objet){
	annuaire[nom] = objet;
}

function chercherDansAnnuaire(nom,defaut){
	return (annuaire[nom] || defaut);
}


function creerScene(){

	//scene.add(creerSoleil());
	pointeur = creerSphere("pointeur",0.05,16,materiauRouge);
	pointeur.position.y = 15;
	scene.add(pointeur);

	// parser();
	chargerDocument(() => {
		// create map and cells
		// set last param for debug
		map = new Map(100,50, true);
	});

}


function animate(){

	dt = chrono.getDelta();
	requestAnimationFrame(animate);
	updateLastSeenObject(dt)
	updateCloseByObject();
	controls.update(dt);
	renderer.render(scene, camera);
}
