
document.addEventListener('DOMContentLoaded', () => {
const piano = document.querySelector('.piano');

piano.addEventListener('click', (event) => {
const key = event.target;
const note = key.dataset.note;
playSound(note);
key.classList.add('playing');
setTimeout(() => {
    key.classList.remove('playing');
}, 300);
});

document.getElementById('playSequence').addEventListener('click', playSequence);
});

function playSound(note) {
const audio = new Audio(`sounds/${note}.mp3`);
audio.play();

const keyElement = document.querySelector(`.key[data-note="${note}"]`);
if (keyElement) {
keyElement.classList.add('pressed');
setTimeout(() => {
    keyElement.classList.remove('pressed');
}, 100); // Adjust the delay as needed
}
}

function mapKeyToNote(key) {
    switch (key) {
        case 'a': return 'A0';
        case 'w': return 'Ab0';
        case 's': return 'Bb0';
        case 'e': return 'B0';
        case 'd': return 'C1';
        case 'r': return 'Db1';
        case 'f': return 'D1';
        case 't': return 'Eb1';
        case 'g': return 'E1';
        case 'h': return 'F1';
        case 'u': return 'Gb1';
        case 'j': return 'G1';
        case 'i': return 'Ab1';
        case 'k': return 'A1';
        case 'o': return 'Bb1';
        case 'l': return 'B1';
        case 'p': return 'C2';
        case ';': return 'Db2';
        case '[': return 'D2';
        case '\'': return 'Eb2';
        case ']': return 'E2';
        case 'z': return 'F2';
        case 'x': return 'Gb2';
        case 'c': return 'G2';
        case 'v': return 'Ab2';
        case 'b': return 'A2';
        case 'n': return 'Bb2';
        case 'm': return 'B2';
        case ',': return 'C3';
        case '.': return 'Db3';
        case '/': return 'D3';
        case 'q': return 'Eb3';
        case 'y': return 'E3';
        case '2': return 'F3';
        case '4': return 'Gb3';
        case '5': return 'G3';
        case '7': return 'Ab3';
        case '9': return 'A3';
        case '0': return 'Bb3';
        case '-': return 'B3';
        case '=': return 'C4';
        case 't': return 'Db4';
        case 'u': return 'D4';
        case 'i': return 'Eb4';
        case 'o': return 'E4';
        case 'p': return 'F4';
        case 'a': return 'G4';
        case 'b': return 'A4';
        case 'c': return 'Bb4';
        case 'd': return 'B4';
        case 'e': return 'C5';
        case 'f': return 'Db5';
        case 'g': return 'D5';
        case 'h': return 'Eb5';
        case 'i': return 'E5';
        case 'j': return 'F5';
        case 'k': return 'Gb5';
        case 'l': return 'G5';
        case 'm': return 'Ab5';
        case 'n': return 'A5';
        case 'o': return 'Bb5';
        case 'p': return 'B5';
        case 'q': return 'C6';
        case 'r': return 'Db6';
        case 's': return 'D6';
        case 't': return 'Eb6';
        case 'u': return 'E6';
        case 'v': return 'F6';
        case 'w': return 'Gb6';
        case 'x': return 'G6';
        case 'y': return 'Ab6';
        case 'z': return 'A6';
        case '0': return 'Bb6';
        case '1': return 'B6';
        case '2': return 'C7';
        case '3': return 'Db7';
        case '4': return 'D7';
        case '5': return 'Eb7';
        case '6': return 'E7';
        case '7': return 'F7';
        case '8': return 'Gb7';
        case '9': return 'G7';
        case ' ': return 'Ab7';
        default: return null;
    }
}


function playSequence() {
const sequenceInput = document.getElementById('keySequence').value;
const sequences = parseSequence(sequenceInput);

let delay = 0;
sequences.forEach(seq => {
const parts = seq.split(':');
const keys = parts[0].trim();
const customDelay = parts.length > 1 ? parseInt(parts[1]) : 250;

if (keys.length > 1 && keys.startsWith('(') && keys.endsWith(')')) {
    const chords = keys.slice(1, -1).split(',').map(chord => chord.trim());
    setTimeout(() => {
        chords.forEach(chord => {
            playSound(chord);
            const key = document.querySelector(`.key[data-note="${chord}"]`);
            if (key) {
                key.classList.add('playing');
                setTimeout(() => {
                    key.classList.remove('playing');
                }, 300);
            }
        });
    }, delay);
    delay += customDelay; // delay for chords
} else {
    const notes = keys.split(',').map(note => note.trim());
    notes.forEach(note => {
        setTimeout(() => {
            playSound(note);
            const key = document.querySelector(`.key[data-note="${note}"]`);
            if (key) {
                key.classList.add('playing');
                setTimeout(() => {
                    key.classList.remove('playing');
                }, 300);
            }
        }, delay);
        delay += customDelay; // delay for single notes
    });
}
});
}

function parseSequence(sequenceInput) {
const sequences = [];
let currentSequence = '';
let inChord = false;

for (let i = 0; i < sequenceInput.length; i++) {
const char = sequenceInput[i];

if (char === '(') {
    if (currentSequence !== '') {
        sequences.push(currentSequence.trim());
    }
    currentSequence = '(';
    inChord = true;
} else if (char === ')') {
    currentSequence += ')';
    sequences.push(currentSequence.trim());
    currentSequence = '';
    inChord = false;
} else if (char === ',' && inChord) {
    currentSequence += ',';
} else if (char === ',' && !inChord) {
    sequences.push(currentSequence.trim());
    currentSequence = '';
} else if (char === ':') {
    // Custom delay specified
    currentSequence += ':';
} else {
    currentSequence += char;
}
}

if (currentSequence !== '') {
sequences.push(currentSequence.trim());
}

return sequences;
}
