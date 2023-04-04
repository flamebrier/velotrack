var velik3, wheel5, wheel6
var stats;

//sprite animation
var currentTile = 0;
const tileHoriz = 12;
const tilesVert = 1;

const spritemap = new THREE.TextureLoader().load('textures/sprite.png')
spritemap.magFilter = THREE.NearestFilter
spritemap.repeat.set(1 / tileHoriz, 1 / tilesVert)
const offsetX = (currentTile % tileHoriz) / tileHoriz;
const offsetY = (tilesVert - Math.floor(currentTile / tileHoriz) - 1) / tilesVert;

spritemap.offset.x = offsetX
spritemap.offset.y = offsetY

const materialsprite = new THREE.SpriteMaterial({ map: spritemap })
const sprite = new THREE.Sprite(materialsprite)
sprite.scale.set(4, 4, 4)
sprite.position.x = 10
sprite.position.z = -10
//--------------

const radius = 5;

// инициализация объектов
var container, camera, camera1, camera2, controls, scene, renderer, light, mouse, raycaster;
var particleSystem, velik1, wheelGroup, wheel2
var velik2, wheel3, wheel4
var velik4, wheel7, wheel8
var velik5, wheel9, wheel10
var velik6, wheel11, wheel12
var velik7, wheel13, wheel14
var velik8, wheel15, wheel16
var t = 0

//кривые для передвижения ----------------------------

// Корды кривой
var movementCurve = new THREE.CatmullRomCurve3([
  //levo
  new THREE.Vector3(-50 / 1.5, -1, -65 / 1.5),

  //verh
  new THREE.Vector3(50 / 1.5, -1, -65 / 1.5),
  //pravo
  //niz
  new THREE.Vector3(50 / 1.5, -1, 65 / 1.5),
  new THREE.Vector3(-50 / 1.5, -1, 65 / 1.5),

]);

movementCurve.closed = true;

var movementCurve2 = new THREE.CatmullRomCurve3([
  //levo
  new THREE.Vector3(-50 / 1.7, -1, -65 / 1.7),

  //verh
  new THREE.Vector3(50 / 1.7, -1, -65 / 1.7),
  //pravo
  //niz
  new THREE.Vector3(50 / 1.7, -1, 65 / 1.7),
  new THREE.Vector3(-50 / 1.7, -1, 65 / 1.7),

]);

movementCurve2.closed = true;

var movementCurve3 = new THREE.CatmullRomCurve3([
  //levo
  new THREE.Vector3(-50 / 1.6, -0.7, -65 / 1.6),

  //verh
  new THREE.Vector3(50 / 1.6, -0.7, -65 / 1.6),
  //pravo
  //niz
  new THREE.Vector3(50 / 1.6, -0.7, 65 / 1.6),
  new THREE.Vector3(-50 / 1.6, -0.7, 65 / 1.6),

]);

movementCurve3.closed = true;

var movementCurve4 = new THREE.CatmullRomCurve3([
  //levo
  new THREE.Vector3(-50 / 1.8, -0.7, -65 / 1.8),

  //verh
  new THREE.Vector3(50 / 1.8, -0.7, -65 / 1.8),
  //pravo
  //niz
  new THREE.Vector3(50 / 1.8, -0.7, 65 / 1.8),
  new THREE.Vector3(-50 / 1.8, -0.7, 65 / 1.8),

]);

movementCurve4.closed = true;

var movementCurve5 = new THREE.CatmullRomCurve3([
  //levo
  new THREE.Vector3(-50 / 1.9, -0.7, -65 / 1.9),

  //verh
  new THREE.Vector3(50 / 1.9, -0.7, -65 / 1.9),
  //pravo
  //niz
  new THREE.Vector3(50 / 1.9, -0.7, 65 / 1.9),
  new THREE.Vector3(-50 / 1.9, -0.7, 65 / 1.9),

]);

movementCurve5.closed = true;

//-----------------------------------------------------

// вызов функций
window.onload = function () {
  init();
  animate();
}

var w = window.innerWidth;
var h = window.innerHeight;
var viewSize = h;
var aspectRatio = w / h;

var _viewport = {
  viewSize: viewSize,
  aspectRatio: aspectRatio,
  left: (-aspectRatio * viewSize) / 15,
  right: (aspectRatio * viewSize) / 15,
  top: viewSize / 15,
  bottom: -viewSize / 15,
  near: -100,
  far: 2000000
}

