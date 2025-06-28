let scene, camera, renderer, buildings = [], island;
let mouse = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };
let currentRotation = { x: 0, y: 0 };
let questPanels = [];

const questsData = [
    {
        id: 1,
        title: "Website Redesign",
        description: "Complete the company website redesign project",
        position: { x: 5, z: 8 },
        tasks: [
            { id: 1, title: "Create wireframes", description: "Design basic layout structure", completed: true },
            { id: 2, title: "UI Design", description: "Create visual design mockups", completed: true },
            { id: 3, title: "Frontend Development", description: "Code the frontend interface", completed: false },
            { id: 4, title: "Backend Integration", description: "Connect with backend APIs", completed: false }
        ]
    },
    {
        id: 2,
        title: "Mobile App",
        description: "Develop the mobile application",
        position: { x: -8, z: 12 },
        tasks: [
            { id: 5, title: "Market Research", description: "Analyze target audience", completed: true },
            { id: 6, title: "App Design", description: "Create mobile UI/UX", completed: false },
            { id: 7, title: "Development", description: "Code the mobile app", completed: false }
        ]
    },
    {
        id: 3,
        title: "Database Migration",
        description: "Migrate legacy database to new system",
        position: { x: 12, z: -5 },
        tasks: [
            { id: 8, title: "Data Backup", description: "Create complete backup", completed: true },
            { id: 9, title: "Schema Design", description: "Design new database schema", completed: true },
            { id: 10, title: "Data Migration", description: "Transfer data to new system", completed: false },
            { id: 11, title: "Testing", description: "Verify data integrity", completed: false }
        ]
    }
];

const colors = {
    buildings: [
        0xFFE5B4, // Light peach
        0xFFD1DC, // Light pink
        0xE0E6FF, // Light blue
        0xD4FFAA, // Light green
        0xFFF2CC, // Light yellow
        0xFFCCCC, // Light coral
        0xCCE5FF, // Sky blue
        0xE6CCFF, // Light purple
        0xFFE0CC, // Light orange
        0xCCFFCC  // Mint green
    ],
    ground: 0xF5F5F5,
    roads: 0xE8E8E8,
    shadows: 0x000000
};

function init() {
    scene = new THREE.Scene();
    scene.background = null; 
    
    const aspect = window.innerWidth / window.innerHeight;
    const d = 20;
    camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    camera.position.set(28, 20, 28);
    camera.lookAt(0, 0, 0);

    const container = document.getElementById('container');
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0); 
    document.getElementById('container').appendChild(renderer.domElement);
    
    setupLighting();
    
    createIsland();
    
    generateCity();
    
    setupMouseControls();

    animate();

    createQuestPanels();
}

function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(50, 50, 25);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);
}

function createIsland() {
    const islandGroup = new THREE.Group();
    
    const islandGeometry = new THREE.BoxGeometry(50, 3, 50);
    const islandMaterial = new THREE.MeshLambertMaterial({ color: 0xE8F5E8 });
    island = new THREE.Mesh(islandGeometry, islandMaterial);
    island.position.y = -1;
    island.receiveShadow = true;
    islandGroup.add(island);
    
    const islandEdges = new THREE.EdgesGeometry(islandGeometry);
    const islandWireframe = new THREE.LineSegments(islandEdges, new THREE.LineBasicMaterial({ color: 0x999999, linewidth: 2 }));
    islandWireframe.position.y = -1;
    islandGroup.add(islandWireframe);
    
    const beachGeometry = new THREE.BoxGeometry(55, 0.5, 55);
    const beachMaterial = new THREE.MeshLambertMaterial({ color: 0xF5DEB3 });
    const beach = new THREE.Mesh(beachGeometry, beachMaterial);
    beach.position.y = -2;
    beach.receiveShadow = true;
    islandGroup.add(beach);
    
    const beachEdges = new THREE.EdgesGeometry(beachGeometry);
    const beachWireframe = new THREE.LineSegments(beachEdges, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 }));
    beachWireframe.position.y = -2;
    islandGroup.add(beachWireframe);
    
    for (let i = 0; i < 16; i++) {
        let x, z;
        if (i < 4) {
            x = -20 + (i * 20);
            z = 20;
        } else if (i < 8) {
            x = 20;
            z = 20 - ((i - 1) * 10);
        } else if (i < 12) {
            x = 20 - ((i - 8) * 10);
            z = -20;
        } else {
            x = -20;
            z = -20 + ((i - 8) * 10);
        }
        
        x += (Math.random() - 0.5) * 3;
        z += (Math.random() - 0.5) * 3;
        
        const palm = createPalmTree();
        palm.position.set(x, 0, z);
        islandGroup.add(palm);
    }
    
    scene.add(islandGroup);
    
    createIslandRoads();
}

