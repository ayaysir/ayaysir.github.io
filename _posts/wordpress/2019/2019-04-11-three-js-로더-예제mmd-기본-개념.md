---
published: false
title: "three.js: 로더 예제(MMD) + 기본 개념"
date: 2019-04-11
categories: 
  - "DevLog"
  - "JavaScript"
---

다운로드: [https://threejs.org/](https://threejs.org/) 의 download 링크를 통해 받는다.

여기서 MMD의 정의는 다음과 같다.

> MikuMikuDance는 일본에서 개발 및 공개 중인 3D CG 동영상 작성 툴이다. 약칭은 MMD. 이름처럼 VOCALOID 하츠네 미쿠의 3D 모델을 조작할 수 있는 프로그램이다. 이름은 VOCALOID의 대표격이라고 할 수 있는 하츠네 미쿠의 모델이 제일 먼저 나왔기 때문에 MikuMikuDance(미쿠미쿠댄스)라고 이름지어진 것이다

많은 MMD 모델들이 현재 무료로 공개된 상태라 키즈나아이 같은 캐릭터들도 MMD를 구해 돌려볼 수 있다.

three.js는 웹 브라우저 상에서 3D를 돌리기 위한 엔진을 WebGL을 사용하기 쉽게(?) 만든 자바스크립트 라이브러리로 각종 도형, 모델과 효과를 자바스크립트 코드만으로 작성할 수 있다.

그러나 막상 써보면 그나마 없는 것보다 낫다 정도지, 사용하기는 쉽지 않다. 매뉴얼(API Doc)이 매우 부실하고 기본적으로 제공하지 않는 외부 확장 라이브러리를 아무렇지도 않게 예제에서 쓰고 있기 때문에.. 외부 확장 라이브러리는 사용법조차 찾을 수 없는 것들이 많아서 더 어렵다.

MMD Loader는 three.js 마스터 소스에 기본적으로 내장되어 있으며 예제도 나와 있다. 말 그대로 MMD 모델링을 불러온다.

제목에는 기본 개념이라고 써있는데 이 예제는 절대 기본적인 예제는 아니다, 다만 재미있어 보이는 것 먼저 분석해보면서 흥미를 돋구는데(?) 의의가 있다고 치자..

예제에서 사용된 MMD 모델은 '웨더로이드 타입 A'라고 하는 캐릭터이며, 모델링을 무료로 배포하고 있다. [http://weathernews.jp/weatheroid/model/#!](http://weathernews.jp/weatheroid/model/#!)

주요 개념은 카메라(camera), 장면(scene), 물체(object), 조명(light), 재질(material), 각종 도형 등이 있으며 그 외에 컨트롤, 헬퍼 등을 알고 있어야 한다.

```
<!DOCTYPE html>
<html lang="en">

<head>
  <title>three.js webgl - loaders - MMD loader</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
  <style>
    body {
      font-family: Monospace;
      background-color: #fff;
      color: #000;
      margin: 0px;
      overflow: hidden;
    }

    #info {
      color: #000;
      position: absolute;
      top: 10px;
      width: 100%;
      text-align: center;
      display: block;
    }

    #info a,
    .button {
      color: #f00;
      font-weight: bold;
      text-decoration: underline;
      cursor: pointer
    }

  </style>
</head>

<body>
  <div id="info">

  </div>

  <script src="./js/three.min.js"></script>

  <script src="js/libs/mmdparser.min.js"></script>
  <script src="js/libs/ammo.js"></script>

  <script src="js/loaders/TGALoader.js"></script>
  <script src="js/loaders/MMDLoader.js"></script>
  <script src="js/effects/OutlineEffect.js"></script>
  <script src="js/animation/CCDIKSolver.js"></script>
  <script src="js/animation/MMDPhysics.js"></script>
  <script src="js/animation/MMDAnimationHelper.js"></script>

  <script src="js/controls/OrbitControls.js"></script>

  <script src="js/libs/stats.min.js"></script>
  <script src="js/libs/dat.gui.min.js"></script>

  <script>
    var container, stats;

    var mesh, camera, scene, renderer, effect;
    var helper, ikHelper, physicsHelper;

    var clock = new THREE.Clock();

    init();
    animate();

    function init() {

      container = document.createElement('div');
      document.body.appendChild(container);
      
      // 카메라: scene 또는 특정 오브젝트를 찍는 역할

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
      camera.position.z = 30;

      // scene: 장면, 각종 요소들이 배치되는 공간

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      
      // helper: 물체의 아웃라인을 파악할 수 있도록 도와주는 가이드 역할
      
      var gridHelper = new THREE.PolarGridHelper(30, 10);
      gridHelper.position.y = -10;
      scene.add(gridHelper);

      var ambient = new THREE.AmbientLight(0x666666);
      scene.add(ambient);

      var directionalLight = new THREE.DirectionalLight(0x887766);
      directionalLight.position.set(-1, 1, 1).normalize();
      scene.add(directionalLight);

      // renderer: 메인 렌더러 생성

      renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      // 아웃라인 이펙트(외부 라이브러리) 
      
      effect = new THREE.OutlineEffect(renderer);

      // STATS(현재 프레임 등 시스템 정보 표시)

      stats = new Stats();
      container.appendChild(stats.dom);
      
      // This will add a starfield to the background of a scene
      // 배경에 랜덤으로 별 같은 효과를 추가
      var starsGeometry = new THREE.Geometry();

      for ( var i = 0; i < 10000; i ++ ) {
        var star = new THREE.Vector3();
        star.x = THREE.Math.randFloatSpread( 2000 );
        star.y = THREE.Math.randFloatSpread( 2000 );
        star.z = THREE.Math.randFloatSpread( 2000 );

        starsGeometry.vertices.push( star );
      }

      var starsMaterial = new THREE.PointsMaterial( { color: 0x888888 } ); // 재질
      var starField = new THREE.Points( starsGeometry, starsMaterial ); // 좌표를 포함한 도형 정보
      scene.add( starField ); // 장면에 추가
      
      
      // model: 모델 로딩
      function onProgress(xhr) {

        if (xhr.lengthComputable) {
          var percentComplete = xhr.loaded / xhr.total * 100;
          console.log(Math.round(percentComplete, 2) + '% downloaded');
        }

      }

      // 파일 지정 부분(pmd는 MMD 모델의 메인 파일, vmd는 포즈 파일)
      var modelFile = './models/mmd/airi/WR_airi.pmd';
      var vmdFiles = ['models/mmd/pose/wavefile_v2.vmd'];

      helper = new THREE.MMDAnimationHelper({
        afterglow: 2.0  // ??
      });

      var loader = new THREE.MMDLoader();

      loader.loadWithAnimation(modelFile, vmdFiles, function(mmd) {

        mesh = mmd.mesh;
        mesh.position.y = -10;
        scene.add(mesh);

        helper.add(mesh, {
          animation: mmd.animation,
          physics: true
        });

        ikHelper = helper.objects.get(mesh).ikSolver.createHelper();
        ikHelper.visible = false;
        scene.add(ikHelper);

        physicsHelper = helper.objects.get(mesh).physics.createHelper();
        physicsHelper.visible = false;
        scene.add(physicsHelper);

        initGui();

      }, onProgress, null);

      // OrbitControls: 마우스 등으로 카메라를 움직일 수 있도록 하는 컨트롤
      var controls = new THREE.OrbitControls(camera, renderer.domElement);

      window.addEventListener('resize', onWindowResize, false);

      var phongMaterials;
      var originalMaterials;

      function makePhongMaterials(materials) {

        var array = [];

        for (var i = 0, il = materials.length; i < il; i++) {

          var m = new THREE.MeshPhongMaterial();
          m.copy(materials[i]);
          m.needsUpdate = true;

          array.push(m);

        }

        phongMaterials = array;

      }

      function initGui() {

        var api = {
          'animation': true,  // 포즈 파일에 애니메이션이 있다면 재생 여부를 선택
          'gradient mapping': true, // false로 하면 찰흙같은 재질로 나오고 true로 해야 흔히 말하는 "카툰 렌더링" 식으로 됨
          'ik': true, // Inversion Kinetic(역운동학), 적용하지 않으면 위치가 안정되지 않음
          'outline': true, // 외곽선
          'physics': true, // 물리 엔진 적용 여부
          'show IK bones': false, // 역운동학을 명시적으로 보여주는 bone의 표시 여부 
          'show rigid bodies': false // 강체(rigid bodies) 표시 여부, 3d 운동을 나타내는 여러 외곽선이 표시됨
        };

        // GUI
        var gui = new dat.GUI();

        gui.add(api, 'animation').onChange(function() {

          helper.enable('animation', api['animation']);

        });

        gui.add(api, 'gradient mapping').onChange(function() {

          if (originalMaterials === undefined) originalMaterials = mesh.material;
          if (phongMaterials === undefined) makePhongMaterials(mesh.material);

          if (api['gradient mapping']) {

            mesh.material = originalMaterials;

          } else {

            mesh.material = phongMaterials;

          }

        });

        gui.add(api, 'ik').onChange(function() {

          helper.enable('ik', api['ik']);

        });

        gui.add(api, 'outline').onChange(function() {

          effect.enabled = api['outline'];

        });

        gui.add(api, 'physics').onChange(function() {

          helper.enable('physics', api['physics']);

        });

        gui.add(api, 'show IK bones').onChange(function() {

          ikHelper.visible = api['show IK bones'];

        });

        gui.add(api, 'show rigid bodies').onChange(function() {

          if (physicsHelper !== undefined) physicsHelper.visible = api['show rigid bodies'];

        });

      }

    }

    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      effect.setSize(window.innerWidth, window.innerHeight);

    }

    // 이 부분의 함수가 지속적으로 반복되면서 3d 애니메이션이 표시됨, 
    // processing의 draw() 함수 역할

    function animate() {

      requestAnimationFrame(animate);

      stats.begin();
      render();
      stats.end();

    }

    // 렌더링 부분
    function render() {

      helper.update(clock.getDelta());
      effect.render(scene, camera);

    }

  </script>

</body>

</html>

```

https://www.youtube.com/watch?v=kreu\_DfWPO8
