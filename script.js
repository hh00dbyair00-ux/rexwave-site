// #rexwave — биты, цены, демо + добавление
// Данные хранятся в localStorage

// ---------------------- ПРОДЮСЕРЫ -------------------------
const producersData = [
{ id: "damns0ld", name: "damns0ld", tgChannel: "[https://t.me/prodbys0ld](https://t.me/prodbys0ld)", tgPM: "[https://t.me/gohards0ld](https://t.me/gohards0ld)", youtube: "[https://youtube.com/@prodbys0ld](https://youtube.com/@prodbys0ld)", tiktok: "[https://www.tiktok.com/@prodbys0ld](https://www.tiktok.com/@prodbys0ld)", instagram: "[https://www.instagram.com/gohards0ld](https://www.instagram.com/gohards0ld)" },
{ id: "rizer", name: "rizer", tgChannel: "[https://t.me/rizerbeats](https://t.me/rizerbeats)", tgPM: "[https://t.me/Rizer01](https://t.me/Rizer01)", youtube: "", tiktok: "", instagram: "" },
{ id: "hba", name: "hba", tgChannel: "[https://t.me/pr0d1hba](https://t.me/pr0d1hba)", tgPM: "", youtube: "", tiktok: "", instagram: "" }
];

// Стартовые биты (демо, без аудиофайлов — будет синтез)
const defaultBeats = [
{ id: "b1", producerId: "damns0ld", title: "Dark Trap", price: 30, audioData: null },
{ id: "b2", producerId: "damns0ld", title: "Phonk Night", price: 45, audioData: null },
{ id: "b3", producerId: "rizer", title: "Melodic Drill", price: 55, audioData: null },
{ id: "b4", producerId: "rizer", title: "Rage Beat", price: 40, audioData: null },
{ id: "b5", producerId: "hba", title: "Plugg Type", price: 35, audioData: null },
{ id: "b6", producerId: "hba", title: "Jersey Club", price: 50, audioData: null }
];

let beats = [];

// Загрузка/сохранение в localStorage
function loadBeats() {
const stored = localStorage.getItem("rexwave_beats");
if (stored) {
beats = JSON.parse(stored);
} else {
beats = [...defaultBeats];
saveBeats();
}
}

function saveBeats() {
localStorage.setItem("rexwave_beats", JSON.stringify(beats));
}

// Генерация короткого звука через Web Audio (демо-бит)
function playDemoBeat(beatTitle) {
const AudioContext = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioContext();
const now = ctx.currentTime;

// Простой ритм-паттерн на основе названия
const oscillator = ctx.createOscillator();
const gain = ctx.createGain();
oscillator.connect(gain);
gain.connect(ctx.destination);
oscillator.type = "sine";

let freq = 220; // базовая частота
if (beatTitle.toLowerCase().includes("trap")) freq = 180;
else if (beatTitle.toLowerCase().includes("drill")) freq = 200;
else if (beatTitle.toLowerCase().includes("rage")) freq = 260;
else if (beatTitle.toLowerCase().includes("plugg")) freq = 240;
else freq = 220 + (beatTitle.length % 50);

oscillator.frequency.value = freq;
gain.gain.setValueAtTime(0.3, now);
gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
oscillator.start();
oscillator.stop(now + 1.2);

// Добавим короткий шум (удар)
const noise = ctx.createBufferSource();
const bufferSize = 4096;
const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
const data = buffer.getChannelData(0);
for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
noise.buffer = buffer;
const noiseGain = ctx.createGain();
noise.connect(noiseGain);
noiseGain.connect(ctx.destination);
noiseGain.gain.setValueAtTime(0.15, now);
noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
noise.start();
noise.stop(now + 0.3);
}

// Воспроизведение загруженного аудио (base64)
function playAudioFromBase64(base64String, mimeType = "audio/mpeg") {
const audio = new Audio(base64String);
audio.play().catch(e => console.warn("Audio play failed", e));
}

