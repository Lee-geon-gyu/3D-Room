"""Cloud Letters: clearer quiet piano voices and restrained fast left-hand rolls.

Requires numpy. Input is the original 48s seamless edition, which is retained.
The old pad is deterministic and separable because its original effects were
linear. Keep the established voice balance; the first six seconds use an
original rising Dmaj9 motif, then return to the unchanged second phrase.
No source separation
model or master normalization is used. No reference recording is used.
"""
from pathlib import Path
import argparse
import hashlib
import json
import sys
import wave
import numpy as np

RATE = 44100
SECONDS = 48
COUNT = RATE * SECONDS
PLAYBACK_START_SECONDS = .75
ORIGINAL_GAIN = 7.277521355829406
ORIGINAL_SHA256 = '1f276f8f2cc6ea9ab05c3b1c7782c443fe98a9786ca7448f45b92cb23ae2fa2d'
CHORDS = [(38, [62, 66, 69, 73]), (35, [59, 62, 66, 73]),
          (31, [59, 62, 66, 69]), (33, [61, 64, 69, 71]),
          (38, [62, 64, 69, 73]), (30, [57, 61, 64, 69]),
          (31, [59, 62, 66, 69]), (33, [62, 64, 69, 71])]
ORIGINAL_MELODIES = [[78, 81, 76, 85], [78, 74, 81, 73], [79, 78, 74, 81], [76, 83, 81, 73],
                     [81, 78, 86, 85], [76, 73, 81, 78], [79, 81, 78, 74], [83, 81, 76, 78]]
MELODIES = [phrase[:] for phrase in ORIGINAL_MELODIES]
MELODIES[0] = [78, 88, 85, 78]
OPENING_INNER_PITCHES = {(0, 1): 81, (0, 2): 86, (0, 3): 83, (1, 0): 76}
OPENING_GAIN_MULTIPLIERS = {('softMelodyReply', 0, 3): .90,
                           ('innerPiano', 1, 0): 1.80}
# Eight even pulses: F#-A-E-D-C#-B-F#-E. No added key between .75 and 1.5s.


def wrap_add(destination, tone, start):
    first = round(start * RATE) % COUNT
    count = min(len(tone), COUNT - first)
    destination[first:first + count] += tone[:count]
    if count < len(tone):
        destination[:len(tone) - count] += tone[count:]


def start_on_strong_piano(stem):
    """Put the first main strike at zero and the original pickup at the end."""
    return np.roll(stem, -round(PLAYBACK_START_SECONDS * RATE), axis=0)


def playback_events(events):
    return [dict(event, originalStart=event['start'],
                 start=round((event['start'] - PLAYBACK_START_SECONDS) % SECONDS, 6))
            for event in events]


def accompaniment_events():
    """The original 40 notes: identical pitches, onsets, durations, gains and pans."""
    events = []
    for bar, (bass, voicing) in enumerate(CHORDS):
        events.append({'midi': bass, 'start': bar * 6, 'length': 9.0, 'gain': .018 * .75, 'pan': 0.0})
        events.extend({'midi': midi, 'start': bar * 6 + j * .07, 'length': 9.0,
                       'gain': .009 * .75, 'pan': (j - 1.5) * .23}
                      for j, midi in enumerate(voicing))
    return events


