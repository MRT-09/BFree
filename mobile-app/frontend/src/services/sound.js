import { Audio } from 'expo-av';
import io from 'socket.io-client';

const FLASK_PUBLIC_API_URL = process.env.EXPO_PUBLIC_FLASK_API_URL;
const soundFile = require('../../assets/cell-phone-dbl-beep-notification-83306.mp3');

console.log('Initializing WebSocket connection...');

const socket = io(FLASK_PUBLIC_API_URL);

socket.on('connect', () => {
    console.log('Connected to WebSocket server');
});

socket.on('playSound', async () => {
    console.log('Received playSound event from server');
    await playSound();
});

socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
});

socket.on('connect_error', (error) => {
    //console.error('WebSocket connection error:', error);
});
export async function playSound() {
    try {
        console.log('Requesting audio permissions...');
        await Audio.requestPermissionsAsync();

        console.log('Loading sound file...');
        const { sound } = await Audio.Sound.createAsync(soundFile);

        console.log('Playing sound...');
        await sound.playAsync();

        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
                console.log('Sound finished playing. Unloading...');
                sound.unloadAsync();
            }
        });
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}
export { socket };
