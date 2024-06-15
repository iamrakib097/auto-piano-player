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

function playSound(note, dynamic = 'f') {
    const audio = new Audio(`sounds/${note}.mp3`);
    audio.volume = mapDynamicToVolume(dynamic);
    audio.play();

    const keyElement = document.querySelector(`.key[data-note="${note}"]`);
    if (keyElement) {
        keyElement.classList.add('pressed');
        setTimeout(() => {
            keyElement.classList.remove('pressed');
        }, 100); // Adjust the delay as needed
    }
}

function mapDynamicToVolume(dynamic) {
    switch (dynamic) {
        case 'p':
            return 0.3; // Soft volume
        case 'mf':
            return 0.6; // Medium loud volume
        case 'f':
        default:
            return 1.0; // Default to loud volume
    }
}


function playSequence() {
    const sequenceInput = document.getElementById('keySequence').value;
    const sequences = parseSequence(sequenceInput);

    let cumulativeDelay = 0;
    let currentDynamic = 'f'; // Default dynamic is 'f' (forte)

    sequences.forEach(seq => {
        let [dynamic, keysWithOptionalDelay] = seq.split(':');

        if (dynamic === 'f' || dynamic === 'mf' || dynamic === 'p') {
            currentDynamic = dynamic;
            keysWithOptionalDelay = keysWithOptionalDelay.trim();
        }

        let delayIndex = keysWithOptionalDelay.indexOf('>');
        let keys;
        let delay = 0;

        if (delayIndex !== -1) {
            keys = keysWithOptionalDelay.substring(0, delayIndex).split(',');
            delay = parseInt(keysWithOptionalDelay.substring(delayIndex + 1));
        } else {
            keys = keysWithOptionalDelay.split(',');
        }

        keys.forEach((key, index) => {
            setTimeout(() => {
                if (key.startsWith('(') && key.endsWith(')')) {
                    const chords = key.slice(1, -1).split(',').map(chord => chord.trim());
                    chords.forEach((chord, chordIndex) => {
                        playSound(chord, currentDynamic);
                        const keyElement = document.querySelector(`.key[data-note="${chord}"]`);
                        if (keyElement) {
                            keyElement.classList.add('playing');
                            setTimeout(() => {
                                keyElement.classList.remove('playing');
                            }, 300);
                        }
                    });
                } else {
                    const note = key.trim();
                    playSound(note, currentDynamic);
                    const keyElement = document.querySelector(`.key[data-note="${note}"]`);
                    if (keyElement) {
                        keyElement.classList.add('playing');
                        setTimeout(() => {
                            keyElement.classList.remove('playing');
                        }, 300);
                    }
                }
            }, cumulativeDelay + index * delay);
        });

        cumulativeDelay += keys.length * delay;
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
