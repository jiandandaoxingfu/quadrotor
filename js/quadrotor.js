const pi = Math.PI;

class Quadrotor {
	constructor() {
		this.quadrotor = null;
		this.propellers = [];
		this.propellers_rotation_speed = [120, 120, 120, 120];
		this.key_valid = !0; 
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
		quadrotor.position.y += 265;
		// quadrotor.add(new THREE.AxisHelper(450));
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

	controller(keycode) {// [translate_axis, direction, rotation_axis, direction]
		if( !this.key_valid ) return;
		this.key_valid = !1;
		let map = {'后': ['z', -1, 'x', -1], '前': ['z', 1, 'x', 1], 
				   '左': ['x', -1, 'z', 1], '右': ['x', 1, 'z', -1],
				   'up': ['y', 1, 'y', 0], 'down': ['y', -1, 'y', 0]
			};
		TWEEN.removeAll();
		this.quadrotor.rotation.set(0, 0, 0);

		let translate_axis = map[keycode][0];
		let translate = {x: 0, y: 0, z: 0};
		translate[translate_axis] = 800 * map[keycode][1];

		let rotation_axis = map[keycode][2];
		let angle = {x: 0, y: 0, z: 0};
		angle[rotation_axis] = pi/4 * map[keycode][3];

		this.rotation(angle, 500);
		this.move(translate, 2000);
		setTimeout( () => {
			angle[rotation_axis] = -pi/4 * map[keycode][3];
			translate[translate_axis] = 200 * map[keycode][1];
			this.move(translate, 500);
			this.rotation(angle, 500);
		}, 2000);
	}

	move(translate, time_stamp) {
		// 前后，左右，上下
		let position_ = {x: this.quadrotor.position.x, y: this.quadrotor.position.y, z: this.quadrotor.position.z};
		let position = {x: position_.x + translate.x, y: position_.y + translate.y, z: position_.z + translate.z};
		let tween = new TWEEN.Tween(position_)
    		.to(position, time_stamp)
    		.easing(TWEEN.Easing.Linear.None)
    		.onUpdate(() => {
    			this.quadrotor.position.set(position_.x, position_.y, position_.z);
    			if( JSON.stringify(position_) == JSON.stringify(position) ) this.key_valid = !0;    			
    		})
    		.start();
	}

	rotation(angle, time_stamp) {
		// 翻转，俯仰，偏航
		let rotation_  = {x: this.quadrotor.rotation.x, y: this.quadrotor.rotation.y, z: this.quadrotor.rotation.z};
		let rotation = {x: rotation_.x + angle.x, y: rotation_.y + angle.y, z: rotation_.z + angle.z};
		let tween = new TWEEN.Tween(rotation_)
    		.to(rotation, time_stamp)
    		.easing(TWEEN.Easing.Linear.None)
    		.onUpdate(() => {
    			this.quadrotor.rotation.set(rotation_.x, rotation_.y, rotation_.z);
    		})
    		.start();
	}

	propeller_start() {
		this.propellers.forEach( (p, i) => {
			let rs  = {rs: 0}
			let tween = new TWEEN.Tween(rs)
    			.to({rs: 120}, 300)
    			.easing(TWEEN.Easing.Linear.None)
    			.onUpdate(() => {
    				this.propellers_rotation_speed[i] = rs.rs;
    			})
    			.start();
    	})
	}
}

var quadrotor = new Quadrotor();
quadrotor.init();

var controls = new THREE.TrackballControls(camera);
camera.position.set(0, 1000, 8000);
// camera.position.set(0, 200, 1000);
var clock = new THREE.Clock();

(function animate() {
	requestAnimationFrame(animate);
	controls.update();
    renderer.render(scene, camera);
    var delta = clock.getDelta();
    quadrotor.propellers.forEach( (p, i) => {
    	p.rotation.y += delta * quadrotor.propellers_rotation_speed[i] / 4;
    })
    TWEEN.update();
})();

quadrotor.propeller_start();

document.addEventListener('keydown', e => {
	let keycode = get_keycode(e);
	if( keycode == '' ) return;
	quadrotor.controller(keycode);
})