function init() {
  scene = new THREE.Scene(); //инициализация сцены
  const color = 0xFFFFFF;  // white
  const near = 100;
  const far = 400;
  scene.fog = new THREE.Fog(color, near, far);
  AddCamera(-25, 10, 75)
  camera = camera1
  camera2 = new THREE.OrthographicCamera(_viewport.left,
    _viewport.right,
    _viewport.top,
    _viewport.bottom,
    _viewport.near,
    _viewport.far);
  camera2.rotation.set(-1.6, 0, 0)
  camera2.position.set(0, 0, 0)
  camera2.zoom = 1000
  AddLight(0, 100, 0); //добавление света
  light.castShadow = true;
  light.shadow.radius = 1;
  light.shadowBias = 0.0001;
  light.shadowDarkness = 0.2;
  light.shadowMapWidth = 2048;
  light.shadowMapHeight = 2048;

  console.log(light)


  let statsEl = document.getElementById('stats');

  stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  stats.domElement.style.position = 'fixed';
  stats.domElement.style.top = '10';
  stats.domElement.style.right = '10';
  stats.domElement.style.zIndex = 1;
  statsEl.appendChild(stats.dom);


  // Инициализация сцены
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowMapType = THREE.PCFShadowMap;
  renderer.setClearColor(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container = document.getElementById('MyWebGLApp');
  container.appendChild(renderer.domElement);

  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();

  // Создание системы координат и осей координат
  var axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  const gridHelper = new THREE.GridHelper(50, 50, 0x0000ff);
  gridHelper.position.y = -2.5;
  scene.add(gridHelper);

  // земля
  const landTexture = new THREE.TextureLoader().load("textures/grass.jpg");
  landTexture.wrapS = THREE.RepeatWrapping;
  landTexture.wrapT = THREE.RepeatWrapping;
  landTexture.repeat.set(70, 70);

  var landGeometry = new THREE.BoxGeometry(1200, 0.1, 1200)
  var landMaterial = new THREE.MeshPhongMaterial({ map: landTexture })
  var land = new THREE.Mesh(landGeometry, landMaterial)
  land.position.y = -2;

  const rampTexture = new THREE.TextureLoader().load("textures/red_metall.jpg");
  rampTexture.wrapS = THREE.RepeatWrapping;
  rampTexture.wrapT = THREE.RepeatWrapping;
  rampTexture.repeat.set(1, 5);

  // создание рампы
  var cubeGeometry = new THREE.BoxGeometry(3, 0.25, 10);
  var cubeMaterial = new THREE.MeshPhongMaterial({ map: rampTexture });
  var ramp = new THREE.Mesh(cubeGeometry, cubeMaterial);
  ramp.position.y = -1.25;
  ramp.rotation.x = -Math.PI / 8;

  // подложка
  const podloskaTexture = new THREE.TextureLoader().load("textures/black_metall.jpg");
  podloskaTexture.wrapS = THREE.RepeatWrapping;
  podloskaTexture.wrapT = THREE.RepeatWrapping;
  podloskaTexture.repeat.set(1, 10);

  var rampUpperGeometry = new THREE.BoxGeometry(2.75, 0.05, 9.5);
  var rampUpperMaterial = new THREE.MeshPhongMaterial({ map: podloskaTexture });
  var rampUpper = new THREE.Mesh(rampUpperGeometry, rampUpperMaterial);
  rampUpper.position.y = -1.13;
  rampUpper.rotation.x = -Math.PI / 8;

  // балки для рампы
  var firstBalkaGeometry = new THREE.BoxGeometry(0.25, 5, 0.25);
  var firstBalka = new THREE.Mesh(firstBalkaGeometry, cubeMaterial);
  firstBalka.position.z = 3.05;

  var secondBalkaGeometry = new THREE.BoxGeometry(0.25, 0.25, 6);

  firstBalka.updateMatrix();
  secondBalkaGeometry.merge(firstBalka.geometry, firstBalka.matrix);

  var ThirdBalkaGeometry = new THREE.BoxGeometry(2.5, 0.25, 0.25);
  var thirdBalka = new THREE.Mesh(ThirdBalkaGeometry, cubeMaterial);
  thirdBalka.position.z = 4.55;
  thirdBalka.position.y = -1.95;

  var balkiLeft = new THREE.Mesh(secondBalkaGeometry, cubeMaterial)
  balkiLeft.position.x = 1.37;
  balkiLeft.position.y = -1.95;
  balkiLeft.position.z = 1.5;

  var balkiRight = balkiLeft.clone()
  balkiRight.position.x = -1.37;
  balkiRight.position.y = -1.95;
  balkiRight.position.z = 1.5;

  const group = new THREE.Group();

  group.add(balkiLeft);
  group.add(balkiRight);
  group.add(rampUpper);
  group.add(thirdBalka);
  group.add(ramp);

  group.position.z = 15
  group.position.x = 22
  group.rotation.y = 5
  scene.add(group);

  const anotherGroup = group.clone();
  anotherGroup.position.z = -15
  anotherGroup.position.x = -20
  anotherGroup.rotation.y = 1.4
  scene.add(anotherGroup)

  const anotherGroup2 = group.clone();
  anotherGroup2.position.z = -35
  anotherGroup2.position.x = -5
  anotherGroup2.rotation.y = -6.3
  scene.add(anotherGroup2)

  const anotherGroup3 = group.clone();
  anotherGroup3.position.z = 35
  anotherGroup3.position.x = 5
  anotherGroup3.rotation.y = 3.15
  scene.add(anotherGroup3)

  for (var i = 0; i < anotherGroup3.children.length; i++) {
    anotherGroup3.children[i].castShadow = true;
    anotherGroup2.children[i].castShadow = true;
    anotherGroup.children[i].castShadow = true;
    group.children[i].castShadow = true;
  }

  // ---------------------------------------------------------- велотрек

  const trekTexture = new THREE.TextureLoader().load("textures/concrete.jpg");
  trekTexture.wrapS = THREE.RepeatWrapping;
  trekTexture.wrapT = THREE.RepeatWrapping;
  trekTexture.repeat.set(2.5, 0.5);

  // Корды кривой
  var closedSpline = new THREE.CatmullRomCurve3([
    //levo
    new THREE.Vector3(-60, 0, 45),
    new THREE.Vector3(-45, 0, -65),
    //verh
    new THREE.Vector3(0, 0, -80),
    new THREE.Vector3(45, 0, -65),
    //pravo
    new THREE.Vector3(60, 0, 45),
    //niz
    new THREE.Vector3(45, 0, 65),
    new THREE.Vector3(0, 0, 80),
    new THREE.Vector3(-45, 0, 65),

  ]);
  closedSpline.closed = true;

  // для экструда
  var extrudeSettings = {
    steps: 400,
    bevelEnabled: false,
    extrudePath: closedSpline
  };

  // Построение по поинтам
  var pts = [], count = 3;
  for (var i = 0; i < count; i++) {
    var l = 15;
    var a = 2 * i / count * -2.8;
    pts.push(new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l));
  }
  var shape = new THREE.Shape(pts);

  // Создание шейпа
  var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  var material = new THREE.MeshPhongMaterial({ map: trekTexture, wireframe: false, flatShading: false });

  // меш
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = -6
  scene.add(mesh)

  // -------------------------------------------------------------

  //велотрек - низ

  const dorojkaTexture = new THREE.TextureLoader().load("textures/dorojka.jpg");
  dorojkaTexture.wrapS = THREE.RepeatWrapping;
  dorojkaTexture.wrapT = THREE.RepeatWrapping;
  dorojkaTexture.repeat.set(10 * 0.5, 0.5 * 0.5);

  // Корды кривой
  var spline = new THREE.CatmullRomCurve3([
    //levo
    new THREE.Vector3(-60 / 1.5, 0, 45 / 1.5),
    new THREE.Vector3(-45 / 1.5, 0, -65 / 1.5),
    //verh
    new THREE.Vector3(0, 0, -80 / 1.5),
    new THREE.Vector3(45 / 1.5, 0, -65 / 1.5),
    //pravo
    new THREE.Vector3(60 / 1.5, 0, 45 / 1.5),
    //niz
    new THREE.Vector3(45 / 1.5, 0, 65 / 1.5),
    new THREE.Vector3(0, 0, 80 / 1.5),
    new THREE.Vector3(-45 / 1.5, 0, 65 / 1.5),

  ]);
  spline.closed = true;

  // для экструда
  var extrudeSettingss = {
    steps: 400,
    bevelEnabled: false,
    extrudePath: spline
  };

  // Построение по поинтам
  var ptss = [], counts = 3;
  for (var i = 0; i < counts; i++) {
    var l = 15;
    var a = 2 * i / counts * 3.1;
    ptss.push(new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l));
  }
  var shape = new THREE.Shape(ptss);

  // Создание шейпа
  var geometryNiz = new THREE.ExtrudeGeometry(shape, extrudeSettingss);
  var materialNiz = new THREE.MeshPhongMaterial({ map: dorojkaTexture, wireframe: false, flatShading: false });

  // меш
  var meshNiz = new THREE.Mesh(geometryNiz, materialNiz);
  meshNiz.position.y = -9
  meshNiz.receiveShadow = true
  scene.add(meshNiz)

  //------------------

  // ---------------------------------------------------------- крутая обводка

  // Корды кривой
  var closedSplineWalls = new THREE.CatmullRomCurve3([
    //levo
    new THREE.Vector3(-60 * 1.11, 0, 45 * 1.11),
    new THREE.Vector3(-45 * 1.11, 0, -65 * 1.11),
    //verh
    new THREE.Vector3(0, 0 * 1.11, -80 * 1.11),
    new THREE.Vector3(45 * 1.11, 0, -65 * 1.11),
    //pravo
    new THREE.Vector3(60 * 1.11, 0, 45 * 1.11),
    //niz
    new THREE.Vector3(45 * 1.11, 0, 65 * 1.11),
    new THREE.Vector3(0, 0 * 1.11, 80 * 1.11),
    new THREE.Vector3(-45 * 1.11, 0, 65 * 1.11),
  ]);
  closedSplineWalls.closed = true;

  // для экструда
  var extrudeSettingsWalls = {
    steps: 400,
    bevelEnabled: false,
    extrudePath: closedSplineWalls
  };

  // Построение по поинтам
  var ptsWalls = [], countWalls = 5;
  for (var i = 0; i < countWalls; i++) {
    var l = 1;
    var a = 2 * i / countWalls * Math.PI;
    ptsWalls.push(new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l));
  }
  var shapeWalls = new THREE.Shape(ptsWalls);

  // Создание шейпа
  var geometryWalls = new THREE.ExtrudeGeometry(shapeWalls, extrudeSettingsWalls);
  var materialWalls = new THREE.MeshPhongMaterial({ map: trekTexture, wireframe: false, flatShading: false });

  // меш
  var meshWalls = new THREE.Mesh(geometryWalls, materialWalls);
  meshWalls.position.y = 4
  scene.add(meshWalls)

  // -------------------------------------------------------------

  // ---------------------------------------------------------- стены

  // Корды кривой
  var closedSplineWalls = new THREE.CatmullRomCurve3([
    //levo
    new THREE.Vector3(-60 * 1.11, 0, 45 * 1.15),
    new THREE.Vector3(-45 * 1.11, 0, -65 * 1.11),
    //verh
    new THREE.Vector3(0, 0 * 1.11, -80 * 1.10),
    new THREE.Vector3(45 * 1.11, 0, -65 * 1.11),
    //pravo
    new THREE.Vector3(60 * 1.11, 0, 45 * 1.15),
    //niz
    new THREE.Vector3(45 * 1.11, 0, 65 * 1.11),
    new THREE.Vector3(0, 0 * 1.11, 80 * 1.10),
    new THREE.Vector3(-45 * 1.11, 0, 65 * 1.11),
  ]);
  closedSplineWalls.closed = true;

  // для экструда
  var extrudeSettingsWalls = {
    steps: 800,
    bevelEnabled: false,
    extrudePath: closedSplineWalls
  };

  // Построение по поинтам
  var ptsWalls = [], countWalls = 5;
  for (var i = 0; i < countWalls; i++) {
    var l = 1;
    var a = 2 * i / countWalls * Math.PI;
    ptsWalls.push(new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l));
  }
  var shapeWalls = new THREE.Shape(ptsWalls);

  // Создание шейпа
  var geometryWalls = new THREE.ExtrudeGeometry(shapeWalls, extrudeSettingsWalls);
  var materialWalls = new THREE.MeshPhongMaterial({ map: trekTexture, wireframe: false, flatShading: false });

  // меш
  var meshWalls = new THREE.Mesh(geometryWalls, materialWalls);
  meshWalls.position.y = 6
  scene.add(meshWalls)

  // -------------------------------------------------------------

  //частицы
  var particleTexture = THREE.ImageUtils.loadTexture('textures/leaf.png');

  var particles = new THREE.Geometry;
  for (var p = 0; p < 2000; p++) {
    var particle = new THREE.Vector3(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 250);
    particles.vertices.push(particle);
  }

  var particleMaterial = new THREE.ParticleBasicMaterial({ transparent: true, map: particleTexture });
  particleSystem = new THREE.ParticleSystem(particles, particleMaterial);

  scene.add(particleSystem)

  //---------------------------------------- велосипед
  //колесо
  const wheelGeometry = new THREE.TorusGeometry(0.25, 0.05, 8, 24);
  var wheelMaterial = new THREE.MeshPhongMaterial({ color: 'black', wireframe: false, flatShading: false });
  var wheelMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
  const spicaGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.5, 12)
  var spicaMaterial = new THREE.MeshPhongMaterial({ color: 'grey', wireframe: false, flatShading: false });
  var spicaMesh = new THREE.Mesh(spicaGeometry, spicaMaterial);
  var spica2 = spicaMesh.clone();
  spica2.rotation.z = 0.5
  var spica3 = spicaMesh.clone();
  spica3.rotation.z = 1
  var spica4 = spicaMesh.clone();
  spica4.rotation.z = 1.5
  var spica5 = spicaMesh.clone();
  spica5.rotation.z = 2
  var spica6 = spicaMesh.clone();
  spica6.rotation.z = 2.5

  wheelGroup = new THREE.Group()

  wheelGroup.add(wheelMesh);
  wheelGroup.add(spicaMesh);
  wheelGroup.add(spica2);
  wheelGroup.add(spica3);
  wheelGroup.add(spica4);
  wheelGroup.add(spica5);
  wheelGroup.add(spica6);

  scene.add(wheelGroup)

  //колесо2
  wheel2 = wheelGroup.clone()
  wheel2.position.x = 1.2
  scene.add(wheel2)

  //корпус
  const palka1Geometry = new THREE.CylinderGeometry(0.025, 0.05, 0.5, 12);
  var palka1Material = new THREE.MeshPhongMaterial({ color: 'red', wireframe: false, flatShading: false });
  var palka1Mesh = new THREE.Mesh(palka1Geometry, palka1Material)
  palka1Mesh.position.z = 0.1
  palka1Mesh.position.y = 0.15
  palka1Mesh.position.x = 0.1
  palka1Mesh.rotation.z = -0.5
  scene.add(palka1Mesh)

  const palka2Geometry = new THREE.CylinderGeometry(0.025, 0.05, 0.5, 12);
  var palka2Material = new THREE.MeshPhongMaterial({ color: 'red', wireframe: false, flatShading: false });
  var palka2Mesh = new THREE.Mesh(palka2Geometry, palka2Material)
  palka2Mesh.position.z = -0.1
  palka2Mesh.position.y = 0.15
  palka2Mesh.position.x = 0.1
  palka2Mesh.rotation.z = -0.5
  scene.add(palka2Mesh)

  const palka3Geometry = new THREE.CylinderGeometry(0.025, 0.05, 0.5, 12);
  var palka3Material = new THREE.MeshPhongMaterial({ color: 'red', wireframe: false, flatShading: false });
  var palka3Mesh = new THREE.Mesh(palka3Geometry, palka3Material)
  palka3Mesh.position.z = 0.1
  palka3Mesh.position.y = -0.1
  palka3Mesh.position.x = 0.25
  palka3Mesh.rotation.z = -1.75
  scene.add(palka3Mesh)

  const palka4Geometry = new THREE.CylinderGeometry(0.025, 0.05, 0.5, 12);
  var palka4Material = new THREE.MeshPhongMaterial({ color: 'red', wireframe: false, flatShading: false });
  var palka4Mesh = new THREE.Mesh(palka4Geometry, palka4Material)
  palka4Mesh.position.z = -0.1
  palka4Mesh.position.y = -0.1
  palka4Mesh.position.x = 0.25
  palka4Mesh.rotation.z = -1.75
  scene.add(palka4Mesh)

  const palka5Geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 12);
  var palka5Material = new THREE.MeshPhongMaterial({ color: 'red', wireframe: false, flatShading: false });
  var palka5Mesh = new THREE.Mesh(palka5Geometry, palka5Material)
  palka5Mesh.position.y = -0.125
  palka5Mesh.position.x = 0.5
  palka5Mesh.rotation.x = 1.6
  scene.add(palka5Mesh)

  const palka6Geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 12);
  var palka6Material = new THREE.MeshPhongMaterial({ color: 'red', wireframe: false, flatShading: false });
  var palka6Mesh = new THREE.Mesh(palka6Geometry, palka6Material)
  palka6Mesh.position.y = 0.4
  palka6Mesh.position.x = 0.225
  palka6Mesh.rotation.x = 1.6
  scene.add(palka6Mesh)

  const palka7Geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 12);
  var palka7Material = new THREE.MeshPhongMaterial({ color: 'red', wireframe: false, flatShading: false });
  var palka7Mesh = new THREE.Mesh(palka7Geometry, palka7Material)
  palka7Mesh.position.y = -0.05
  palka7Mesh.rotation.x = 1.6
  scene.add(palka7Mesh)

  const palka8Geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.75, 12);
  var palka8Material = new THREE.MeshPhongMaterial({ color: 'red', wireframe: false, flatShading: false });
  var palka8Mesh = new THREE.Mesh(palka8Geometry, palka8Material)
  palka8Mesh.position.x = 0.325
  palka8Mesh.position.y = 0.2
  palka8Mesh.rotation.z = 0.5
  scene.add(palka8Mesh)

  const palka9Geometry = new THREE.CylinderGeometry(0.025, 0.025, 0.75, 12);
  var palka9Material = new THREE.MeshPhongMaterial({ color: 'grey', wireframe: false, flatShading: false });
  var palka9Mesh = new THREE.Mesh(palka9Geometry, palka9Material)
  palka9Mesh.position.x = 0.215
  palka9Mesh.position.y = 0.4
  palka9Mesh.rotation.z = 0.5
  scene.add(palka9Mesh)

  const palka10Geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.75, 12);
  var palka10Material = new THREE.MeshPhongMaterial({ color: 'red', wireframe: false, flatShading: false });
  var palka10Mesh = new THREE.Mesh(palka10Geometry, palka10Material)
  palka10Mesh.position.x = 0.6
  palka10Mesh.position.y = 0.45
  palka10Mesh.rotation.z = 1.7
  scene.add(palka10Mesh)

  const palka11Geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.75, 12);
  var palka11Material = new THREE.MeshPhongMaterial({ color: 'red', wireframe: false, flatShading: false });
  var palka11Mesh = new THREE.Mesh(palka11Geometry, palka11Material)
  palka11Mesh.position.x = 0.7
  palka11Mesh.position.y = 0.15
  palka11Mesh.rotation.z = 2.5
  scene.add(palka11Mesh)

  const palka12Geometry = new THREE.CylinderGeometry(0.075, 0.075, 0.15, 12);
  var palka12Material = new THREE.MeshPhongMaterial({ color: 'red', wireframe: false, flatShading: false });
  var palka12Mesh = new THREE.Mesh(palka12Geometry, palka12Material)
  palka12Mesh.position.x = 0.95
  palka12Mesh.position.y = 0.5
  palka12Mesh.rotation.z = 0.5
  scene.add(palka12Mesh)

  const palka13Geometry = new THREE.CylinderGeometry(0.035, 0.035, 0.2, 12);
  var palka13Material = new THREE.MeshPhongMaterial({ color: 'red', wireframe: false, flatShading: false });
  var palka13Mesh = new THREE.Mesh(palka13Geometry, palka13Material)
  palka13Mesh.position.x = 1
  palka13Mesh.position.y = 0.4
  palka13Mesh.position.z = -0.05
  palka13Mesh.rotation.z = 1
  palka13Mesh.rotation.y = 1
  scene.add(palka13Mesh)

  const palka14Geometry = new THREE.CylinderGeometry(0.035, 0.035, 0.2, 12);
  var palka14Material = new THREE.MeshPhongMaterial({ color: 'red', wireframe: false, flatShading: false });
  var palka14Mesh = new THREE.Mesh(palka14Geometry, palka14Material)
  palka14Mesh.position.x = 1
  palka14Mesh.position.y = 0.4
  palka14Mesh.position.z = 0.05
  palka14Mesh.rotation.z = -1
  palka14Mesh.rotation.y = 2
  scene.add(palka14Mesh)

  const palka15Geometry = new THREE.CylinderGeometry(0.035, 0.035, 0.4, 12);
  var palka15Material = new THREE.MeshPhongMaterial({ color: 'red', wireframe: false, flatShading: false });
  var palka15Mesh = new THREE.Mesh(palka15Geometry, palka15Material)
  palka15Mesh.position.x = 1.115
  palka15Mesh.position.y = 0.2
  palka15Mesh.position.z = 0.115
  palka15Mesh.rotation.z = 0.5
  scene.add(palka15Mesh)

  const palka16Geometry = new THREE.CylinderGeometry(0.035, 0.035, 0.4, 12);
  var palka16Material = new THREE.MeshPhongMaterial({ color: 'red', wireframe: false, flatShading: false });
  var palka16Mesh = new THREE.Mesh(palka16Geometry, palka16Material)
  palka16Mesh.position.x = 1.115
  palka16Mesh.position.y = 0.2
  palka16Mesh.position.z = -0.115
  palka16Mesh.rotation.z = 0.5
  scene.add(palka16Mesh)

  const palka17Geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 12);
  var palka17Material = new THREE.MeshPhongMaterial({ color: 'red', wireframe: false, flatShading: false });
  var palka17Mesh = new THREE.Mesh(palka17Geometry, palka17Material)
  palka17Mesh.position.y = 0
  palka17Mesh.position.x = 1.225
  palka17Mesh.rotation.x = 1.6
  scene.add(palka17Mesh)

  const palka18Geometry = new THREE.CylinderGeometry(0.025, 0.025, 0.4, 12);
  var palka18Material = new THREE.MeshPhongMaterial({ color: 'grey', wireframe: false, flatShading: false });
  var palka18Mesh = new THREE.Mesh(palka18Geometry, palka18Material)
  palka18Mesh.position.y = 0.7
  palka18Mesh.position.x = 0.8
  palka18Mesh.position.z = 0.15
  palka18Mesh.rotation.x = 0.75
  palka18Mesh.rotation.z = 0.5
  scene.add(palka18Mesh)

  const palka19Geometry = new THREE.CylinderGeometry(0.025, 0.025, 0.4, 12);
  var palka19Material = new THREE.MeshPhongMaterial({ color: 'grey', wireframe: false, flatShading: false });
  var palka19Mesh = new THREE.Mesh(palka19Geometry, palka19Material)
  palka19Mesh.position.y = 0.7
  palka19Mesh.position.x = 0.8
  palka19Mesh.position.z = -0.15
  palka19Mesh.rotation.x = -0.75
  palka19Mesh.rotation.z = 0.5
  scene.add(palka19Mesh)

  const palka20Geometry = new THREE.CylinderGeometry(0.025, 0.025, 0.6, 12);
  var palka20Material = new THREE.MeshPhongMaterial({ color: 'grey', wireframe: false, flatShading: false });
  var palka20Mesh = new THREE.Mesh(palka20Geometry, palka20Material)
  palka20Mesh.position.y = 0.85
  palka20Mesh.position.x = 0.7
  palka20Mesh.rotation.x = 1.6
  scene.add(palka20Mesh)

  const palka21Geometry = new THREE.CylinderGeometry(0.025, 0.025, 0.2, 12);
  var palka21Material = new THREE.MeshPhongMaterial({ color: 'black', wireframe: false, flatShading: false });
  var palka21Mesh = new THREE.Mesh(palka21Geometry, palka21Material)
  palka21Mesh.position.y = 0.825
  palka21Mesh.position.x = 0.6
  palka21Mesh.position.z = 0.35
  palka21Mesh.rotation.x = 1.6
  palka21Mesh.rotation.z = 1.1
  scene.add(palka21Mesh)

  const palka22Geometry = new THREE.CylinderGeometry(0.025, 0.025, 0.2, 12);
  var palka22Material = new THREE.MeshPhongMaterial({ color: 'black', wireframe: false, flatShading: false });
  var palka22Mesh = new THREE.Mesh(palka22Geometry, palka22Material)
  palka22Mesh.position.y = 0.85
  palka22Mesh.position.x = 0.6
  palka22Mesh.position.z = -0.35
  palka22Mesh.rotation.x = -1.6
  palka22Mesh.rotation.z = 1.1
  scene.add(palka22Mesh)

  var sideniyeGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.25);
  var sideniyeMaterial = new THREE.MeshPhongMaterial({ color: 'black' });
  var sideniye = new THREE.Mesh(sideniyeGeometry, sideniyeMaterial);
  sideniye.position.y = 0.7
  scene.add(sideniye)

  const krutilkaGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.025, 12);
  var krutilkaMaterial = new THREE.MeshPhongMaterial({ color: 'lightgrey', wireframe: false, flatShading: false });
  var krutilkaMesh = new THREE.Mesh(krutilkaGeometry, krutilkaMaterial)
  krutilkaMesh.rotation.x = 1.6
  krutilkaMesh.position.z = 0.15
  krutilkaMesh.position.x = 0.5
  krutilkaMesh.position.y = -0.1
  scene.add(krutilkaMesh)

  const krutilka2Geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.025, 12);
  var krutilka2Material = new THREE.MeshPhongMaterial({ color: 'lightgrey', wireframe: false, flatShading: false });
  var krutilka2Mesh = new THREE.Mesh(krutilka2Geometry, krutilka2Material)
  krutilka2Mesh.rotation.x = 1.6
  krutilka2Mesh.position.z = -0.15
  krutilka2Mesh.position.x = 0.5
  krutilka2Mesh.position.y = -0.1
  scene.add(krutilka2Mesh)

  const pedalPalka1Geometry = new THREE.CylinderGeometry(0.015, 0.015, 0.1, 12);
  var pedalPalka1Material = new THREE.MeshPhongMaterial({ color: 'grey', wireframe: false, flatShading: false });
  var pedalPalka1Mesh = new THREE.Mesh(pedalPalka1Geometry, pedalPalka1Material)
  pedalPalka1Mesh.rotation.z = 1.6
  pedalPalka1Mesh.rotation.y = 1.6
  pedalPalka1Mesh.position.x = 0.5
  pedalPalka1Mesh.position.y = -0.05
  pedalPalka1Mesh.position.z = 0.2
  scene.add(pedalPalka1Mesh)

  const pedalPalka2Geometry = new THREE.CylinderGeometry(0.015, 0.015, 0.1, 12);
  var pedalPalka2Material = new THREE.MeshPhongMaterial({ color: 'grey', wireframe: false, flatShading: false });
  var pedalPalka2Mesh = new THREE.Mesh(pedalPalka2Geometry, pedalPalka2Material)
  pedalPalka2Mesh.rotation.z = 1.6
  pedalPalka2Mesh.rotation.y = 1.6
  pedalPalka2Mesh.position.x = 0.5
  pedalPalka2Mesh.position.y = -0.15
  pedalPalka2Mesh.position.z = -0.2
  scene.add(pedalPalka2Mesh)

  var pedalGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.25);
  var pedalMaterial = new THREE.MeshPhongMaterial({ color: 'black' });
  var pedal = new THREE.Mesh(pedalGeometry, pedalMaterial);
  pedal.position.x = 0.5
  pedal.position.y = -0.05
  pedal.position.z = 0.35
  scene.add(pedal)

  var pedal2Geometry = new THREE.BoxGeometry(0.1, 0.05, 0.25);
  var pedal2Material = new THREE.MeshPhongMaterial({ color: 'black' });
  var pedal2 = new THREE.Mesh(pedal2Geometry, pedal2Material);
  pedal2.position.x = 0.5
  pedal2.position.y = -0.15
  pedal2.position.z = -0.35
  scene.add(pedal2)

  const velikGroup = new THREE.Group()

  velikGroup.add(palka1Mesh);
  velikGroup.add(palka2Mesh);
  velikGroup.add(palka3Mesh);
  velikGroup.add(palka4Mesh);
  velikGroup.add(palka5Mesh);
  velikGroup.add(palka6Mesh);
  velikGroup.add(palka7Mesh);
  velikGroup.add(palka8Mesh);
  velikGroup.add(palka9Mesh);
  velikGroup.add(palka10Mesh);
  velikGroup.add(palka11Mesh);
  velikGroup.add(palka12Mesh);
  velikGroup.add(palka13Mesh);
  velikGroup.add(palka14Mesh);
  velikGroup.add(palka15Mesh);
  velikGroup.add(palka16Mesh);
  velikGroup.add(palka17Mesh);
  velikGroup.add(palka18Mesh);
  velikGroup.add(palka19Mesh);
  velikGroup.add(palka20Mesh);
  velikGroup.add(palka21Mesh);
  velikGroup.add(palka22Mesh);
  velikGroup.add(sideniye);
  velikGroup.add(krutilkaMesh);
  velikGroup.add(krutilka2Mesh);
  velikGroup.add(pedalPalka1Mesh);
  velikGroup.add(pedalPalka2Mesh);
  velikGroup.add(pedal);
  velikGroup.add(pedal2);

  velik1 = velikGroup.clone()

  velik1.add(wheelGroup);
  velik1.add(wheel2);

  velik1.position.y = -1.65
  scene.add(velik1)

  velik2 = velikGroup.clone()
  wheel3 = wheelGroup.clone()
  wheel4 = wheel2.clone()

  velik2.add(wheel3);
  velik2.add(wheel4);

  velik2.position.y = -0.8
  velik2.position.z = 20
  velik2.position.x = -35
  velik2.rotation.y = 1.6
  scene.add(velik2)

  velik3 = velikGroup.clone()
  wheel5 = wheelGroup.clone()
  wheel6 = wheel2.clone()

  velik3.add(wheel5);
  velik3.add(wheel6);

  velik3.position.y = -1.65
  velik3.position.z = -20
  velik3.position.x = 10
  velik3.rotation.y = 1.6
  scene.add(velik3)

  velik4 = velikGroup.clone()
  wheel7 = wheelGroup.clone()
  wheel8 = wheel2.clone()

  velik4.add(wheel7);
  velik4.add(wheel8);

  velik4.position.y = -0.8
  velik4.position.z = 20
  velik4.position.x = -35
  velik4.rotation.y = 1.6
  scene.add(velik4)


  velik5 = velikGroup.clone()
  wheel9 = wheelGroup.clone()
  wheel10 = wheel2.clone()

  velik5.add(wheel9);
  velik5.add(wheel10);

  velik5.position.y = -0.8
  velik5.position.z = 20
  velik5.position.x = -35
  velik5.rotation.y = 1.6
  scene.add(velik5)


  velik6 = velikGroup.clone()
  wheel11 = wheelGroup.clone()
  wheel12 = wheel2.clone()

  velik6.add(wheel11);
  velik6.add(wheel12);

  velik6.position.y = -0.8
  velik6.position.z = 20
  velik6.position.x = -35
  velik6.rotation.y = 1.6
  scene.add(velik6)


  velik7 = velikGroup.clone()
  wheel13 = wheelGroup.clone()
  wheel14 = wheel2.clone()

  velik7.add(wheel13);
  velik7.add(wheel14);

  velik7.position.y = -0.8
  velik7.position.z = 20
  velik7.position.x = -35
  velik7.rotation.y = 1.6


  velik8 = velikGroup.clone()
  wheel15 = wheelGroup.clone()
  wheel16 = wheel2.clone()

  velik8.add(wheel15);
  velik8.add(wheel16);

  velik8.position.y = -1.7
  velik8.position.z = 10
  velik8.position.x = -10
  velik8.rotation.y = 1.6

  for (var i = 0; i < velik7.children.length; i++) {
    velik8.children[i].castShadow = true;
    velik7.children[i].castShadow = true;
    velik6.children[i].castShadow = true;
    velik5.children[i].castShadow = true;
    velik4.children[i].castShadow = true;
    velik3.children[i].castShadow = true;
    velik2.children[i].castShadow = true;
    velik1.children[i].castShadow = true;
  }

  console.log(meshNiz)
  console.log(velik7)

  scene.add(velik7)
  scene.add(velik8)

  //---------------------------------------- 

  //-------sprite-animation

  scene.add(sprite)

  //-----------

  //скайбокс

  const skyboxTexture = new THREE.TextureLoader().load("textures/skybox.jpg");
  skyboxTexture.wrapS = THREE.RepeatWrapping;
  skyboxTexture.wrapT = THREE.RepeatWrapping;
  skyboxTexture.repeat.set(2, 2);
  skyboxTexture.needsUpdate = true;
  scene.texture = skyboxTexture

  const skyboxGeometry = new THREE.SphereGeometry(200, 32, 32);
  var skyboxMaterial = new THREE.MeshPhongMaterial({ map: skyboxTexture, side: THREE.DoubleSide });
  var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
  skybox.scale.x = -1
  scene.add(skybox)

  //добавлялки
  land.receiveShadow = true
  scene.add(land)
  velik3.name = 'velikAnimate'
  console.log(velik3)

}

