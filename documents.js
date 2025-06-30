let documents = [];

document.getElementById('fileInput').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => addDocument(file));
    e.target.value = ''; 
});

const uploadSection = document.querySelector('.upload-section');

uploadSection.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadSection.style.background = 'rgba(255, 107, 157, 0.2)';
});

uploadSection.addEventListener('dragleave', function(e) {
    e.preventDefault();
    uploadSection.style.background = 'var(--card-background)';
});

uploadSection.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadSection.style.background = 'var(--card-background)';
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => addDocument(file));
});

function addDocument(file) {
    const document = {
        id: Date.now() + Math.random().toString(),
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type || 'unknown',
        uploadDate: new Date().toLocaleDateString(),
        file: file
    };

    documents.push(document);
    renderDocuments();
}

function deleteDocument(id) {
    documents = documents.filter(doc => doc.id !== id);
    renderDocuments();
}

function getFileIcon(fileName, fileType) {
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎥';
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType.includes('pdf')) return '📕';
    if (fileType.includes('word') || extension === 'doc' || extension === 'docx') return '📘';
    if (fileType.includes('excel') || extension === 'xls' || extension === 'xlsx') return '📗';
    if (fileType.includes('powerpoint') || extension === 'ppt' || extension === 'pptx') return '📙';
    if (extension === 'txt') return '📄';
    if (extension === 'zip' || extension === 'rar') return '🗜️';
    
    return '📄';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function renderDocuments() {
    const grid = document.getElementById('documentsGrid');
    const emptyState = document.getElementById('emptyState');

    if (!grid) {
        console.error('documentsGrid element not found');
        return;
    }

    if (documents.length === 0) {
        grid.innerHTML = '';
        if (emptyState) {  
            emptyState.style.display = 'block';
        }
        return;
    }  else {
        if (emptyState) {
            emptyState.style.display = 'none';
        }
    }

    if (emptyState) {  
        emptyState.style.display = 'none';
    }
    
    const documentsHTML = documents.map(doc => `
        <div class="document-panel" onclick="downloadDocument('${doc.id}')">
            <button class="delete-btn" onclick="event.stopPropagation(); deleteDocument('${doc.id}')">&times;</button>
            <div class="document-icon">${getFileIcon(doc.name, doc.type)}</div>
            <div class="document-name">${doc.name}</div>
            <div class="document-info">Uploaded: ${doc.uploadDate}</div>
            <div class="document-size">${doc.size}</div>
        </div>
    `).join('');

    grid.innerHTML = documentsHTML;
}

function downloadDocument(id) {
    const doc = documents.find(d => d.id == id);
    if (doc) {
        const url = URL.createObjectURL(document.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

renderDocuments();