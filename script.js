// Global variables
let workoutData = [];
let currentWorkout = null;
let workoutHistory = JSON.parse(localStorage.getItem('workoutHistory')) || [];

// DOM Elements
const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('upload-area');
const fileInfo = document.getElementById('file-info');
const fileName = document.getElementById('file-name');
const clearFileBtn = document.getElementById('clear-file');
const uploadSection = document.getElementById('upload-section');
const workoutSection = document.getElementById('workout-section');
const workoutSelect = document.getElementById('workout-select');
const startWorkoutBtn = document.getElementById('start-workout');
const currentWorkoutSection = document.getElementById('current-workout');
const currentWorkoutName = document.getElementById('current-workout-name');
const exerciseList = document.getElementById('exercise-list');
const saveWorkoutBtn = document.getElementById('save-workout');
const finishWorkoutBtn = document.getElementById('finish-workout');
const historyList = document.getElementById('history-list');
const exportDataBtn = document.getElementById('export-data');
const clearHistoryBtn = document.getElementById('clear-history');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    displayWorkoutHistory();
    
    // Check if there's saved workout data
    const savedData = localStorage.getItem('workoutData');
    if (savedData) {
        workoutData = JSON.parse(savedData);
        populateWorkoutSelector();
        showWorkoutSection();
    }
});

// Event Listeners
function setupEventListeners() {
    // File upload
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);
    clearFileBtn.addEventListener('click', clearFile);
    
    // Workout selection
    workoutSelect.addEventListener('change', handleWorkoutSelection);
    startWorkoutBtn.addEventListener('click', startWorkout);
    
    // Workout controls
    saveWorkoutBtn.addEventListener('click', saveCurrentWorkout);
    finishWorkoutBtn.addEventListener('click', finishWorkout);
    
    // History controls
    exportDataBtn.addEventListener('click', exportWorkoutData);
    clearHistoryBtn.addEventListener('click', clearAllHistory);
}

// File handling
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.style.backgroundColor = '#f0f2ff';
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.style.backgroundColor = '#f8f9ff';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

function processFile(file) {
    const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
        showToast('Please upload a CSV or Excel file', 'error');
        return;
    }
    
    fileName.textContent = file.name;
    fileInfo.style.display = 'flex';
    uploadArea.style.display = 'none';
    
    const reader = new FileReader();
    
    if (file.name.toLowerCase().endsWith('.csv')) {
        reader.onload = function(e) {
            parseCSV(e.target.result);
        };
        reader.readAsText(file);
    } else {
        reader.onload = function(e) {
            parseExcel(e.target.result);
        };
        reader.readAsArrayBuffer(file);
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    workoutData = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            workoutData.push(row);
        }
    }
    
    processWorkoutData();
}

function parseExcel(arrayBuffer) {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);
    
    workoutData = jsonData;
    processWorkoutData();
}

function processWorkoutData() {
    if (workoutData.length === 0) {
        showToast('No data found in the file', 'error');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('workoutData', JSON.stringify(workoutData));
    
    populateWorkoutSelector();
    showWorkoutSection();
    showToast('Workout plan loaded successfully!', 'success');
}

function populateWorkoutSelector() {
    // Get unique workout names/days
    const workoutNames = [...new Set(workoutData.map(row => {
        // Try common column names for workout identification
        return row.Workout || row.Day || row.Exercise || row.workout || row.day || row.exercise || 'Workout';
    }))];
    
    workoutSelect.innerHTML = '<option value="">Choose a workout...</option>';
    
    workoutNames.forEach(name => {
        if (name && name.trim()) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            workoutSelect.appendChild(option);
        }
    });
}

function showWorkoutSection() {
    workoutSection.style.display = 'block';
}

function handleWorkoutSelection() {
    startWorkoutBtn.disabled = !workoutSelect.value;
}

function startWorkout() {
    const selectedWorkout = workoutSelect.value;
    if (!selectedWorkout) return;
    
    // Filter exercises for the selected workout
    const workoutExercises = workoutData.filter(row => {
        return (row.Workout || row.Day || row.Exercise || row.workout || row.day || row.exercise) === selectedWorkout;
    });
    
    if (workoutExercises.length === 0) {
        // If no matching workout found, use all data
        currentWorkout = {
            name: selectedWorkout,
            exercises: workoutData.map((row, index) => ({ ...row, id: index })),
            startTime: new Date(),
            completed: {}
        };
    } else {
        currentWorkout = {
            name: selectedWorkout,
            exercises: workoutExercises.map((row, index) => ({ ...row, id: index })),
            startTime: new Date(),
            completed: {}
        };
    }
    
    renderCurrentWorkout();
    currentWorkoutSection.style.display = 'block';
    currentWorkoutName.textContent = selectedWorkout;
    
    // Scroll to current workout
    currentWorkoutSection.scrollIntoView({ behavior: 'smooth' });
}

function renderCurrentWorkout() {
    exerciseList.innerHTML = '';
    
    currentWorkout.exercises.forEach((exercise, index) => {
        const exerciseDiv = document.createElement('div');
        exerciseDiv.className = 'exercise-item';
        exerciseDiv.dataset.exerciseId = exercise.id;
        
        // Get exercise name
        const exerciseName = exercise.Exercise || exercise.exercise || exercise.Name || exercise.name || `Exercise ${index + 1}`;
        
        exerciseDiv.innerHTML = `
            <div class="exercise-header">
                <i class="fas fa-dumbbell"></i>
                ${exerciseName}
            </div>
            <div class="exercise-inputs">
                ${generateInputFields(exercise)}
            </div>
        `;
        
        exerciseList.appendChild(exerciseDiv);
    });
}

