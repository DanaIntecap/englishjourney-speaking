let data = [];
let questions = [];
let current = null;
let recognition = null;
let isRecording = false;
let availableVoices = [];

fetch("questions.json")
.then(response => response.json())
.then(result => {
    data = result;

    const levels = [...new Set(data.map(x => String(x.level || "").trim()).filter(x => x !== ""))];
    const comboLevel = document.getElementById("level");
    comboLevel.innerHTML = '<option value="ALL">All Levels</option>';
    levels.forEach(level => {
        comboLevel.innerHTML += `<option value="${level}">${level}</option>`;
    });

    const units = [...new Set(data.map(x => String(x.unit || "").trim()).filter(x => x !== ""))];
    const comboUnit = document.getElementById("unit");
    comboUnit.innerHTML = '<option value="ALL">All Units</option>';
    units.forEach(unit => {
        comboUnit.innerHTML += `<option value="${unit}">Unit ${unit}</option>`;
    });

    comboLevel.addEventListener("change", filterQuestions);
    comboUnit.addEventListener("change", filterQuestions);

    filterQuestions();
})
.catch(error => {
    document.getElementById("question").style.display = "block";
    document.getElementById("question").innerHTML = "Error loading questions.json";
    console.error(error);
});

function filterQuestions() {
    const selectedLevel = document.getElementById("level").value;
    const selectedUnit = document.getElementById("unit").value;

    questions = data.filter(x => {
        const matchLevel = (selectedLevel === "ALL") || (String(x.level || "").trim() === selectedLevel);
        const matchUnit = (selectedUnit === "ALL") || (String(x.unit || "").trim() === selectedUnit);
        return matchLevel && matchUnit;
    });

    shuffle(questions);
    nextQuestion();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function nextQuestion() {
    if (questions.length === 0) {
        document.getElementById("question").style.display = "block";
        document.getElementById("question").innerHTML = "<b>No questions match the selected filters.</b>";
        document.getElementById("questionTranslation").style.display = "none";
        document.getElementById("answer").style.display = "none";
        document.getElementById("answerTranslation").style.display = "none";
        document.getElementById("reminder").style.display = "none";
        current = null;
        return;
    }

    current = questions.pop();
    document.getElementById("question").style.display = "none";
    document.getElementById("questionTranslation").style.display = "none";
    document.getElementById("answer").style.display = "none";
    document.getElementById("answerTranslation").style.display = "none";
    document.getElementById("reminder").style.display = "none";

    document.getElementById("speechResult").innerHTML = "Your speech will appear here...";
    document.getElementById("expectedAnswer").innerHTML = "";
    document.getElementById("wordCount").innerHTML = "";
}

function loadVoices() {
    availableVoices = speechSynthesis.getVoices();
}

if (typeof speechSynthesis !== "undefined") {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
}

function getVoice() {
    const mode = document.getElementById("accentMode").value;
    const voices = speechSynthesis.getVoices().filter(v => v.lang.startsWith("en"));

    if (voices.length === 0) return null;

    let targetLang = mode;
    if (mode === "mixed") {
        targetLang = Math.random() < 0.5 ? "en-US" : "en-GB";
    }

    const matchedVoices = voices.filter(v => v.lang === targetLang);
    if (matchedVoices.length > 0) {
        return matchedVoices[Math.floor(Math.random() * matchedVoices.length)];
    }
    return voices[0];
}

function speakText(text) {
    if (!text) return;

    if (typeof speechSynthesis === "undefined") {
        alert("Sorry, your browser does not support text to speech.");
        return;
    }

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getVoice();

    if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
    } else {
        utterance.lang = "en-US";
    }

    const speedValue = parseFloat(document.getElementById("speed").value) || 1;
    utterance.rate = speedValue;

    speechSynthesis.speak(utterance);
}

function playQuestion() {
    if (!current) return;
    speakText(current.question);
}

function playAnswer() {
    if (!current) return;
    speakText(current.answer);
}

function showQuestion() {
    if (!current) return;
    const el = document.getElementById("question");
    el.innerHTML = current.question;
    el.style.display = "block";
}

function showQuestionTranslation() {
    if (!current) return;
    const el = document.getElementById("questionTranslation");
    el.innerHTML = current.questionTranslation || "";
    el.style.display = "block";
}

function showAnswer() {
    if (!current) return;
    const el = document.getElementById("answer");
    el.innerHTML = current.answer;
    el.style.display = "block";

    const reminderEl = document.getElementById("reminder");
    if (current.reminder) {
        reminderEl.innerHTML = "💡 " + current.reminder;
        reminderEl.style.display = "block";
    } else {
        reminderEl.style.display = "none";
    }
}

function showAnswerTranslation() {
    if (!current) return;
    const el = document.getElementById("answerTranslation");
    el.innerHTML = current.answerTranslation || "";
    el.style.display = "block";
}

function getSpeechRecognition() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function startRecognition() {
    if (!current) {
        alert("Please select a question first.");
        return;
    }

    const SpeechRecognitionAPI = getSpeechRecognition();
    if (!SpeechRecognitionAPI) {
        alert("Sorry, your browser does not support speech recognition. Try using Google Chrome.");
        return;
    }

    if (isRecording) return;

    recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = "";

    recognition.onstart = function() {
        isRecording = true;
        document.getElementById("recordBtn").disabled = true;
        document.getElementById("recordBtn").classList.add("recording");
        document.getElementById("stopBtn").disabled = false;
        document.getElementById("speechResult").innerHTML = "Listening...";
    };

    recognition.onresult = function(event) {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + " ";
            } else {
                interimTranscript += transcript;
            }
        }
        document.getElementById("speechResult").innerHTML =
            finalTranscript + '<span style="color:#999;">' + interimTranscript + '</span>';
    };

    recognition.onerror = function(event) {
        console.error("Speech recognition error:", event.error);
        document.getElementById("speechResult").innerHTML = "Error: " + event.error + ". Please try again.";
        stopRecognition();
    };

    recognition.onend = function() {
        isRecording = false;
        document.getElementById("recordBtn").disabled = false;
        document.getElementById("recordBtn").classList.remove("recording");
        document.getElementById("stopBtn").disabled = true;

        if (finalTranscript.trim() !== "") {
            compareWithExpectedAnswer(finalTranscript.trim());
        }
    };

    recognition.start();
}

function stopRecognition() {
    if (recognition && isRecording) {
        recognition.stop();
    }
}

function compareWithExpectedAnswer(spokenText) {
    if (!current) return;

    const expectedEl = document.getElementById("expectedAnswer");
    expectedEl.innerHTML = "<strong>Suggested answer:</strong> " + current.answer;

    const spokenWords = spokenText.toLowerCase().replace(/[.,!?]/g, "").split(/\s+/).filter(w => w !== "");
    const expectedWords = current.answer.toLowerCase().replace(/[.,!?]/g, "").split(/\s+/).filter(w => w !== "");

    let matchCount = 0;
    expectedWords.forEach(word => {
        if (spokenWords.includes(word)) {
            matchCount++;
        }
    });

    const percentage = expectedWords.length > 0 ? Math.round((matchCount / expectedWords.length) * 100) : 0;

    document.getElementById("wordCount").innerHTML =
        "Words spoken: " + spokenWords.length + " | Match with suggested answer: " + percentage + "%";
}