def old_accompaniment():
    """Exact original pad notes, pan, envelope, circular echoes and EQ."""
    stem = np.zeros((COUNT, 2), dtype=np.float64)
    for event in accompaniment_events():
        midi, start, length, gain, pan = (event[k] for k in ('midi', 'start', 'length', 'gain', 'pan'))
        t = np.arange(round(length * RATE)) / RATE
        frequency = 440 * 2 ** ((midi - 69) / 12)
        tone = np.empty((len(t), 2))
        for channel, detune in enumerate((-.035, .035)):
            phase = 2 * np.pi * (frequency + detune) * t + .07 * np.sin(t * .7 + channel)
            tone[:, channel] = np.sin(phase) + .19 * np.sin(phase * 2) + .045 * np.sin(phase * 3)
        envelope = np.sin(np.clip(t / 1.5, 0, 1) * np.pi / 2) ** 2
        envelope *= np.sin(np.clip((length - t) / 2.8, 0, 1) * np.pi / 2) ** 2
        tone *= envelope[:, None] * gain
        tone[:, 0] *= np.sqrt((1 - pan) / 2)
        tone[:, 1] *= np.sqrt((1 + pan) / 2)
        wrap_add(stem, tone, start)
    dry = stem.copy()
    for delay, gain in [(.117, .10), (.223, .09), (.371, .08), (.613, .07),
                        (.947, .06), (1.313, .05), (1.877, .04), (2.537, .03), (3.173, .018)]:
        stem += np.roll(dry[:, ::-1], round(delay * RATE), axis=0) * gain
    frequency = np.fft.rfftfreq(COUNT, 1 / RATE)
    response = 1 / (1 + (frequency / 5600) ** 6) * np.minimum(1, frequency / 30) ** 2
    for channel in range(2):
        stem[:, channel] = np.fft.irfft(np.fft.rfft(stem[:, channel]) * response, COUNT)
    return stem * ORIGINAL_GAIN


def dream_accompaniment(target_rms):
    """Revoice the original score, without transposing or extending its notes."""
    rng = np.random.default_rng(20261023)
    stem = np.zeros((COUNT, 2), dtype=np.float64)
    for event in accompaniment_events():
        midi, start, length, gain, pan = (event[k] for k in ('midi', 'start', 'length', 'gain', 'pan'))
        t = np.arange(round(length * RATE)) / RATE
        frequency = 440 * 2 ** ((midi - 69) / 12)
        bins = np.fft.rfftfreq(len(t), 1 / RATE)
        breath_band = np.exp(-((bins - frequency * 2.8) / max(120, frequency * 1.7)) ** 2)
        breath_band *= np.minimum(1, bins / max(90, frequency * 1.3)) ** 3
        breath_band /= 1 + (bins / 2200) ** 8
        tone = np.empty((len(t), 2))
        for channel, detune in enumerate((-.035, .035)):
            # Fundamental tuning and vibrato are exactly the original's.
            phase = 2 * np.pi * (frequency + detune) * t + .07 * np.sin(t * .7 + channel)
            breath = np.fft.irfft(np.fft.rfft(rng.normal(size=len(t))) * breath_band, len(t))
            breath *= .026 / np.sqrt(np.mean(breath ** 2))
            tone[:, channel] = (np.sin(phase) + .060 * np.sin(phase * 2 + .4)
                                + .012 * np.sin(phase * 3 + .7)
                                + .006 * np.sin(phase * 4 + 1.1) + breath)
        # Original attack, hold/release and stereo placement: not a new drone.
        envelope = np.sin(np.clip(t / 1.5, 0, 1) * np.pi / 2) ** 2
        envelope *= np.sin(np.clip((length - t) / 2.8, 0, 1) * np.pi / 2) ** 2
        tone *= envelope[:, None] * gain * ORIGINAL_GAIN
        tone[:, 0] *= np.sqrt((1 - pan) / 2)
        tone[:, 1] *= np.sqrt((1 + pan) / 2)
        wrap_add(stem, tone, start)
    bins = np.fft.rfftfreq(COUNT, 1 / RATE)
    response = 1 / (1 + (bins / 3600) ** 6) * np.minimum(1, bins / 30) ** 2
    for channel in range(2):
        stem[:, channel] = np.fft.irfft(np.fft.rfft(stem[:, channel]) * response, COUNT)
    # Only a faint short room remains; remove the previous 8.2-second diffuse IR.
    room = np.zeros_like(stem)
    for delay, gain in [(.041, .025), (.079, .018), (.131, .012)]:
        room += np.roll(stem[:, ::-1], round(delay * RATE), axis=0) * gain
    result = stem + room
    scale = target_rms / np.sqrt(np.mean(result ** 2))
    report = {'maxExtraRoomDelaySeconds': .131,
              'roomToDryRms': float(np.sqrt(np.mean(room ** 2) / np.mean(stem ** 2))),
              'noteCount': len(accompaniment_events()), 'pitchTransposeSemitones': 0,
              'noteDurationSeconds': 9.0, 'noteTimingRestored': True}
    return result * scale, report


