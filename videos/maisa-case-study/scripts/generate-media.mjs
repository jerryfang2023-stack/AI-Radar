import {execFileSync} from 'node:child_process';
import {mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const scenes = JSON.parse(readFileSync(join(root, 'src/scenes.json'), 'utf8'));
const publicDir = join(root, 'public');
const voiceDir = join(publicDir, 'voiceover');
const audioDir = join(publicDir, 'audio');
const dataDir = join(publicDir, 'data');
const tempDir = join(root, '.media-tmp');
const fps = 30;
const audioLeadFrames = 15;
const tailFrames = 24;

for (const dir of [voiceDir, audioDir, dataDir, tempDir]) mkdirSync(dir, {recursive: true});

const parseTime = (value) => {
  const match = value.match(/(\d+):(\d+):(\d+)[.,](\d+)/);
  if (!match) throw new Error(`Invalid VTT timestamp: ${value}`);
  return (
    Number(match[1]) * 3600000 +
    Number(match[2]) * 60000 +
    Number(match[3]) * 1000 +
    Number(match[4].padEnd(3, '0').slice(0, 3))
  );
};

const parseVtt = (text) => {
  const lines = text.replace(/\r/g, '').split('\n');
  const cues = [];
  for (let index = 0; index < lines.length; index++) {
    if (!lines[index].includes('-->')) continue;
    const [start, end] = lines[index].split('-->').map((part) => part.trim());
    const words = [];
    index += 1;
    while (index < lines.length && lines[index].trim()) {
      words.push(lines[index].trim());
      index += 1;
    }
    const cueText = words.join('').replace(/<[^>]+>/g, '').trim();
    if (!cueText) continue;
    cues.push({
      text: cueText,
      startMs: parseTime(start),
      endMs: parseTime(end),
      timestampMs: null,
      confidence: null,
    });
  }
  return cues;
};

const getDurationSeconds = (path) =>
  Number(
    execFileSync(
      'ffprobe',
      ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', path],
      {encoding: 'utf8'},
    ).trim(),
  );

let cursorFrame = 0;
const timelineScenes = [];
const captions = [];

for (const scene of scenes) {
  const textPath = join(tempDir, `${scene.id}.txt`);
  const audioPath = join(voiceDir, `${scene.id}.mp3`);
  const vttPath = join(tempDir, `${scene.id}.vtt`);
  writeFileSync(textPath, scene.voiceover, 'utf8');

  execFileSync(
    'edge-tts',
    [
      '-f',
      textPath,
      '-v',
      'zh-CN-YunyangNeural',
      '--rate',
      '+16%',
      '--volume=+4%',
      '--pitch=+1Hz',
      '--write-media',
      audioPath,
      '--write-subtitles',
      vttPath,
    ],
    {stdio: 'inherit'},
  );

  const audioSeconds = getDurationSeconds(audioPath);
  const audioFrames = Math.ceil(audioSeconds * fps);
  const durationInFrames = audioLeadFrames + audioFrames + tailFrames;
  const sceneStartMs = (cursorFrame / fps) * 1000;
  const audioStartMs = (audioLeadFrames / fps) * 1000;
  const sceneCaptions = parseVtt(readFileSync(vttPath, 'utf8'));

  for (const caption of sceneCaptions) {
    captions.push({
      ...caption,
      startMs: Math.round(sceneStartMs + audioStartMs + caption.startMs),
      endMs: Math.round(sceneStartMs + audioStartMs + caption.endMs),
    });
  }

  timelineScenes.push({
    id: scene.id,
    startFrame: cursorFrame,
    durationInFrames,
    audioStartFrame: audioLeadFrames,
    audioFile: `voiceover/${scene.id}.mp3`,
  });
  cursorFrame += durationInFrames;
}

const durationSeconds = cursorFrame / fps;
const timeline = {
  fps,
  durationInFrames: cursorFrame,
  durationSeconds: Number(durationSeconds.toFixed(3)),
  scenes: timelineScenes,
};

writeFileSync(join(dataDir, 'timeline.json'), `${JSON.stringify(timeline, null, 2)}\n`);
writeFileSync(join(dataDir, 'captions.json'), `${JSON.stringify(captions, null, 2)}\n`);

const musicPath = join(audioDir, 'ambient-bed.m4a');
const fadeOutStart = Math.max(0, durationSeconds - 3);
execFileSync(
  'ffmpeg',
  [
    '-y',
    '-f',
    'lavfi',
    '-i',
    `sine=frequency=55:sample_rate=48000:duration=${durationSeconds}`,
    '-f',
    'lavfi',
    '-i',
    `sine=frequency=82.41:sample_rate=48000:duration=${durationSeconds}`,
    '-f',
    'lavfi',
    '-i',
    `anoisesrc=color=pink:amplitude=0.01:sample_rate=48000:duration=${durationSeconds}`,
    '-filter_complex',
    `[0:a]volume=0.09,lowpass=f=420[a0];[1:a]volume=0.035,lowpass=f=700[a1];[2:a]lowpass=f=900,highpass=f=120,volume=0.12[a2];[a0][a1][a2]amix=inputs=3:normalize=0,afade=t=in:st=0:d=2,afade=t=out:st=${fadeOutStart}:d=3,alimiter=limit=0.35[out]`,
    '-map',
    '[out]',
    '-c:a',
    'aac',
    '-b:a',
    '128k',
    musicPath,
  ],
  {stdio: 'inherit'},
);

rmSync(tempDir, {recursive: true, force: true});
console.log(`Generated ${scenes.length} voiceovers, ${captions.length} captions, ${durationSeconds.toFixed(1)}s total.`);
