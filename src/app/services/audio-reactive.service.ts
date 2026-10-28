import {Injectable} from '@angular/core';

// All values 0..1. `bass` / `mid` / `high` are frequency bands, `level` the overall loudness.
export interface AudioLevels {
    level: number;
    bass: number;
    mid: number;
    high: number;
}

// ~70 BPM: a slow, unhurried pulse
const BEAT_SECONDS = 60 / 70;

/**
 * What the visuals "hear". Render loops call read() once per frame (synchronous on purpose: an
 * Observable emitting 60 times a second would be pure overhead).
 *
 * TODO(audio): when the MP3 previews arrive (assets/audio/*.mp3), play them through an <audio>
 * element -> MediaElementAudioSourceNode -> AnalyserNode, and have read() return the averaged FFT
 * bands instead of the idle signal. Set hasAudio = true to show the play/mute button. Keep the
 * AudioLevels shape stable: <oca-stage> depends only on it.
 */
@Injectable({
    providedIn: 'root'
})
export class AudioReactiveService {

    // Reserved for the play/mute button; false until real audio exists
    readonly hasAudio = false;

    // The idle signal: layered sines so it breathes organically rather than ticking like a metronome
    read(timeSeconds: number): AudioLevels {
        const t = timeSeconds;
        const beatPhase = (t % BEAT_SECONDS) / BEAT_SECONDS;
        // A soft kick at the start of each beat, decaying through it
        const kick = Math.pow(1 - beatPhase, 3);
        const swell = 0.5 + 0.5 * Math.sin(t * 0.21);

        const bass = clamp01(0.45 * kick + 0.35 * swell);
        const mid = clamp01(0.5 + 0.3 * Math.sin(t * 0.9 + Math.sin(t * 0.37) * 2));
        const high = clamp01(0.35 + 0.25 * Math.sin(t * 3.1) * Math.sin(t * 1.7));

        return {level: (bass + mid + high) / 3, bass, mid, high};
    }
}

function clamp01(value: number): number {
    return Math.min(1, Math.max(0, value));
}
