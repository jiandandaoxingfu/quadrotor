const pi = Math.PI;

class Quadrotor {
	constructor(mass, Cb, Ct) {
		this.mass = mass;	// kg
		this.gravity = mass * 9.8;
		this.Cb = Cb;
		this.Ct = Ct;
		this.quadrotor = null;
		this.propellers = [];
		this.propellers_rotation_speed = [0, 0, 0, 0];
		this.propeller_max_rotation_speed = 120;
		this.propeller_acceleration = 15;
		this.propellers_buoyant_force = [0, 0, 0, 0];
		this.propellers_torsion_force = [0, 0, 0, 0];
		this.time_stamp = 20; // ms
		this.d = 0.3;
	}

	init() {
		let ground = new THREE.GridHelper(10000, 200, 0x1231c3, 0x135133);
		scene.add(ground);

		// 无人机框架		
		let quadrotor;
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
		quadrotor.position.y += 65;
		quadrotor.add(new THREE.AxisHelper(450));
		scene.add(quadrotor);
		this.quadrotor = quadrotor;
		
		// 四个螺旋桨
		// 螺旋桨中心在无人机框架的位置：(x, z)
		let propeller_pos_arr = [
			[190, 190],
			[190, -190],
			[-190, -190],
			[-190, 190]
		];
		this.propellers = propeller_pos_arr.map( pos => {
			// 螺旋桨旋转轴
			let cylinder = new THREE.Mesh(
					new THREE.CylinderGeometry(2.5, 2.5, 25),
					new THREE.MeshPhongMaterial({color: '#c0c0c0'})		
				)
			cylinder.position.set(pos[0], 45, pos[1]);
			quadrotor.add(cylinder);

			let geom = new THREE.Geometry();
			propeller_vertices.forEach(v => geom.vertices.push(new THREE.Vector3(...v)));
			propeller_faces.forEach(f => geom.faces.push(new THREE.Face3(...f)));
			geom.computeFaceNormals();
			geom.computeVertexNormals();
			let propeller = new THREE.Mesh(
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

		// light
		let r = 10000;
		let vertices = [[0, 0, r], [0, 0, -r], [r, 0, 0], [-r, 0, 0], [0, r, 0], [0, -r, 0]];
		vertices.forEach(v => {
			let pointLight = new THREE.PointLight("white");
			pointLight.distance = 20000;
			pointLight.intensity = 1;
			pointLight.position.set(...v);
			scene.add(pointLight);
		})
	}

	get_force() {
		this.propellers_rotation_speed.forEach( (speed, i) => {
			this.propellers_buoyant_force[i] = this.Cb * Math.pow(speed, 2);
			this.propellers_torsion_force[i] = this.Ct * Math.pow(speed, 2);
		});
	}

	up() {
		// 升空
		this.propellers_rotation_speed.forEach( (rs, i) => {
			rs += this.propeller_acceleration * this.time_stamp / 1000;
			if( rs > this.propeller_max_rotation_speed ) {
				rs = this.propeller_max_rotation_speed;
			}
			this.propellers[i].rotation.y += 2*pi * rs / 500 * (i%2 == 0 ? 1 : -1);
			this.propellers_rotation_speed[i] = rs;
		});
	}

	down() {
		// 降落

	}
}

var quadrotor = new Quadrotor(mass=1, Cb=0.0003, Ct=0.0001);
quadrotor.init();

var controls = new THREE.TrackballControls(camera);
camera.position.set(0, 1000, 8000);

(function animate() {
	controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
})()


setTimeout( () => {
	setInterval( () => {
		quadrotor.up();
	}, quadrotor.time_stamp)
}, 3000);