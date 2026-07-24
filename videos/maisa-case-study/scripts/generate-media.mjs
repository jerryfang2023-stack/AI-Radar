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
  const rawAudioPath = join(tempDir, `${scene.id}-raw.mp3`);
  const audioPath = join(voiceDir, `${scene.id}.mp3`);
  const vttPath = join(tempDir, `${scene.id}.vtt`);
  writeFileSync(textPath, scene.voiceover, 'utf8');

  execFileSync(
    'edge-tts',
    [
      '-f',
      textPath,
      '-v',
      'zh-CN-YunjianNeural',
      '--rate',
      '+10%',
      '--volume=+2%',
      '--pitch=+2Hz',
      '--write-media',
      rawAudioPath,
      '--write-subtitles',
      vttPath,
    ],
    {stdio: 'inherit'},
  );

  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      '-i',
      rawAudioPath,
      '-af',
      'highpass=f=85,equalizer=f=180:t=q:w=1:g=1.2,equalizer=f=3500:t=q:w=1.1:g=2,acompressor=threshold=-19dB:ratio=3:attack=10:release=90:makeup=2,loudnorm=I=-16:TP=-2:LRA=7',
      '-ar',
      '48000',
      '-ac',
      '2',
      '-c:a',
      'libmp3lame',
      '-b:a',
      '160k',
      audioPath,
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

const musicSourcePath = join(audioDir, 'spark-of-inspiration.mp3');
const musicPath = join(audioDir, 'piano-bed.m4a');
const fadeOutStart = Math.max(0, durationSeconds - 3);
execFileSync(
  'ffmpeg',
  [
    '-y',
    '-i',
    musicSourcePath,
    '-i',
    musicSourcePath,
    '-filter_complex',
    `[0:a][1:a]acrossfade=d=8:c1=tri:c2=tri,atrim=0:${durationSeconds},asetpts=N/SR/TB,highpass=f=70,lowpass=f=13500,loudnorm=I=-18:TP=-2:LRA=9,afade=t=in:st=0:d=1.2,afade=t=out:st=${fadeOutStart}:d=3[out]`,
    '-map',
    '[out]',
    '-ar',
    '48000',
    '-ac',
    '2',
    '-c:a',
    'aac',
    '-b:a',
    '160k',
    musicPath,
  ],
  {stdio: 'inherit'},
);

rmSync(tempDir, {recursive: true, force: true});
console.log(`Generated ${scenes.length} voiceovers, ${captions.length} captions, ${durationSeconds.toFixed(1)}s total.`);
