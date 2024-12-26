// Importing necessary module
import { OrbitControls } from "./examples/jsm/controls/OrbitControls.js";

class App {
    constructor(layout = "default") {
        const divContainer = document.querySelector("#webgl-container");
        divContainer.style.width = "80vw"; // Set container width to 80% of the viewport
        divContainer.style.height = "80vh"; // Set container height to 80% of the viewport
        this._divContainer = divContainer;
        this._layout = layout;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x2E4053); // 배경을 흰색으로 설정
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupTexture(); // 텍스처 초기화
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
        camera.position.z = 2;
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 5;
        const light = new THREE.DirectionalLight(color, intensity);
        const light2 = new THREE.DirectionalLight(color, intensity);
        const light3 = new THREE.DirectionalLight(color, intensity);
        const light4 = new THREE.DirectionalLight(color, intensity);
        light.position.set(1, -4, 0);
        light2.position.set(-4, 1, 0);
        light3.position.set(4, 1, 0);
        light4.position.set(1, 4, 0);
        this._scene.add(light);
        this._scene.add(light2);
        this._scene.add(light3);
        this._scene.add(light4);
    }

    _setupTexture() {
        console.log("Setting up textures...");

        this._frontCanvas = document.createElement('canvas');
        this._frontContext = this._frontCanvas.getContext('2d');
        this._frontCanvas.width = 2048;
        this._frontCanvas.height = 1024;

        this._backCanvas = document.createElement('canvas');
        this._backContext = this._backCanvas.getContext('2d');
        this._backCanvas.width = 2048;
        this._backCanvas.height = 1024;

        // Apply layout-specific designs
        this._applyLayout(this._layout);

        this._frontTexture = new THREE.CanvasTexture(this._frontCanvas);
        this._backTexture = new THREE.CanvasTexture(this._backCanvas);

        const materials = [
            new THREE.MeshStandardMaterial({ color: 0xB8860B, metalness: 0.8, roughness: 0.2 }), // 금색 옆면 + 광택 효과
            new THREE.MeshStandardMaterial({ color: 0xB8860B, metalness: 0.8, roughness: 0.2 }),
            new THREE.MeshStandardMaterial({ color: 0xB8860B, metalness: 0.8, roughness: 0.2 }),
            new THREE.MeshStandardMaterial({ color: 0xB8860B, metalness: 0.8, roughness: 0.2 }),
            new THREE.MeshBasicMaterial({ map: this._frontTexture }),
            new THREE.MeshBasicMaterial({ map: this._backTexture })
        ];

        const card = new THREE.Mesh(
            new THREE.BoxGeometry(2.0, 1.0, 0.01),
            materials
        );

                // Adding gold border line effect to the front and back faces
                const edgesGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.0, 1.0, 0.01));
                const goldLineMaterial = new THREE.LineBasicMaterial({ color: 0xB8860B, linewidth: 10 });
                const goldEdges = new THREE.LineSegments(edgesGeometry, goldLineMaterial);
                card.add(goldEdges);

        this._scene.add(card);
    }

    _applyLayout(layout) {
        this._frontContext.fillStyle = 'white';
        this._frontContext.fillRect(0, 0, this._frontCanvas.width, this._frontCanvas.height);

        if (layout === "student") {
            const logoImage = new Image();
            logoImage.src = './Lion.png'; // 로고 이미지 경로
            logoImage.onload = () => {
                const size = Math.min(this._backCanvas.width, this._backCanvas.height) / 2;
                const x = (this._backCanvas.width - size) / 2;
                const y = (this._backCanvas.height - size) / 2 - 50;
                this._backContext.drawImage(logoImage, x, y, size, size);
                this._backTexture.needsUpdate = true;
                this._backContext.fillStyle = 'black';
                this._backContext.font = '60px Hurricane';
                this._backContext.textAlign = 'center';
                this._backContext.textBaseline = 'middle';
                this._backContext.fillText('joong dong high school', this._frontCanvas.width / 2, this._frontCanvas.height / 2 + 350);
            };
        } else {
            this._frontContext.fillStyle = 'black';
            this._frontContext.font = '100px Pretendard-Regular';
            this._frontContext.textAlign = 'center';
            this._frontContext.textBaseline = 'middle';
            this._frontContext.fillText('Default Name', this._frontCanvas.width / 2, this._frontCanvas.height / 2 - 100);
            this._frontContext.fillText('Contact Info', this._frontCanvas.width / 2, this._frontCanvas.height / 2);
        }

        this._backContext.fillStyle = 'white';
        this._backContext.fillRect(0, 0, this._backCanvas.width, this._backCanvas.height);
        this._backContext.fillStyle = 'black';
        this._backContext.font = '100px Pretendard-Regular';
        this._backContext.textAlign = 'center';
        this._backContext.textBaseline = 'middle';
        if (layout !== "student") {
            this._backContext.fillText('Back Side Content', this._backCanvas.width / 2, this._backCanvas.height / 2);
        }
    }

    _updateTexture(inputValues) {
        this._frontContext.clearRect(0, 0, this._frontCanvas.width, this._frontCanvas.height);
        this._frontContext.fillStyle = 'white';
        this._frontContext.fillRect(0, 0, this._frontCanvas.width, this._frontCanvas.height);

        if (this._layout === "student") {
            // Add background image with transparency only for student layout
            const backgroundImage = new Image();
            backgroundImage.src = './Magnolia.png';
            backgroundImage.onload = () => {
                const size = Math.min(this._frontCanvas.width, this._frontCanvas.height) * 0.8;
                const x = (this._frontCanvas.width - size) / 2-580;
                const y = (this._frontCanvas.height - size) / 2;
                this._frontContext.drawImage(backgroundImage, x+110, y+120, size*0.8, size*2/3);
                this._frontContext.globalAlpha = 1.0;
                this._frontTexture.needsUpdate = true;
                // Draw text and other content after background image
                this._frontContext.fillStyle = 'black';
                this._frontContext.font = 'bold 100px Pretendard-Regular';
                this._frontContext.textAlign = 'left';
                this._frontContext.textBaseline = 'middle';

                // Add a decorative line to separate the logo and text
                this._frontContext.strokeStyle = '0x000000';
                this._frontContext.lineWidth = 8;
                this._frontContext.beginPath();
                this._frontContext.moveTo(900, 200); // Line starts
                this._frontContext.lineTo(900, this._frontCanvas.height -200); // Line ends
                this._frontContext.stroke();
                
                // Middle section
                this._frontContext.font = 'Bold 80px Pretendard-Regular';
                this._frontContext.fillText(`${inputValues.name || '이름'}`, this._frontCanvas.width / 2-35, 300);
                
                // Bottom section
                this._frontContext.font = '60px Pretendard-Regular';
                this._frontContext.fillText(`class ${inputValues.class || '반'}`, this._frontCanvas.width / 2 - 50, 450);
                this._frontContext.fillText(`${inputValues.generation || '기수'}th`, this._frontCanvas.width / 2 - 50, 600);
                this._frontContext.fillText(`${inputValues.club || '동아리'} `, this._frontCanvas.width / 2 - 50, 750);
            };
        }  else if (this._layout === "influencer") {
            this._frontContext.fillText(`이름: ${inputValues.name || '이름'}`, this._frontCanvas.width / 2, 300);
            this._frontContext.fillText(`SNS: ${inputValues.sns || 'SNS'}`, this._frontCanvas.width / 2, 500);
            this._frontContext.fillText(`팔로워: ${inputValues.followers || '팔로워 수'}`, this._frontCanvas.width / 2, 700);
            this._frontContext.fillText(`콘텐츠: ${inputValues.content || '콘텐츠'}`, this._frontCanvas.width / 2, 900);
        }

        this._frontTexture.needsUpdate = true;
    }

    resize() {
        const width = window.innerWidth * 0.8;
        const height = window.innerHeight * 0.8;

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
    }
}