def right_hand_detail_events():
    """Balance existing voices, with a new contour only in the opening phrase."""
    events = []
    for bar, (_, voicing) in enumerate(CHORDS):
        for j, midi in enumerate(voicing):
            events.append({'voice': 'innerPiano',
                           'midi': OPENING_INNER_PITCHES.get((bar, j), midi + 12),
                           'originalMidi': midi + 12,
                           'start': bar * 6 + j * 1.5, 'length': 4.0,
                           'originalGain': .024,
                           'gainMultiplier': OPENING_GAIN_MULTIPLIERS.get(('innerPiano', bar, j), 2.53),
                           'pan': (j - 1.5) * .13})
        for j in (1, 3):
            events.append({'voice': 'softMelodyReply', 'midi': MELODIES[bar][j],
                           'originalMidi': ORIGINAL_MELODIES[bar][j],
                           'start': bar * 6 + .75 + j * 1.5, 'length': 6.0,
                           'originalGain': .050,
                           'gainMultiplier': OPENING_GAIN_MULTIPLIERS.get(('softMelodyReply', bar, j), 1.725),
                           'pan': -.18})
    return events


def strong_melody_events():
    events = []
    for bar, melody in enumerate(MELODIES):
        for j in (0, 2):
            events.append({'voice': 'strongMelody', 'midi': melody[j],
                           'originalMidi': ORIGINAL_MELODIES[bar][j],
                           'start': bar * 6 + .75 + j * 1.5, 'length': 6.0,
                           'originalGain': .065, 'gainMultiplier': 1.0, 'pan': .18})
    return events


def right_hand_score():
    return sorted(playback_events(right_hand_detail_events() + strong_melody_events()),
                  key=lambda event: event['start'])


def upper_piano_bank(samples, decoder_root=None):
    if decoder_root:
        sys.path.insert(0, str(decoder_root))
    import miniaudio
    bank = {}
    for key, midi in [('A4', 69), ('C5', 72), ('Ds5', 75),
                      ('Fs5', 78), ('A5', 81), ('C6', 84)]:
        decoded = miniaudio.decode_file(str(samples / (key + '.mp3')),
                                       output_format=miniaudio.SampleFormat.FLOAT32,
                                       nchannels=2, sample_rate=RATE)
        source = np.asarray(decoded.samples, dtype=np.float64).reshape(-1, 2)
        # Preserve original codec silence, sample normalization and attack timing.
        bank[midi] = source / max(.01, np.max(np.abs(source)))
    return bank


def original_piano_effects(stem, room=True):
    if room:
        dry = stem.copy()
        for delay, gain in [(.117, .10), (.223, .09), (.371, .08), (.613, .07),
                            (.947, .06), (1.313, .05), (1.877, .04), (2.537, .03), (3.173, .018)]:
            stem += np.roll(dry[:, ::-1], round(delay * RATE), axis=0) * gain
    bins = np.fft.rfftfreq(COUNT, 1 / RATE)
    response = 1 / (1 + (bins / 5600) ** 6) * np.minimum(1, bins / 30) ** 2
    for channel in range(2):
        stem[:, channel] = np.fft.irfft(np.fft.rfft(stem[:, channel]) * response, COUNT)
    return stem * ORIGINAL_GAIN


