import type {Caption} from '@remotion/captions';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const CaptionCue: React.FC<{caption: Caption; durationInFrames: number}> = ({
  caption,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 100,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          minHeight: 78,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px 30px 16px',
          borderRadius: 12,
          backgroundColor: 'rgba(7, 24, 39, 0.92)',
          boxShadow: '0 10px 32px rgba(7, 24, 39, 0.18)',
          color: '#FFFDF8',
          fontFamily: 'Microsoft YaHei, Noto Sans SC, sans-serif',
          fontSize: 46,
          lineHeight: 1.35,
          fontWeight: 600,
          textAlign: 'center',
          whiteSpace: 'pre-wrap',
          opacity: interpolate(
            frame,
            [0, 5, Math.max(6, durationInFrames - 5), durationInFrames],
            [0, 1, 1, 0],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
          translate: `0 ${interpolate(frame, [0, 7], [12, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}px`,
        }}
      >
        {caption.text}
      </div>
    </AbsoluteFill>
  );
};

export const CaptionTrack: React.FC<{captions: Caption[]}> = ({captions}) => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      {captions.map((caption, index) => {
        const next = captions[index + 1] ?? null;
        const startFrame = Math.round((caption.startMs / 1000) * fps);
        const endMs = next ? Math.min(caption.endMs, next.startMs) : caption.endMs;
        const endFrame = Math.max(startFrame + 1, Math.round((endMs / 1000) * fps));
        const durationInFrames = endFrame - startFrame;
        return (
          <Sequence
            key={`${caption.startMs}-${index}`}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <CaptionCue caption={caption} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