// Добавление бита
function addBeat(producerId, title, price, audioBase64 = null) {
if (!producerId || !title || !price) return false;
const newBeat = {
id: Date.now() + "-" + Math.random().toString(36),
producerId,
title,
price: Number(price),
audioData: audioBase64 || null
};
beats.push(newBeat);
saveBeats();
renderProducers();
return true;
}

// Удаление бита
function deleteBeat(beatId) {
beats = beats.filter(b => b.id !== beatId);
saveBeats();
renderProducers();
}

// Рендер всех продюсеров и их битов
function renderProducers() {
const container = document.getElementById("producersContainer");
if (!container) return;

container.innerHTML = "";

producersData.forEach(producer => {
const producerBeats = beats.filter(b => b.producerId === producer.id);

const card = document.createElement("div");
card.className = "producer-card";

// Шапка с телеграм и соцсетями
const tgRow = `
            <div class="tg-row">
                <a href="${producer.tgChannel}" target="_blank" class="tg-channel">
                    <svg class="tg-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 4.5L2 11.3l6.5 2.5 4 7 2.5-5 5.5 3.5 3-12.8z"/><path d="M8.5 13.8L12 17l2-4"/></svg>
                    ${producer.name}
                </a>
                ${producer.tgPM ? `<span class="tg-sep"> / </span><a href="${producer.tgPM}" target="_blank" class="tg-pm"><svg class="tg-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 4.5L2 11.3l6.5 2.5 4 7 2.5-5 5.5 3.5 3-12.8z"/><path d="M8.5 13.8L12 17l2-4"/></svg>лс тг</a>` : ''}
            </div>
        `;
let socialHtml = '<div class="social-icons">';
if (producer.youtube) socialHtml += `<a href="${producer.youtube}" target="_blank" class="social-link"><svg class="social-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg><span class="social-text">YouTube</span></a>`;
if (producer.tiktok) socialHtml += `<a href="${producer.tiktok}" target="_blank" class="social-link"><svg class="social-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19.589 6.686a4.493 4.493 0 0 1-3.98-2.288c-.192-.34-.3-.72-.3-1.124h-2.76v13.18c0 1.572-1.274 2.846-2.846 2.846a2.84 2.84 0 0 1-2.382-1.208 2.853 2.853 0 0 1-.464-1.528c0-1.57 1.274-2.845 2.846-2.845.296 0 .586.045.86.127v-2.78a5.595 5.595 0 0 0-3.86 1.482 5.593 5.593 0 0 0-1.846 4.016 5.578 5.578 0 0 0 1.614 4.01 5.617 5.617 0 0 0 4.016 1.614c3.112 0 5.644-2.532 5.644-5.644V7.48c.99.71 2.17 1.126 3.46 1.126V6.686z"/></svg><span class="social-text">TikTok</span></a>`;
if (producer.instagram) socialHtml += `<a href="${producer.instagram}" target="_blank" class="social-link"><svg class="social-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.31.975.975 1.248 2.242 1.31 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.31 3.608-.975.975-2.242 1.248-3.608 1.31-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.31-.975-.975-1.248-2.242-1.31-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.31-3.608.975-.975 2.242-1.248 3.608-1.31 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.332.014 7.052.072 5.197.156 3.636.468 2.413 1.691.691 3.413.437 5.093.36 7.052.286 8.332.272 8.741.272 12s.014 3.668.072 4.948c.078 1.959.33 3.639 2.053 5.362 1.723 1.723 3.403 1.975 5.362 2.053 1.28.058 1.689.072 4.948.072s3.668-.014 4.948-.072c1.959-.078 3.639-.33 5.362-2.053 1.723-1.723 1.975-3.403 2.053-5.362.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.078-1.959-.33-3.639-2.053-5.362C20.364.468 18.684.216 16.725.138 15.445.06 15.036.047 11.773.047L12 0z"/></svg><span class="social-text">Instagram</span></a>`;
socialHtml += '</div>';

// Список битов
let beatsHtml = `<div class="beats-list">`;
if (producerBeats.length === 0) {
beatsHtml += `<div class="no-beats">🎵 У этого продюсера пока нет битов</div>`;
} else {
producerBeats.forEach(beat => {
beatsHtml += `
                    <div class="beat-item" data-beat-id="${beat.id}">
                        <div class="beat-info">
                            <span class="beat-title">${escapeHtml(beat.title)}</span>
                            <span class="beat-price">💰 ${beat.price}$</span>
                        </div>
                        <div class="beat-actions">
                            <button class="preview-btn" data-beat-id="${beat.id}">🎧 Preview</button>
                            <button class="delete-beat" data-beat-id="${beat.id}">🗑️ Удалить</button>
                        </div>
                    </div>
                `;
            });
        }
        beatsHtml += `</div>`;
card.innerHTML = tgRow + socialHtml + beatsHtml;
container.appendChild(card);
});

// Навешиваем события на все кнопки preview/delete
document.querySelectorAll('.preview-btn').forEach(btn => {
btn.removeEventListener('click', previewHandler);
btn.addEventListener('click', previewHandler);
});
document.querySelectorAll('.delete-beat').forEach(btn => {
btn.removeEventListener('click', deleteHandler);
btn.addEventListener('click', deleteHandler);
});
}