function createPalmTree() {
    const palmGroup = new THREE.Group();
    
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 4);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 2;
    trunk.castShadow = true;
    palmGroup.add(trunk);
    
    const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    for (let i = 0; i < 6; i++) {
        const leafGeometry = new THREE.BoxGeometry(0.2, 2, 0.1);
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        const angle = (i / 6) * Math.PI * 2;
        leaf.position.set(
            Math.cos(angle) * 1.5,
            4.5 + Math.sin(i) * 0.3,
            Math.sin(angle) * 1.5
        );
        leaf.rotation.z = angle;
        leaf.rotation.x = -0.3;
        leaf.castShadow = true;
        palmGroup.add(leaf);
    }
    
    return palmGroup;
}

function createIslandRoads() {
    const roadMaterial = new THREE.MeshLambertMaterial({ color: colors.roads });
    
    for (let i = -20; i <= 20; i += 20) {
        const roadGeometry = new THREE.PlaneGeometry(50, 3);
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.position.set(0, 0.01, i);
        scene.add(road);
        
        const roadEdges = new THREE.EdgesGeometry(roadGeometry);
        const roadWireframe = new THREE.LineSegments(roadEdges, new THREE.LineBasicMaterial({ color: 0xCCCCCC, linewidth: 1 }));
        roadWireframe.rotation.x = -Math.PI / 2;
        roadWireframe.position.set(0, 0.02, i);
        scene.add(roadWireframe);
    }
    
    for (let i = -20; i <= 20; i += 20) {
        const roadGeometry = new THREE.PlaneGeometry(3, 50);
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.position.set(i, 0.01, 0);
        scene.add(road);
        
        const roadEdges = new THREE.EdgesGeometry(roadGeometry);
        const roadWireframe = new THREE.LineSegments(roadEdges, new THREE.LineBasicMaterial({ color: 0xCCCCCC, linewidth: 1 }));
        roadWireframe.rotation.x = -Math.PI / 2;
        roadWireframe.position.set(i, 0.02, 0);
        scene.add(roadWireframe);
    }
}

function createBuilding(x, z, type = 'random') {
    const group = new THREE.Group();
    
    const width = Math.random() * 4 + 2;
    const depth = Math.random() * 4 + 2;
    const height = Math.random() * 8 + 1;
    
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
    const buildingColor = colors.buildings[Math.floor(Math.random() * colors.buildings.length)];
    const buildingMaterial = new THREE.MeshLambertMaterial({ color: buildingColor });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.y = height / 2;
    building.castShadow = true;
    building.receiveShadow = true;
    group.add(building);
    
    if (Math.random() > 0.5) {
        const topWidth = width * 0.7;
        const topDepth = depth * 0.7;
        const topHeight = height * 0.05;
        const topGeometry = new THREE.BoxGeometry(topWidth, topHeight, topDepth);
        const topMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color(buildingColor).multiplyScalar(0.9) 
        });
        const topBuilding = new THREE.Mesh(topGeometry, topMaterial);
        topBuilding.position.y = height + topHeight / 2;
        topBuilding.castShadow = true;
        group.add(topBuilding);
    }
    
    if (Math.random() > 0.3) {
        addWindows(group, building, width, height, depth);
    }
    
    group.position.set(x, 0, z);
    return group;
}

function addWindows(group, building, width, height, depth) {
    const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x87CEEB });
    const windowSize = 0.3;
    const windowDepth = 0.05;
    
    for (let i = 0; i < Math.floor(width / 1.5); i++) {
        for (let j = 0; j < Math.floor(height / 2); j++) {
            if (Math.random() > 0.3) {
                const windowGeometry = new THREE.BoxGeometry(windowSize, windowSize, windowDepth);
                const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
                window1.position.set(
                    -width/2 + (i + 0.5) * 1.5, 
                    j * 2 + 0.5, 
                    depth/2 + windowDepth/2
                );
                group.add(window1);
                
                const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
                window2.position.set(
                    -width/2 + (i + 0.5) * 1.5, 
                    j * 2 + 1, 
                    -depth/2 - windowDepth/2
                );
                group.add(window2);
            }
        }
    }
}

function generateCity() {
    buildings.forEach(building => scene.remove(building));
    buildings = [];
    
    for (let radius = 4; radius < 16; radius += 2) {
        const numBuildings = Math.floor(radius * 0.8);
        for (let i = 0; i < numBuildings; i++) {
            const angle = (i / numBuildings) * Math.PI * 2 + Math.random() * 0.3;
            const r = radius + (Math.random() - 0.5) * 3;
            
            const x = Math.cos(angle) * r;
            const z = Math.sin(angle) * r;
            
            const distanceFromEdge = Math.sqrt(x * x + z * z);
            if (distanceFromEdge > 23) continue;
            
            const building = createBuilding(x, z);
            scene.add(building);
            buildings.push(building);
        }
    }
    
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const r = 3 + Math.random() * 2;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        
        const building = createBuilding(x, z);
        scene.add(building);
        buildings.push(building);
    }
}

