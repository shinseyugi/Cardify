import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";

class App {
	constructor() {
		const divContainer = document.querySelector("#webgl-container");
		this._divContainer = divContainer;

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		divContainer.appendChild(renderer.domElement);
		this._renderer = renderer;

		const scene = new THREE.Scene();
		this._scene = scene;

		this._setupCamera();
		this._setupLight();
		this._setupModel();
		this._setupControls();

		window.onresize = this.resize.bind(this);
		this.resize();

		requestAnimationFrame(this.render.bind(this));
	}
	_setupControls() {
		new OrbitControls(this._camera, this._divContainer);
	}
	_setupCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.z = 15;
		this._camera = camera;
	}
	_setupLight() {
		const color = 0xffffff;
		const intensity = 5;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-4, 1, 8);
		this._scene.add(light);
	}
	_setupModel() {
		const shape = new THREE.Shape();

        const x=-2.5, y=-5;
        shape.moveTo(x+2.5, y+2.5);
        shape.bezierCurveTo(x+2.5,y+2.5,x+2,y,x,y);
        shape.bezierCurveTo(x-3,y,5,x-3,y+3.5,x-3,y+3.5);
        shape.bezierCurveTo(x-3,y+5.5,x-1.5,y+7.7,x+2.5,y+9.5);
        shape.bezierCurveTo(x+6,y+7.7,x+8,y+4.5,x+8,y+3.5);
        shape.bezierCurveTo(x+8,y+3.5,x+8,y,x+5,y);
        shape.bezierCurveTo(x+3.5,y,x+2.5,y+2.5,x+2.5,y+2.5);

        const geometry = new THREE.ShapeGeometry(shape);

		const fillmaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
		const cube = new THREE.Mesh(geometry, fillmaterial);

		const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
		const line = new THREE.LineSegments(
			new THREE.WireframeGeometry(geometry),
			lineMaterial
		);
		const group = new THREE.Group();
		group.add(cube);
		group.add(line);

		this._scene.add(group);
		this._cube = group;
	}

	resize() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(width, height);
	}
	render(time) {
		this._renderer.render(this._scene, this._camera);
		this.update(time);
		requestAnimationFrame(this.render.bind(this));
	}
	update(time) {
		time *= 0.001;
		// this._cube.rotation.x = time;
		//this._cube.rotation.y = time;
	}
}

window.onload = function () {
	new App();
};