function generateInputFields(exercise) {
    const excludeFields = ['Exercise', 'exercise', 'Name', 'name', 'Workout', 'workout', 'Day', 'day'];
    const fields = Object.keys(exercise).filter(key => !excludeFields.includes(key));
    
    return fields.map(field => {
        const savedValue = currentWorkout.completed[exercise.id]?.[field] || '';
        return `
            <div class="input-group">
                <label for="${exercise.id}-${field}">${field}</label>
                <input 
                    type="text" 
                    id="${exercise.id}-${field}" 
                    placeholder="${exercise[field] || ''}"
                    value="${savedValue}"
                    data-exercise-id="${exercise.id}"
                    data-field="${field}"
                >
            </div>
        `;
    }).join('');
}

function saveCurrentWorkout() {
    if (!currentWorkout) return;
    
    // Collect all input values
    const inputs = document.querySelectorAll('#exercise-list input');
    inputs.forEach(input => {
        const exerciseId = input.dataset.exerciseId;
        const field = input.dataset.field;
        const value = input.value;
        
        if (!currentWorkout.completed[exerciseId]) {
            currentWorkout.completed[exerciseId] = {};
        }
        currentWorkout.completed[exerciseId][field] = value;
    });
    
    // Save to localStorage
    localStorage.setItem('currentWorkout', JSON.stringify(currentWorkout));
    showToast('Workout progress saved!', 'success');
}

function finishWorkout() {
    if (!currentWorkout) return;
    
    // Save current input values
    saveCurrentWorkout();
    
    // Add to history
    const completedWorkout = {
        ...currentWorkout,
        endTime: new Date(),
        date: new Date().toLocaleDateString()
    };
    
    workoutHistory.unshift(completedWorkout);
    localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
    
    // Clear current workout
    currentWorkout = null;
    localStorage.removeItem('currentWorkout');
    currentWorkoutSection.style.display = 'none';
    
    displayWorkoutHistory();
    showToast('Workout completed! 🎉', 'success');
}

function displayWorkoutHistory() {
    if (workoutHistory.length === 0) {
        historyList.innerHTML = '<p class="empty-state">No workouts completed yet</p>';
        return;
    }
    
    historyList.innerHTML = workoutHistory.map(workout => {
        const duration = new Date(workout.endTime) - new Date(workout.startTime);
        const minutes = Math.round(duration / 60000);
        
        const completedExercises = Object.keys(workout.completed).length;
        const totalExercises = workout.exercises.length;
        
        return `
            <div class="history-item">
                <div class="history-date">${workout.date}</div>
                <div class="history-workout">${workout.name}</div>
                <div class="history-exercises">
                    ${completedExercises}/${totalExercises} exercises completed • ${minutes} minutes
                </div>
            </div>
        `;
    }).join('');
}

function exportWorkoutData() {
    if (workoutHistory.length === 0) {
        showToast('No workout data to export', 'warning');
        return;
    }
    
    // Prepare data for export
    const exportData = [];
    
    workoutHistory.forEach(workout => {
        workout.exercises.forEach(exercise => {
            const completed = workout.completed[exercise.id] || {};
            const row = {
                Date: workout.date,
                Workout: workout.name,
                Exercise: exercise.Exercise || exercise.exercise || exercise.Name || exercise.name || 'Unknown',
                ...completed
            };
            exportData.push(row);
        });
    });
    
    // Convert to CSV
    const headers = Object.keys(exportData[0]);
    const csvContent = [
        headers.join(','),
        ...exportData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showToast('Workout data exported!', 'success');
}

function clearAllHistory() {
    if (confirm('Are you sure you want to clear all workout history? This cannot be undone.')) {
        workoutHistory = [];
        localStorage.removeItem('workoutHistory');
        displayWorkoutHistory();
        showToast('Workout history cleared', 'success');
    }
}

function clearFile() {
    fileInput.value = '';
    fileInfo.style.display = 'none';
    uploadArea.style.display = 'block';
    workoutSection.style.display = 'none';
    currentWorkoutSection.style.display = 'none';
    
    // Clear stored data
    localStorage.removeItem('workoutData');
    localStorage.removeItem('currentWorkout');
    workoutData = [];
    currentWorkout = null;
    
    showToast('File cleared', 'success');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    const container = document.getElementById('toast-container');
    container.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Auto-save current workout inputs
document.addEventListener('input', function(e) {
    if (e.target.matches('#exercise-list input') && currentWorkout) {
        // Debounce auto-save
        clearTimeout(window.autoSaveTimeout);
        window.autoSaveTimeout = setTimeout(() => {
            saveCurrentWorkout();
        }, 1000);
    }
});

// Load current workout on page refresh
window.addEventListener('load', function() {
    const savedCurrentWorkout = localStorage.getItem('currentWorkout');
    if (savedCurrentWorkout) {
        currentWorkout = JSON.parse(savedCurrentWorkout);
        renderCurrentWorkout();
        currentWorkoutSection.style.display = 'block';
        currentWorkoutName.textContent = currentWorkout.name;
    }
});