window.onload = function () {
    const homeContainer = document.getElementById('home-container');
    const formContainer = document.getElementById('form-container');
    const webglContainer = document.getElementById('webgl-container');

    homeContainer.style.display = 'block';
    formContainer.style.display = 'none';
    webglContainer.style.display = 'none';

    let currentLayout = null;
    let app = null;

    const renderFormFields = (layout) => {
        const formFields = document.getElementById('form-fields');
        formFields.innerHTML = ''; // Clear existing fields

        if (layout === 'student') {
            formFields.innerHTML = `
                <label for="name">이름:</label>
                <input id="name" type="text" placeholder="이름" required />

                <label for="class">반:</label>
                <input id="class" type="number" placeholder="반" required />

                <label for="generation">기수:</label>
                <input id="generation" type="number" placeholder="기수" required />

                <label for="club">동아리:</label>
                <select id="club">
                    <option value="경영리더십탐구부">경영리더십탐구부</option>
                    <option value="공학탐구부">공학탐구부</option>
                    <option value="과학신문부">과학신문부</option>
                    <option value="독서토론부">독서토론부</option>
                    <option value="국어탐구부">국어탐구부</option>
                    <option value="모의유엔부">모의유엔부</option>
                    <option value="물리부">물리부</option>
                    <option value="생명과학부">생명과학부</option>
                    <option value="수학다큐연구부">수학다큐연구부</option>
                    <option value="수학연구부">수학연구부</option>
                    <option value="신문부">신문부</option>
                    <option value="심리부">심리부</option>
                    <option value="역사탐방부">역사탐방부</option>
                    <option value="영상과학탐구부">영상과학탐구부</option>
                    <option value="영자신문부">영자신문부</option>
                    <option value="응용통계수학부">응용통계수학부</option>
                    <option value="철학부">철학부</option>
                    <option value="자유주제탐구부">자유주제탐구부</option>
                    <option value="미래탐구부">미래탐구부</option>
                    <option value="코딩수학부">코딩수학부</option>
                    <option value="통섭연구부">통섭연구부</option>
                    <option value="프로그래밍부">프로그래밍부</option>
                    <option value="화학부">화학부</option>
                    <option value="환경과학부">환경과학부</option>
                    <option value="현대과학연구부">현대과학연구부</option>
                    <option value="영어성경부">영어성경부</option>
                    <option value="모형제작부">모형제작부</option>
                    <option value="문예부">문예부</option>
                    <option value="문헌정보부">문헌정보부</option>
                    <option value="미술부">미술부</option>
                    <option value="방송부">방송부</option>
                    <option value="밴드부">밴드부</option>
                    <option value="사진부">사진부</option>
                    <option value="오케스트라">오케스트라</option>
                    <option value="보드게임부">보드게임부</option>
                    <option value="당구부">당구부</option>
                    <option value="산악부">산악부</option>
                    <option value="스포츠클라이밍부">스포츠클라이밍부</option>
                    <option value="안타레스(농구)">안타레스(농구)</option>
                    <option value="자전거부">자전거부</option>
                    <option value="빙구부">빙구부</option>
                    <option value="축구부">축구부</option>
                    <option value="트레이닝부">트레이닝부</option>
                    <option value="RCY">RCY</option>
                    <option value="인터랙트">인터랙트</option>
                    <option value="학생문화개선부">학생문화개선부</option>
                </select>
            `;
        }
    };

    document.getElementById('start-student').addEventListener('click', () => {
        currentLayout = 'student';
        renderFormFields(currentLayout);
        homeContainer.style.display = 'none';
        formContainer.style.display = 'block';
        webglContainer.style.display = 'none';
    });

    document.getElementById('generate').addEventListener('click', () => {
        const inputs = document.querySelectorAll('#form-fields input, #form-fields select');
        const inputValues = {};
        inputs.forEach(input => {
            inputValues[input.id] = input.value || '';
        });
    
        formContainer.style.display = 'none';
        webglContainer.style.display = 'block';
    
        if (!app) {
            app = new App(currentLayout);
        }
    
        app._updateTexture(inputValues);
    });    
};