def right_hand_detail_boost(samples, decoder_root=None):
    """Apply exact note deltas, subtracting an old pitch before replacing it."""
    bank = upper_piano_bank(samples, decoder_root)
    stem = np.zeros((COUNT, 2), dtype=np.float64)
    events = right_hand_detail_events()
    # A changed main pitch must also replace the note in the frozen recording.
    events += [event for event in strong_melody_events()
               if event['midi'] != event['originalMidi']]
    for event in events:
        length = event['length']
        t = np.arange(round(length * RATE)) / RATE
        envelope = np.minimum(1, t / .006) * np.minimum(1, (length - t) / .8)
        if event['midi'] == event['originalMidi']:
            changes = [(event['midi'], event['originalGain'] * (event['gainMultiplier'] - 1))]
        else:
            changes = [(event['originalMidi'], -event['originalGain']),
                       (event['midi'], event['originalGain'] * event['gainMultiplier'])]
        for midi, gain in changes:
            key = min(bank, key=lambda base: abs(base - midi))
            source = bank[key]
            position = np.arange(len(t)) * 2 ** ((midi - key) / 12)
            tone = np.column_stack([np.interp(position, np.arange(len(source)), source[:, c], right=0)
                                    for c in range(2)])
            tone *= (envelope * gain)[:, None]
            tone[:, 0] *= np.sqrt((1 - event['pan']) / 2)
            tone[:, 1] *= np.sqrt((1 + event['pan']) / 2)
            wrap_add(stem, tone, event['start'])
    return original_piano_effects(stem), events


def raise_piano_follow_through(piano, samples, decoder_root=None):
    """Lift the quiet body immediately after each strong strike, without new echo."""
    bank = upper_piano_bank(samples, decoder_root)
    strong = np.zeros((COUNT, 2), dtype=np.float64)
    extra = np.zeros_like(strong)
    for bar, melody in enumerate(MELODIES):
        for j in (0, 2):
            midi, length, pan = melody[j], 6.0, .18
            key = min(bank, key=lambda base: abs(base - midi))
            source = bank[key]
            t = np.arange(round(length * RATE)) / RATE
            position = np.arange(len(t)) * 2 ** ((midi - key) / 12)
            tone = np.column_stack([np.interp(position, np.arange(len(source)), source[:, c], right=0)
                                    for c in range(2)])
            envelope = np.minimum(1, t / .006) * np.minimum(1, (length - t) / .8)
            tone *= (envelope * .065)[:, None]
            tone[:, 0] *= np.sqrt((1 - pan) / 2)
            tone[:, 1] *= np.sqrt((1 + pan) / 2)
            start = bar * 6 + .75 + j * 1.5
            wrap_add(strong, tone, start)
            # Preserve the first 120ms; blend up, then return to the natural tail.
            lift = np.sin(np.clip((t - .12) / .12, 0, 1) * np.pi / 2) ** 2
            lift *= np.sin(np.clip((1.25 - t) / .5, 0, 1) * np.pi / 2) ** 2
            wrap_add(extra, tone * lift[:, None], start)
    strong = start_on_strong_piano(original_piano_effects(strong))
    # Boost existing sampled piano body, without adding another reverb/delay layer.
    extra = start_on_strong_piano(original_piano_effects(extra, room=False))
    reference = float(np.sqrt(np.mean(strong[:round(.25 * RATE)] ** 2)))
    target = reference * .5
    follow = slice(round(.25 * RATE), round(.75 * RATE))
    a = float(np.mean(extra[follow] ** 2))
    b = float(2 * np.mean(piano[follow] * extra[follow]))
    c = float(np.mean(piano[follow] ** 2) - target ** 2)
    gain = max(0.0, (-b + np.sqrt(max(0, b * b - 4 * a * c))) / (2 * a))
    extra *= gain
    balanced = piano + extra
    report = {'referenceStrongAttackWindowSeconds': .25,
              'referenceStrongAttackRms': reference,
              'referenceStrongPeak': float(np.max(np.abs(strong))),
              'followThroughWindowSeconds': [.25, .75],
              'followThroughRmsBefore': float(np.sqrt(np.mean(piano[follow] ** 2))),
              'followThroughRmsAfter': float(np.sqrt(np.mean(balanced[follow] ** 2))),
              'targetRatioToStrongStrike': .5,
              'targetFollowThroughRms': target,
              'originalAttackPreservedSeconds': .12,
              'extraRoomAdded': False, 'extraBodyGain': gain}
    return balanced, extra, strong, report


