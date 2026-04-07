const themeToggle = document.querySelector('#theme-toggle');
const body = document.body;

// Theme toggle logic
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '라이트 모드 | Light Mode';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    themeToggle.textContent = isDarkMode ? '라이트 모드 | Light Mode' : '다크 모드 | Dark Mode';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

// Teachable Machine Logic
const URL = "https://teachablemachine.withgoogle.com/models/2dXOgxTyj/";
let model, webcam, maxPredictions;
let isWebcamMode = false;

const startBtn = document.getElementById('start-btn');
const uploadInput = document.getElementById('upload-input');
const webcamContainer = document.getElementById('webcam-container');
const uploadedImage = document.getElementById('uploaded-image');
const labelContainer = document.getElementById('label-container');
const resetBtn = document.getElementById('reset-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const buttonGroup = document.querySelector('.button-group');

// Load the model
async function loadModel() {
    if (model) return;
    loadingSpinner.style.display = 'block';
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    loadingSpinner.style.display = 'none';
}

// Initialize Webcam
async function initWebcam() {
    await loadModel();
    buttonGroup.style.display = 'none';
    resetBtn.style.display = 'inline-block';
    isWebcamMode = true;

    const flip = true; 
    webcam = new tmImage.Webcam(280, 280, flip); 
    await webcam.setup(); 
    await webcam.play();
    window.requestAnimationFrame(loop);

    webcamContainer.appendChild(webcam.canvas);
    webcamContainer.style.display = 'block';
    uploadedImage.style.display = 'none';
}

async function loop() {
    if (!isWebcamMode) return;
    webcam.update();
    await predict(webcam.canvas);
    window.requestAnimationFrame(loop);
}

// Handle File Upload
uploadInput.addEventListener('change', async (e) => {
    if (e.target.files && e.target.files[0]) {
        await loadModel();
        buttonGroup.style.display = 'none';
        resetBtn.style.display = 'inline-block';
        isWebcamMode = false;

        const reader = new FileReader();
        reader.onload = async (event) => {
            uploadedImage.src = event.target.result;
            uploadedImage.style.display = 'block';
            webcamContainer.style.display = 'none';
            
            // Wait for image to load before predicting
            uploadedImage.onload = async () => {
                await predict(uploadedImage);
            };
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

// Run Prediction
async function predict(imageElement) {
    const prediction = await model.predict(imageElement);
    
    labelContainer.innerHTML = '';
    
    // Find the highest prediction for a special message
    let highest = { className: '', probability: 0 };
    
    for (let i = 0; i < maxPredictions; i++) {
        const p = prediction[i];
        if (p.probability > highest.probability) {
            highest = p;
        }

        let className = "";
        let colorClass = "";
        
        switch(p.className) {
            case "Dog":
                className = "강아지상 (Dog)";
                colorClass = "bar-dog";
                break;
            case "Cat":
                className = "고양이상 (Cat)";
                colorClass = "bar-cat";
                break;
            case "Bear":
                className = "곰상 (Bear)";
                colorClass = "bar-bear";
                break;
            case "Fox":
                className = "여우상 (Fox)";
                colorClass = "bar-fox";
                break;
            default:
                className = p.className;
                colorClass = "bar-default";
        }

        const probPercentage = (p.probability * 100).toFixed(0);

        const row = document.createElement('div');
        row.className = 'prediction-row';
        row.innerHTML = `
            <span class="label-text">${className}</span>
            <div class="progress-container">
                <div class="progress-bar ${colorClass}" style="width: ${probPercentage}%">
                    ${probPercentage}%
                </div>
            </div>
        `;
        labelContainer.appendChild(row);
    }

    // Add a result message if it's high enough
    if (highest.probability > 0.5 && !isWebcamMode) {
        const message = document.createElement('h3');
        message.style.marginTop = '20px';
        
        let animalEmoji = "";
        let animalText = "";

        switch(highest.className) {
            case "Dog": animalEmoji = "🐶"; animalText = "강아지"; break;
            case "Cat": animalEmoji = "🐱"; animalText = "고양이"; break;
            case "Bear": animalEmoji = "🐻"; animalText = "곰"; break;
            case "Fox": animalEmoji = "🦊"; animalText = "여우"; break;
            default: animalEmoji = "❓"; animalText = highest.className;
        }

        message.innerText = `${animalEmoji} 당신은 ${animalText}상입니다!`;
        labelContainer.prepend(message);
    }
}

// Reset Function
resetBtn.addEventListener('click', () => {
    isWebcamMode = false;
    if (webcam) {
        webcam.stop();
        webcamContainer.innerHTML = '';
    }
    webcamContainer.style.display = 'none';
    uploadedImage.style.display = 'none';
    labelContainer.innerHTML = '';
    resetBtn.style.display = 'none';
    buttonGroup.style.display = 'flex';
    uploadInput.value = '';
});

startBtn.addEventListener('click', initWebcam);
