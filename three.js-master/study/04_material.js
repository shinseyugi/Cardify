import * as THREE from '../build/three.module.js';
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";

class App{
    constructor(){
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias:true});
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
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );
        camera.position.z = 4;
        this._camera = camera;

    }
    _setupLight(){
        const color = 0xffffff;
        const intensity = 5;
        const light = new THREE.DirectionalLight(color,intensity);
        light.position.set(-1,2,5);
        this._scene.add(light);
    }
    _setupModel(){
        const material = new THREE.MeshBasicMaterial({
            color:"white",
            wireframe: true
        });

        const box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), material);
        box.position.set(-1,0,0);
        this._scene.add(box);

        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7,32,32), material);
        sphere.position.set(1,0,0);
        this._scene.add(sphere);
    }
    resize(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height ;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width,height);
    }
    render(time) {
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }
    update(time){
        time *=0.001;
    }
}

window.onload = function(){
    new App();
}