function hoverPieces() {
  raycaster.setFromCamera(mouse, camera);
  const intersets = raycaster.intersectObjects(velik3.children)
  for (var i = 0; i < intersets.length; i++) {
    velik3.children.forEach(e => {
      e.position.x -= 0.1
    })
  }
}

var playIndeces = []
var tileArrayIndex = 0
var maxDisplayTime = 0;
var elapsedTime = 0

function loop(playIndeces, totalDuration) {
  maxDisplayTime = totalDuration / (playIndeces.length * 3)
}

function update(delta) {
  elapsedTime += delta

  if (maxDisplayTime > 0 && elapsedTime >= maxDisplayTime) {
    if (currentTile == 11) currentTile = 0
    elapsedTime = 0
    tileArrayIndex = (tileArrayIndex + 1) % playIndeces.length
    currentTile += 1
    const offsetX = (currentTile % tileHoriz) / tileHoriz;
    const offsetY = (tilesVert - Math.floor(currentTile / tileHoriz) - 1) / tilesVert;

    spritemap.offset.x = offsetX
    spritemap.offset.y = offsetY
  }
}

function animate() {
  stats.begin();
  requestAnimationFrame(animate);
  update(0.01)
  render();
  stats.end();
}

function render() {
  var time = 0.001;
  particleSystem.rotation.y += 0.001;
  time *= 0.001
  loop([0, 1, 2, 3, 4, 5], 1)
  // ------------------------- анимация для катания великов по кругу
  var pos = movementCurve.getPoint(Date.now() * 0.00005);
  var rot = movementCurve.getTangent(Date.now() * 0.001)
  velik4.position.set(pos.x, pos.y, pos.z)
  velik4.lookAt(0, rot.y * 1.2, 0)

  var pos2 = movementCurve2.getPoint(Date.now() * 0.000075);
  var rot2 = movementCurve2.getTangent(Date.now() * 0.002)
  velik2.position.set(pos2.x, pos2.y, pos2.z)
  velik2.lookAt(0, rot2.y * 1.2, 0)

  var pos3 = movementCurve3.getPoint(Date.now() * 0.00006);
  var rot3 = movementCurve3.getTangent(Date.now() * 0.002)
  velik5.position.set(pos3.x, pos3.y, pos3.z)
  velik5.lookAt(0, rot3.y * 1.2, 0)

  var pos4 = movementCurve4.getPoint(Date.now() * 0.00008);
  var rot4 = movementCurve4.getTangent(Date.now() * 0.002)
  velik6.position.set(pos4.x, pos4.y, pos4.z)
  velik6.lookAt(0, rot4.y * 1.2, 0)

  var pos5 = movementCurve5.getPoint(Date.now() * 0.000055);
  var rot5 = movementCurve5.getTangent(Date.now() * 0.003)
  velik7.position.set(pos5.x, pos5.y, pos5.z)
  velik7.lookAt(0, rot5.y * 1.2, 0)

  // -----------------------

  // -----------анимация катания туда сюда
  velik1.position.x = Math.sin(Date.now() * 0.001) * 0.5 * 10
  wheelGroup.rotation.z = Math.sin(Date.now() * 0.001) * 0.8 * 10
  wheel2.rotation.z = Math.sin(Date.now() * 0.001) * 0.8 * 10
  wheel5.rotation.z += Date.now() * 0.001
  wheel6.rotation.z += Date.now() * 0.001
  wheel7.rotation.z += Date.now() * 0.001
  wheel8.rotation.z += Date.now() * 0.001
  wheel9.rotation.z += Date.now() * 0.001
  wheel10.rotation.z += Date.now() * 0.001
  wheel11.rotation.z += Date.now() * 0.001
  wheel12.rotation.z += Date.now() * 0.001
  wheel13.rotation.z += Date.now() * 0.001
  wheel14.rotation.z += Date.now() * 0.001
  // -------------

  hoverPieces()

  //кнопки
  document.getElementById('lightOn').onclick = function () { light.intensity = 0.5 }
  document.getElementById('lightOff').onclick = function () { light.intensity = 0.1 }

  document.getElementById('lightForward').onclick = function () { light.position.z += 10 }
  document.getElementById('lightBack').onclick = function () { light.position.z -= 10 }
  document.getElementById('lightLeft').onclick = function () { light.position.x -= 10 }
  document.getElementById('lightRight').onclick = function () { light.position.x += 10 }

  controls.update()
  renderer.render(scene, camera);
}