function addBuilding() {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 20 + 5;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    
    const distanceFromCenter = Math.sqrt(x * x + z * z);
    if (distanceFromCenter > 25) return;
    
    const building = createBuilding(x, z);
    scene.add(building);
    buildings.push(building);
}

function setupMouseControls() {
    document.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        targetRotation.y = mouse.x * 0.3; 
        targetRotation.x = mouse.y * 0.15; 
    });
}

function resetCamera() {
    camera.position.set(28, 20, 28);
    camera.lookAt(0, 0, 0);
}

function animate() {
    requestAnimationFrame(animate);
    
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
    
    const baseDistance = 78;
    const baseHeight = 25;
    
    camera.position.x = Math.cos(currentRotation.y + Math.PI / 4) * baseDistance;
    camera.position.z = Math.sin(currentRotation.y + Math.PI / 4) * baseDistance;
    camera.position.y = baseHeight + currentRotation.x * 10;
    
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
}

function handleResize() {
    const aspect = window.innerWidth / window.innerHeight;
    const d = 20;
    camera.left = -d * aspect;
    camera.right = d * aspect;
    camera.top = d;
    camera.bottom = -d;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function createQuestPanels() {
    questsData.forEach(quest => {
        const panel = document.createElement('div');
        panel.className = 'quest-panel';
        panel.dataset.questId = quest.id;
        
        const completedTasks = quest.tasks.filter(task => task.completed).length;
        const totalTasks = quest.tasks.length;
        const progress = (completedTasks / totalTasks) * 100;
        
        panel.innerHTML = `
            <h3>${quest.title}</h3>
            <p>${quest.description}</p>
            <div class="quest-progress">
                <div class="quest-progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="quest-stats">
                <span>${completedTasks}/${totalTasks} tasks</span>
                <span>${Math.round(progress)}%</span>
            </div>
        `;
        
        panel.addEventListener('click', () => openQuestModal(quest));
        
        document.getElementById('container').appendChild(panel);
        questPanels.push({
            element: panel,
            worldPosition: quest.position,
            quest: quest
        });
    });
}

function updateQuestPanelPositions() {
    questPanels.forEach(({ element, worldPosition }) => {
        const vector = new THREE.Vector3(worldPosition.x, 2, worldPosition.z);
        vector.project(camera);
        
        const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
        const y = (vector.y * -0.5 + 0.5) * renderer.domElement.clientHeight;
        
        if (vector.z < 1) {
            element.style.left = `${x - 100}px`;
            element.style.top = `${y - 60}px`;
            element.style.display = 'block';
            element.style.opacity = Math.max(0.3, 1 - vector.z);
        } else {
            element.style.display = 'none';
        }
    });
}

function openQuestModal(quest) {
    const modal = document.getElementById('questModal');
    const questTitle = document.getElementById('questTitle');
    const questDescription = document.getElementById('questDescription');
    const tasksList = document.getElementById('tasksList');
    
    questTitle.textContent = quest.title;
    questDescription.textContent = quest.description;
    
    tasksList.innerHTML = '';
    quest.tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'task-completed' : ''}`;
        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} disabled>
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-description">${task.description}</div>
            </div>
        `;
        tasksList.appendChild(taskElement);
    });
    
    modal.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('questModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    const addQuestBtn = document.querySelector('.controls-button:first-child');
    const deleteQuestBtn = document.querySelector('.controls-button:nth-child(2)');
    
    if (addQuestBtn) {
        addQuestBtn.addEventListener('click', () => {
            console.log('Add quest clicked');
        });
    }
    
    if (deleteQuestBtn) {
        deleteQuestBtn.addEventListener('click', () => {
            console.log('Delete quest clicked');
        });
    }
});

function animate() {
    requestAnimationFrame(animate);
    
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
    
    const baseDistance = 78;
    const baseHeight = 25;
    
    camera.position.x = Math.cos(currentRotation.y + Math.PI / 4) * baseDistance;
    camera.position.z = Math.sin(currentRotation.y + Math.PI / 4) * baseDistance;
    camera.position.y = baseHeight + currentRotation.x * 10;
    
    camera.lookAt(0, 0, 0);
    
    updateQuestPanelPositions();
    
    renderer.render(scene, camera);
}

window.addEventListener('resize', handleResize);

init();