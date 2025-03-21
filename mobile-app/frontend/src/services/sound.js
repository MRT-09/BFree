import { Audio } from 'expo-av';

const soundFile = require('../../assets/cellphone-ringing-6475.mp3');

export async function playSound() {
    try {
        await Audio.requestPermissionsAsync();
        const { sound } = await Audio.Sound.createAsync(soundFile);
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
                sound.unloadAsync();
            }
        });
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}

async function playSoundFromServer() {
    try {
        // Call the Flask endpoint
        await fetch('/trigger-sound');
        // Play the sound after the server responds
        await playSound();
    } catch (error) {
        console.error('Error:', error);
    }
}