var quadrotor;
// 无人机框架
(function() {
	let geom = new THREE.Geometry();
	quadrotor_frame_vertices.forEach(v => geom.vertices.push(new THREE.Vector3(...v)));
	quadrotor_frame_faces.forEach(f => geom.faces.push(new THREE.Face3(...f)));
	geom.computeFaceNormals();
	geom.computeVertexNormals();
	quadrotor = new THREE.Mesh(
		geom, 
		new THREE.MeshPhongMaterial({color: '#c0c0c0', wireframe: !1})
	);
	quadrotor.geometry.center();
	quadrotor.add(new THREE.AxisHelper(450));
	scene.add(quadrotor);
})();

const pi = Math.PI, sin = Math.sin, cos = Math.cos;

(function() {
	let r = 920;
	let vertices = [[0, 0, r], [0, 0, -r], [r, 0, 0], [-r, 0, 0], [0, r, 0], [0, -r, 0]];
	vertices.forEach(v => {
		let pointLight = new THREE.PointLight("white");
		pointLight.distance = 2000;
		pointLight.intensity = 1;
		pointLight.position.set(...v);
		scene.add(pointLight);		

		let sphereLight = new THREE.Mesh(
			new THREE.SphereGeometry(3),
			new THREE.MeshBasicMaterial({color: 'white'})
		)
		sphereLight.position.set(...v);
		// scene.add(sphereLight);
	})
})();

// 螺旋桨中心在无人机框架的位置。
var propeller_pos_arr = [
	[190, 190],
	[190, -190],
	[-190, -190],
	[-190, 190]
]
var propellers = propeller_pos_arr.map( pos => {
	// 螺旋桨旋转轴
	var cylinder = new THREE.Mesh(
			new THREE.CylinderGeometry(2.5, 2.5, 25),
			new THREE.MeshPhongMaterial({color: '#c0c0c0'})		
		)
	cylinder.position.set(pos[0], 45, pos[1]);
	quadrotor.add(cylinder);

	// 螺旋桨
	let geom = new THREE.Geometry();
	propeller_vertices.forEach(v => geom.vertices.push(new THREE.Vector3(...v)));
	propeller_faces.forEach(f => geom.faces.push(new THREE.Face3(...f)));
	geom.computeFaceNormals();
	geom.computeVertexNormals();
	propeller = new THREE.Mesh(
		geom, 
		new THREE.MeshPhongMaterial({color: '#c0c0c0', wireframe: !1})
	);
	propeller.geometry.center();
	propeller.position.set(pos[0], 50, pos[1]);
	propeller.scale.set(0.7, 0.7, 0.7);
	// propeller.add( new THREE.AxisHelper(150) );
	quadrotor.add(propeller);
	return propeller;
})

camera.position.set(0, 600, 1200);

var controls = new THREE.TrackballControls(camera);

(function animate() {
	controls.update();
	quadrotor.rotation.x += 0.1/8;
	quadrotor.rotation.y += 0.1/8;
	quadrotor.rotation.z += 0.1/8;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
})();	

setInterval( () => {
	propellers.forEach(p => p.rotation.y += 2*Math.PI*200/33 );
}, 30)