def left_hand_events():
    """Roll four keys upward once per four melody notes, with overlapping decay."""
    events = []
    # Match each existing chord, including the Dsus2 and final Asus4 voicings.
    inner_intervals = [4, 3, 4, 4, 2, 3, 4, 5]
    for bar, (bass, _) in enumerate(CHORDS):
        touch = [.82, .78, .80, .76, .82, .77, .80, .76][bar]
        for key, (interval, offset, velocity) in enumerate(zip(
                [0, inner_intervals[bar], 7, 12],
                [0.0, .035, .070, .105], [.78, .70, .66, .61])):
            events.append({'gesture': bar, 'keyInRoll': key,
                           'firstMelodyEvent': bar * 4, 'rightHandNotesSupported': 4,
                           'start': bar * 6 + .75 + offset,
                           'midi': bass + 12 + interval, 'length': 4.2 - offset,
                           'velocity': touch * velocity, 'pan': -.16 + key * .025})
    return events


def left_hand_piano(samples, decoder_root=None, target_attack_rms=None, peak_limit=None):
    """Mellow sampled bass keys, natural decay and a restrained hammer attack."""
    if decoder_root:
        sys.path.insert(0, str(decoder_root))
    import miniaudio
    bank = {}
    for key, midi in [('Fs2', 42), ('A2', 45), ('C3', 48), ('Ds3', 51),
                      ('Fs3', 54), ('A3', 57), ('C4', 60), ('Ds4', 63)]:
        decoded = miniaudio.decode_file(str(samples / (key + '.mp3')),
                                       output_format=miniaudio.SampleFormat.FLOAT32,
                                       nchannels=2, sample_rate=RATE)
        source = np.asarray(decoded.samples, dtype=np.float64).reshape(-1, 2)
        source /= np.max(np.abs(source))
        # Remove only leading recording/codec silence, before the hammer attack.
        audible = np.flatnonzero(np.max(np.abs(source), axis=1) > .0005)
        first = max(0, int(audible[0]) - round(.002 * RATE)) if len(audible) else 0
        bank[midi] = source[first:]
    stem = np.zeros((COUNT, 2), dtype=np.float64)
    events = left_hand_events()
    for event in events:
        midi, length = event['midi'], event['length']
        key = min(bank, key=lambda base: abs(base - midi))
        source = bank[key]
        t = np.arange(round(length * RATE)) / RATE
        position = np.arange(len(t)) * 2 ** ((midi - key) / 12)
        tone = np.column_stack([np.interp(position, np.arange(len(source)), source[:, c], right=0)
                                for c in range(2)])
        envelope = np.sin(np.minimum(1, t / .012) * np.pi / 2) ** 2
        envelope *= np.sin(np.minimum(1, (length - t) / .85) * np.pi / 2) ** 2
        tone *= envelope[:, None] * event['velocity']
        tone[:, 0] *= np.sqrt((1 - event['pan']) / 2)
        tone[:, 1] *= np.sqrt((1 + event['pan']) / 2)
        wrap_add(stem, tone, event['start'])
    bins = np.fft.rfftfreq(COUNT, 1 / RATE)
    response = 1 / (1 + (bins / 1900) ** 6) * np.minimum(1, bins / 35) ** 2
    for channel in range(2):
        stem[:, channel] = np.fft.irfft(np.fft.rfft(stem[:, channel]) * response, COUNT)
    # Compare audible gesture windows, not a sparse stem's 48-second average.
    windows = [stem[round((bar * 6 + .75) * RATE):round((bar * 6 + 1.0) * RATE)]
               for bar in range(len(CHORDS))]
    active_rms = float(np.median([np.sqrt(np.mean(window ** 2)) for window in windows]))
    scale = min(target_attack_rms / active_rms, peak_limit / np.max(np.abs(stem)))
    stem *= scale
    report = {'gestureMeasurementWindowSeconds': .25,
              'medianGestureRms': active_rms * scale,
              'targetGestureRms': target_attack_rms, 'peakLimit': peak_limit,
              'gainRelativeToV10': float(np.sqrt(np.mean(stem ** 2))) / .003523740860984850}
    return stem, events, report