function previewHandler(e) {
const beatId = e.currentTarget.getAttribute('data-beat-id');
const beat = beats.find(b => b.id === beatId);
if (beat) {
if (beat.audioData && beat.audioData.startsWith('data:audio')) {
playAudioFromBase64(beat.audioData);
} else {
playDemoBeat(beat.title);
}
}
}

function deleteHandler(e) {
const beatId = e.currentTarget.getAttribute('data-beat-id');
if (confirm('Удалить этот бит?')) {
deleteBeat(beatId);
}
}

function escapeHtml(str) {
return str.replace(/[&<>]/g, function(m) {
if (m === '&') return '&';
if (m === '<') return '<';
if (m === '>') return '>';
return m;
});
}

// Заполнение select продюсеров в форме
function populateProducerSelect() {
const select = document.getElementById("beatProducer");
if (!select) return;
select.innerHTML = '<option value="">Выбери продюсера</option>';
producersData.forEach(prod => {
const option = document.createElement("option");
option.value = prod.id;
option.textContent = [prod.name](https://prod.name);
select.appendChild(option);
});
}

// Обработчик добавления бита (с аудиофайлом)
async function handleAddBeat() {
const producerId = document.getElementById("beatProducer").value;
const title = document.getElementById("beatTitle").value.trim();
const price = document.getElementById("beatPrice").value;
const audioFile = document.getElementById("beatAudio").files[0];

if (!producerId || !title || !price) {
alert("Заполни продюсера, название и цену!");
return;
}

let audioBase64 = null;
if (audioFile) {
try {
audioBase64 = await fileToBase64(audioFile);
} catch (err) {
console.error("Ошибка чтения файла", err);
alert("Не удалось прочитать аудиофайл");
return;
}
}

if (addBeat(producerId, title, price, audioBase64)) {
// Очищаем форму
document.getElementById("beatTitle").value = "";
document.getElementById("beatPrice").value = "";
document.getElementById("beatAudio").value = "";
alert("Бит добавлен! 🎉");
} else {
alert("Ошибка добавления");
}
}

function fileToBase64(file) {
return new Promise((resolve, reject) => {
const reader = new FileReader();
reader.onload = () => resolve(reader.result);
reader.onerror = reject;
reader.readAsDataURL(file);
});
}

// Инициализация и визуализатор
const bars = document.querySelectorAll('.bar');
function randomHue() { return Math.floor(Math.random() * 360); }
function updateBars() {
for (const bar of bars) {
const height = Math.floor(Math.random() * 38) + 6;
bar.style.height = `${height}px`;
const hue = randomHue();
const color = `hsl(${hue}, 85%, 65%)`;
bar.style.background = color;
bar.style.boxShadow = `0 0 10px ${color}`;
}
requestAnimationFrame(() => setTimeout(updateBars, 120));
}

// Старт
document.addEventListener("DOMContentLoaded", () => {
loadBeats();
populateProducerSelect();
renderProducers();

const addBtn = document.getElementById("addBeatBtn");
if (addBtn) addBtn.addEventListener("click", handleAddBeat);

if (bars.length) updateBars();
});