function AddCamera(X, Y, Z) {
  camera1 = new THREE.PerspectiveCamera(400, window.innerWidth / window.innerHeight, 1, 10000);
  camera1.position.set(X, Y, Z);
  controls = new THREE.TrackballControls(camera1, container);
  controls.rotateSpeed = 1.25;
  controls.noZoom = false;
  controls.zoomSpeed = 1.2;
  controls.staticMoving = true;
}

function AddLight(X, Y, Z) {
  light = new THREE.PointLight(0xffffff, 0.5);
  light.position.set(X, Y, Z);
  scene.add(light);
}

function onMouseMove(event) {

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

}

window.addEventListener('pointermove', onMouseMove);

window.addEventListener('keydown', function (event) {
  if (event.code == 'KeyW') {
    velik8.position.z -= 0.1
  }
  if (event.code == 'KeyS') {
    velik8.position.z += 0.1
  }
  if (event.code == 'KeyA') {
    velik8.position.x -= 0.1
    velik8.rotation.y += 0.025
  }
  if (event.code == 'KeyD') {
    velik8.position.x += 0.1
    velik8.rotation.y -= 0.025
  }

  if (event.code == 'KeyN') {
    camera = camera1;
  }

  if (event.code == 'KeyM') {
    camera = camera2;
  }

});