def read_wav(path):
    with wave.open(str(path), 'rb') as audio:
        assert (audio.getnchannels(), audio.getframerate(), audio.getsampwidth(), audio.getnframes()) == (2, RATE, 2, COUNT)
        return np.frombuffer(audio.readframes(COUNT), dtype='<i2').astype(np.float64).reshape(-1, 2) / 32767


def write_wav(path, audio):
    assert np.isfinite(audio).all() and np.max(np.abs(audio)) < .98
    with wave.open(str(path), 'wb') as output:
        output.setnchannels(2)
        output.setsampwidth(2)
        output.setframerate(RATE)
        output.writeframes(np.round(audio * 32767).astype('<i2').tobytes())


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--evidence', type=Path, required=True)
    parser.add_argument('--samples', type=Path, default=Path(__file__).parent / 'audio-samples' / 'salamander')
    parser.add_argument('--decoder-root', type=Path)
    args = parser.parse_args()
    assert args.input.resolve() != args.output.resolve(), 'Preserve the selected original.'
    assert hashlib.sha256(args.input.read_bytes()).hexdigest() == ORIGINAL_SHA256, 'This recipe requires the selected original seamless edition.'
    args.evidence.mkdir(parents=True, exist_ok=True)
    original = read_wav(args.input)
    old_pad = old_accompaniment()
    original_piano = original - old_pad
    detail, detail_events = right_hand_detail_boost(args.samples, args.decoder_root)
    piano = start_on_strong_piano(original_piano + detail)
    detail = start_on_strong_piano(detail)
    piano_before_follow = piano.copy()
    piano, follow_through, strong, follow_report = raise_piano_follow_through(
        piano, args.samples, args.decoder_root)
    target = .0028
    drone, instrument_report = dream_accompaniment(target)
    left, left_events, left_report = left_hand_piano(
        args.samples, args.decoder_root, follow_report['targetFollowThroughRms'],
        follow_report['referenceStrongPeak'] * .75)
    drone = start_on_strong_piano(drone)
    left = start_on_strong_piano(left)
    base = piano + drone
    final = base + left
    # No master normalization: apply the opening pitch replacements and voice gains.
    write_wav(args.output, final)
    write_wav(args.evidence / 'piano-preserved.wav', original_piano)
    write_wav(args.evidence / 'piano-balanced.wav', piano)
    write_wav(args.evidence / 'piano-before-follow-through.wav', piano_before_follow)
    write_wav(args.evidence / 'right-hand-follow-through.wav', follow_through)
    write_wav(args.evidence / 'strong-piano-original.wav', strong)
    write_wav(args.evidence / 'right-hand-detail-boost.wav', detail)
    write_wav(args.evidence / 'new-dream-accompaniment.wav', drone)
    write_wav(args.evidence / 'old-accompaniment.wav', old_pad)
    write_wav(args.evidence / 'right-hand-and-background.wav', base)
    write_wav(args.evidence / 'left-hand-piano.wav', left)
    encoded = read_wav(args.output)
    report = {
        'seconds': SECONDS, 'sampleRate': RATE, 'channels': 2,
        'originalSha256': hashlib.sha256(args.input.read_bytes()).hexdigest(),
        'outputSha256': hashlib.sha256(args.output.read_bytes()).hexdigest(),
        'peak': float(np.max(np.abs(encoded))), 'rms': float(np.sqrt(np.mean(encoded ** 2))),
        'oldPadRms': float(np.sqrt(np.mean(old_pad ** 2))), 'newPadRms': float(np.sqrt(np.mean(drone ** 2))),
        'pianoRms': float(np.sqrt(np.mean(piano ** 2))),
        'pianoErrorAfterReplacingPadRms': float(np.sqrt(np.mean(((encoded - drone - left) - piano) ** 2))),
        'pianoMaxError': float(np.max(np.abs((encoded - drone - left) - piano))),
        'seamStep': np.abs(encoded[0] - encoded[-1]).tolist(),
        'largestOrdinaryStep': float(np.max(np.abs(np.diff(encoded, axis=0)))),
        'headRms': float(np.sqrt(np.mean(encoded[:RATE // 2] ** 2))),
        'tailRms': float(np.sqrt(np.mean(encoded[-RATE // 2:] ** 2))),
        'referenceRecordingUsedInOutput': False,
        'opening': {'playbackOffsetSeconds': PLAYBACK_START_SECONDS,
                    'firstStrongPianoMidi': MELODIES[0][0], 'firstStrongPianoStart': 0.0,
                    'rewrittenRangeSeconds': [0, 6],
                    'phraseHarmony': 'Dmaj9 with a B5 color tone and E5 lead into F#5',
                    'rightHandNotes': [event for event in right_hand_score() if event['start'] < 6],
                    'originalPickupNowStartsAtSeconds': SECONDS - PLAYBACK_START_SECONDS,
                    'originalPickupDurationSeconds': PLAYBACK_START_SECONDS},
        'instrument': instrument_report,
        'rightHandBalance': {'strongMelodyGainMultiplier': 1.0,
                             'innerPianoGainMultiplier': 2.53,
                             'softMelodyReplyGainMultiplier': 1.725,
                             'voiceGainsUnchangedOutsideOpening': True,
                             'openingTailTouch': {'at4_5Seconds': .90, 'at5_25Seconds': 1.80},
                             'openingPitchesRewritten': True,
                             'followThrough': follow_report,
                             'boostedNoteCount': len(detail_events),
                             'originalPianoRms': float(np.sqrt(np.mean(original_piano ** 2))),
                             'extraGainStemRms': float(np.sqrt(np.mean(detail ** 2))),
                             'newNotesAdded': False,
                             'addedOpeningNoteCount': 0},
        'leftHand': {'melodyEvents': 32, 'rightHandNotesPerGesture': 4,
                     'gestureCount': len(CHORDS), 'notesPerGesture': 4,
                     'noteCount': len(left_events), 'gestureSpacingSeconds': 6.0,
                     'keyOffsetsSeconds': [0.0, .035, .070, .105],
                     'rms': float(np.sqrt(np.mean(left ** 2))),
                     'peak': float(np.max(np.abs(left))),
                     **left_report,
                     'extraRoomAdded': False,
                     'minMidi': min(e['midi'] for e in left_events),
                     'maxMidi': max(e['midi'] for e in left_events)},
        'mixHierarchy': {
            'rmsOrder': ['rightHand', 'leftHand', 'background'],
            'rightHandRms': float(np.sqrt(np.mean(piano ** 2))),
            'leftHandRms': float(np.sqrt(np.mean(left ** 2))),
            'backgroundRms': float(np.sqrt(np.mean(drone ** 2))),
            'rightHandPeak': float(np.max(np.abs(piano))),
            'backgroundPeak': float(np.max(np.abs(drone))),
        },
    }
    (args.evidence / 'accompaniment-score.json').write_text(json.dumps(playback_events(accompaniment_events()), indent=2), encoding='utf-8')
    (args.evidence / 'left-hand-score.json').write_text(json.dumps(playback_events(left_events), indent=2), encoding='utf-8')
    (args.evidence / 'right-hand-detail-score.json').write_text(json.dumps(playback_events(detail_events), indent=2), encoding='utf-8')
    (args.evidence / 'right-hand-score.json').write_text(json.dumps(right_hand_score(), indent=2), encoding='utf-8')
    (args.evidence / 'audio-validation.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(json.dumps(report))


if __name__ == '__main__':
    main()
