
const keyStrokeSounds = [
  new Audio("/sounds/keystroke1.mps"),
  new Audio("/sounds/keystroke2.mps"),
  new Audio("/sounds/keystroke3.mps"),
  new Audio("/sounds/keystroke4.mps"),
];

function useKeyboardSound() {
    const playRandomKeyStrokeSound = () => {
        const randomSound = keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];
        randomSound.currentTime = 0;
        randomSound.play().catch(error => console.log("Audio play failed : ", error))
    };

    return {playRandomKeyStrokeSound};
}

export default useKeyboardSound;