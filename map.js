let scene, camera, renderer, buildings = [], island;
let mouse = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };
let currentRotation = { x: 0, y: 0 };
let memberPanels = [];
let panelContainer;

// Sample team data lang muna toh
const teamMembers = [
    {
        id: 1,
        name: "You",
        role: "UI/UX Designer",
        class: "Tactician",
        level: 15,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        isCurrentUser: true,
        position: { x: -7, y: 3, z: 15 }
    },
    {
        id: 2,
        name: "Alex Rodriguez",
        role: "Developer",
        class: "Strategist",
        level: 18,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        isCurrentUser: false,
        position: { x: 2, y: 6, z: -7 }
    },
    {
        id: 3,
        name: "Emma Johnson",
        role: "Researcher",
        class: "Scholar",
        level: 12,
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        isCurrentUser: false,
        position: { x: -1, y: -2, z: 7 }
    },
    {
        id: 4,
        name: "Mike Thompson",
        role: "Product Manager",
        class: "Tactician",
        level: 16,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        isCurrentUser: false,
        position: { x: 20, y: 7, z: -4 }
    }
];

const colors = {
    buildings: [
        0xFFE5B4, 
        0xFFD1DC, 
        0xE0E6FF, 
        0xD4FFAA, 
        0xFFF2CC, 
        0xFFCCCC, 
        0xCCE5FF, 
        0xE6CCFF, 
        0xFFE0CC, 
        0xCCFFCC  
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

    createMemberPanels();
    
    setupMouseControls();

    animate();
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

function createMemberPanels() {
    panelContainer = document.createElement('div');
    panelContainer.style.position = 'absolute';
    panelContainer.style.top = '0';
    panelContainer.style.left = '0';
    panelContainer.style.width = '100%';
    panelContainer.style.height = '100%';
    panelContainer.style.pointerEvents = 'none';
    panelContainer.style.zIndex = '10';
    
    document.getElementById('container').appendChild(panelContainer);

    teamMembers.forEach(member => {
        const panel = createMemberPanel(member);
        panelContainer.appendChild(panel);
        memberPanels.push({
            element: panel,
            member: member,
            worldPosition: new THREE.Vector3(member.position.x, member.position.y, member.position.z)
        });
    });
}

function createMemberPanel(member) {
    const panel = document.createElement('div');
    panel.className = `member-panel ${member.isCurrentUser ? 'current-user' : ''}`;
    panel.style.cssText = `
        position: absolute;
        background: ${member.isCurrentUser ? 'linear-gradient(135deg, #ff6b9d, #e55a87)' : 'rgba(255, 255, 255, 0.95)'};
        backdrop-filter: blur(10px);
        border-radius: 15px;
        padding: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        border: ${member.isCurrentUser ? '2px solid #ffd700' : '1px solid rgba(255, 107, 157, 0.2)'};
        min-width: 200px;
        transition: all 0.3s ease;
        pointer-events: auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: ${member.isCurrentUser ? '#fff' : '#333'};
        transform: translateX(-50%) translateY(-100%);
    `;

    const classColors = {
        'Tactician': '#ff6b9d',
        'Strategist': '#9b59b6',
        'Scholar': '#3498db',
        'Leader': '#f39c12'
    };

    panel.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <div style="
                width: 40px; 
                height: 40px; 
                border-radius: 50%; 
                background-image: url('${member.avatar}'); 
                background-size: cover; 
                background-position: center;
                border: 2px solid ${member.isCurrentUser ? '#ffd700' : '#fff'};
                flex-shrink: 0;
            "></div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; font-size: 14px; margin-bottom: 2px; display: flex; align-items: center; gap: 6px;">
                    ${member.name}
                    ${member.isCurrentUser ? '<span style="background: #ffd700; color: #333; padding: 2px 6px; border-radius: 8px; font-size: 10px; font-weight: 700;">YOU</span>' : ''}
                </div>
                <div style="font-size: 12px; opacity: 0.8;">
                    ${member.role}
                </div>
            </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
            <div style="
                background: ${classColors[member.class] || '#666'}; 
                color: white; 
                padding: 4px 8px; 
                border-radius: 12px; 
                font-size: 10px; 
                font-weight: 600;
                text-transform: uppercase;
            ">
                ${member.class}
            </div>
            <div style="
                background: ${member.isCurrentUser ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 107, 157, 0.1)'}; 
                padding: 4px 8px; 
                border-radius: 12px; 
                font-size: 12px; 
                font-weight: 600;
                color: ${member.isCurrentUser ? '#fff' : '#ff6b9d'};
            ">
                LVL ${member.level}
            </div>
        </div>
    `;

    panel.addEventListener('mouseenter', () => {
        panel.style.transform = 'translateX(-50%) translateY(-100%) scale(1.05)';
        panel.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.15)';
    });

    panel.addEventListener('mouseleave', () => {
        panel.style.transform = 'translateX(-50%) translateY(-100%) scale(1)';
        panel.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
    });

    return panel;
}

function updateMemberPanels() {
    if (!memberPanels.length) return;

    memberPanels.forEach(panelData => {
        const screenPosition = panelData.worldPosition.clone();
        screenPosition.project(camera);

        const container = document.getElementById('container');
        const x = (screenPosition.x * 0.5 + 0.5) * container.clientWidth;
        const y = (screenPosition.y * -0.5 + 0.5) * container.clientHeight;

        const isVisible = screenPosition.z < 1 && 
                         x >= -100 && x <= container.clientWidth + 100 && 
                         y >= -100 && y <= container.clientHeight + 100;

        if (isVisible) {
            panelData.element.style.left = x + 'px';
            panelData.element.style.top = y + 'px';
            panelData.element.style.opacity = '1';
            panelData.element.style.pointerEvents = 'auto';
        } else {
            panelData.element.style.opacity = '0';
            panelData.element.style.pointerEvents = 'none';
        }
    });
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

    updateMemberPanels();
    
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
    if (memberPanels.length > 0) {
        updateMemberPanels();
    }
}

window.addEventListener('resize', handleResize);

init();