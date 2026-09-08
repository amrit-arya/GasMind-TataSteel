// Sound notification system using Web Audio API
// Uses robust synthesis with automatic browser audio unlock on first user gesture

let audioContext: AudioContext | null = null;
let isMuted = false;
let isUnlocked = false;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return audioContext;
  } catch (e) {
    console.warn('Could not initialize AudioContext:', e);
    return null;
  }
}

// Unlock audio context on user gesture (click/keydown)
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    const ctx = getAudioContext();
    if (ctx) {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      isUnlocked = true;
    }
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };

  window.addEventListener('click', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);
}

export function setMuted(muted: boolean) {
  isMuted = muted;
}

export function getMuted(): boolean {
  return isMuted;
}

/**
 * Play a clear, synthesized tone with reliable gain envelopes
 */
function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.35,
  pitchEnd?: number
) {
  if (isMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);

    if (pitchEnd) {
      oscillator.frequency.linearRampToValueAtTime(pitchEnd, now + duration);
    }

    // Audible envelope: attack 0.01s, decay to zero at end
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.02);
    gainNode.gain.linearRampToValueAtTime(0.001, now + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + duration + 0.05);
  } catch (e) {
    console.warn('Sound playback error:', e);
  }
}

/**
 * CRITICAL alert sound — urgent high-pitched 3-tone alarm (loud and distinct)
 * Used for: gas deficit, equipment failure, emergency shutdown
 */
export function playCriticalAlert() {
  if (isMuted) return;

  // Pulse 1
  playTone(880, 0.18, 'sawtooth', 0.4); // A5
  // Pulse 2
  setTimeout(() => playTone(1046.5, 0.18, 'sawtooth', 0.45), 180); // C6
  // Pulse 3
  setTimeout(() => playTone(1318.5, 0.35, 'sawtooth', 0.5), 360); // E6
}

/**
 * WARNING alert sound — dual chime warning tone
 * Used for: threshold approaching, pressure drops, holder high/low
 */
export function playWarningAlert() {
  if (isMuted) return;

  playTone(659.25, 0.22, 'triangle', 0.4); // E5
  setTimeout(() => playTone(523.25, 0.35, 'triangle', 0.4), 220); // C5
}

/**
 * INFO alert sound — clear pleasant chime
 * Used for: simulation completed, report generated, optimization applied
 */
export function playInfoAlert() {
  if (isMuted) return;

  playTone(783.99, 0.4, 'sine', 0.35); // G5
}

/**
 * SUCCESS sound — ascending double chime
 * Used for: alert acknowledged, issue resolved
 */
export function playSuccessSound() {
  if (isMuted) return;

  playTone(523.25, 0.15, 'sine', 0.35); // C5
  setTimeout(() => playTone(783.99, 0.3, 'sine', 0.4), 160); // G5
}

/**
 * Play alert sound based on severity level
 */
export function playAlertSound(severity: 'critical' | 'warning' | 'info') {
  switch (severity) {
    case 'critical':
      playCriticalAlert();
      break;
    case 'warning':
      playWarningAlert();
      break;
    case 'info':
      playInfoAlert();
      break;
  }
}
