import type {Caption} from '@remotion/captions';
import {Audio} from '@remotion/media';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import captionsJson from '../public/data/captions.json';
import timelineJson from '../public/data/timeline.json';
import sceneData from './scenes.json';
import {CaptionTrack} from './CaptionTrack';

const COLORS = {
  ink: '#071827',
  blue: '#0D355C',
  mist: '#6F7F8F',
  line: '#D9D7D1',
  paper: '#FFFDF8',
  cloud: '#F7F4EF',
  white: '#FFFFFF',
  gold: '#C8A766',
  rose: '#B15579',
  green: '#2F755E',
};

type TimelineScene = {
  id: string;
  startFrame: number;
  durationInFrames: number;
  audioStartFrame: number;
  audioFile: string;
};

type Timeline = {
  fps: number;
  durationInFrames: number;
  durationSeconds: number;
  scenes: TimelineScene[];
};

type SceneMeta = (typeof sceneData)[number];

const timeline = timelineJson as Timeline;
const captions = captionsJson as Caption[];

const fontSans = 'Microsoft YaHei, Noto Sans SC, PingFang SC, sans-serif';
const fontSerif = 'STSong, SimSun, Noto Serif SC, serif';
const fontMono = 'Cascadia Mono, IBM Plex Mono, Consolas, monospace';

const enter = (frame: number, delay = 0, distance = 28) => ({
  opacity: interpolate(frame, [delay, delay + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  }),
  translate: `0 ${interpolate(frame, [delay, delay + 18], [distance, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })}px`,
});

const WaveLines: React.FC<{dark?: boolean}> = ({dark = false}) => {
  const frame = useCurrentFrame();
  const color = dark ? 'rgba(255,253,248,0.10)' : 'rgba(13,53,92,0.09)';
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      <svg
        width="2100"
        height="520"
        viewBox="0 0 2100 520"
        style={{
          position: 'absolute',
          left: -80,
          bottom: 20,
          translate: `${interpolate(frame, [0, 300], [-20, 22], {
            extrapolateLeft: 'extend',
            extrapolateRight: 'extend',
          })}px 0`,
        }}
      >
        {[0, 1, 2].map((index) => (
          <path
            key={index}
            d={`M0 ${270 + index * 54} C 330 ${120 + index * 30}, 620 ${430 - index * 38}, 980 ${250 + index * 44} S 1620 ${120 + index * 46}, 2100 ${260 + index * 34}`}
            fill="none"
            stroke={index === 0 ? (dark ? 'rgba(200,167,102,0.18)' : 'rgba(200,167,102,0.30)') : color}
            strokeWidth={index === 0 ? 2 : 1.4}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const FrameChrome: React.FC<{meta: SceneMeta; dark?: boolean}> = ({meta, dark = false}) => {
  const fg = dark ? COLORS.paper : COLORS.ink;
  const secondary = dark ? 'rgba(255,253,248,0.62)' : COLORS.mist;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 100,
          top: 70,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          fontFamily: fontSans,
          color: fg,
          zIndex: 100,
          backgroundColor: dark ? COLORS.ink : COLORS.paper,
          padding: '4px 10px 4px 0',
        }}
      >
        <div style={{width: 52, height: 2, backgroundColor: COLORS.gold}} />
        <span style={{fontSize: 21, fontWeight: 700, letterSpacing: 4}}>WAVESIGHT AI</span>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 100,
          top: 72,
          color: secondary,
          fontFamily: fontMono,
          fontSize: 20,
          letterSpacing: 2.6,
          zIndex: 100,
        }}
      >
        {meta.chapter}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 100,
          bottom: 225,
          color: secondary,
          fontFamily: fontSans,
          fontSize: 22,
          zIndex: 100,
          backgroundColor: dark ? COLORS.ink : COLORS.paper,
          padding: '4px 12px 4px 0',
        }}
      >
        SOURCE · {meta.source}
      </div>
    </>
  );
};

const SceneFrame: React.FC<{
  meta: SceneMeta;
  durationInFrames: number;
  dark?: boolean;
  children: React.ReactNode;
}> = ({meta, durationInFrames, dark = false, children}) => {
  const frame = useCurrentFrame();
  const fade = interpolate(
    frame,
    [0, 10, Math.max(11, durationInFrames - 12), durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: dark ? COLORS.ink : COLORS.paper,
        color: dark ? COLORS.paper : COLORS.ink,
        fontFamily: fontSans,
        opacity: fade,
        overflow: 'hidden',
      }}
    >
      <WaveLines dark={dark} />
      {children}
      <FrameChrome meta={meta} dark={dark} />
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{children: React.ReactNode; dark?: boolean}> = ({children, dark}) => (
  <div
    style={{
      color: dark ? '#E4C584' : COLORS.gold,
      fontFamily: fontMono,
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: 2.5,
      textTransform: 'uppercase',
    }}
  >
    {children}
  </div>
);

const Headline: React.FC<{
  children: React.ReactNode;
  size?: number;
  width?: number;
  dark?: boolean;
}> = ({children, size = 78, width = 1120, dark = false}) => (
  <div
    style={{
      maxWidth: width,
      color: dark ? COLORS.paper : COLORS.ink,
      fontFamily: fontSerif,
      fontSize: size,
      fontWeight: 700,
      lineHeight: 1.18,
      letterSpacing: 0.5,
    }}
  >
    {children}
  </div>
);

const StatCard: React.FC<{
  value: string;
  label: string;
  note: string;
  accent?: string;
  delay?: number;
}> = ({value, label, note, accent = COLORS.gold, delay = 0}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        ...enter(frame, delay, 36),
        width: 600,
        minHeight: 280,
        padding: '42px 48px',
        borderTop: `4px solid ${accent}`,
        backgroundColor: 'rgba(255,255,255,0.84)',
        boxShadow: '0 20px 70px rgba(7,24,39,0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{fontFamily: fontMono, fontSize: 96, lineHeight: 1, fontWeight: 700, color: COLORS.blue}}>
        {value}
      </div>
      <div style={{fontSize: 34, fontWeight: 700, color: COLORS.ink}}>{label}</div>
      <div style={{fontSize: 21, lineHeight: 1.45, color: COLORS.mist}}>{note}</div>
    </div>
  );
};

const HookScene: React.FC<{meta: SceneMeta; duration: number}> = ({meta, duration}) => {
  const frame = useCurrentFrame();
  return (
    <SceneFrame meta={meta} durationInFrames={duration}>
      <div
        style={{
          position: 'absolute',
          inset: '160px 120px 220px',
          display: 'flex',
          flexDirection: 'column',
          gap: 44,
        }}
      >
        <div style={enter(frame, 4)}>
          <Kicker>ENTERPRISE AI · PILOT TO PRODUCTION</Kicker>
          <div style={{height: 18}} />
          <Headline size={96}>{meta.headline}</Headline>
        </div>
        <div style={{display: 'flex', gap: 34}}>
          <StatCard
            value="95%"
            label="未产生可衡量的损益影响"
            note="MIT NANDA 报告估算；研究定义与样本需结合原文理解"
            delay={14}
          />
          <StatCard
            value="<13%"
            label="概念验证进入生产"
            note="IDC EMEA：平均 40 个 GenAI PoC，约 5 个进入生产"
            accent={COLORS.blue}
            delay={24}
          />
        </div>
      </div>
    </SceneFrame>
  );
};

const GapScene: React.FC<{meta: SceneMeta; duration: number}> = ({meta, duration}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [42, 86], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <SceneFrame meta={meta} durationInFrames={duration} dark>
      <div style={{position: 'absolute', inset: '170px 120px 220px', display: 'flex', flexDirection: 'column', gap: 48}}>
        <div style={enter(frame, 4)}>
          <Kicker dark>THE TRANSLATION GAP</Kicker>
          <div style={{height: 16}} />
          <Headline size={96} dark>{meta.headline}</Headline>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 210px 1fr', alignItems: 'stretch', gap: 28}}>
          <div
            style={{
              ...enter(frame, 16),
              backgroundColor: 'rgba(255,253,248,0.08)',
              padding: '38px 42px',
              border: '1px solid rgba(255,253,248,0.14)',
            }}
          >
            <div style={{fontFamily: fontMono, color: '#E4C584', fontSize: 22, letterSpacing: 2}}>BUSINESS</div>
            <div style={{fontFamily: fontSerif, fontSize: 52, lineHeight: 1.3, marginTop: 24}}>“把这个流程自动化”</div>
            <div style={{marginTop: 30, color: 'rgba(255,253,248,0.58)', fontSize: 26, lineHeight: 1.7}}>
              14 个系统取数<br />47 种定制要求<br />几十条例外规则
            </div>
          </div>
          <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{position: 'absolute', width: 150, height: 1, backgroundColor: 'rgba(255,255,255,0.25)'}} />
            <div
              style={{
                width: 86,
                height: 86,
                borderRadius: '50%',
                border: `2px solid rgba(200,167,102,${0.35 + progress * 0.5})`,
                color: '#E4C584',
                backgroundColor: COLORS.ink,
                display: 'grid',
                placeItems: 'center',
                fontFamily: fontMono,
                fontSize: 38,
                rotate: `${interpolate(progress, [0, 1], [-12, 0])}deg`,
              }}
            >
              ≠
            </div>
          </div>
          <div
            style={{
              ...enter(frame, 24),
              backgroundColor: 'rgba(255,253,248,0.08)',
              padding: '38px 42px',
              border: '1px solid rgba(255,253,248,0.14)',
            }}
          >
            <div style={{fontFamily: fontMono, color: '#E4C584', fontSize: 22, letterSpacing: 2}}>TECH</div>
            <div style={{fontFamily: fontSerif, fontSize: 52, lineHeight: 1.3, marginTop: 24}}>“做接口，再接模型”</div>
            <div style={{marginTop: 30, color: 'rgba(255,253,248,0.58)', fontSize: 26, lineHeight: 1.7}}>
              原型按时交付<br />隐性经验丢失<br />真实流程无法运行
            </div>
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};

const CompanyScene: React.FC<{meta: SceneMeta; duration: number}> = ({meta, duration}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, duration], [1.02, 1.085], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <SceneFrame meta={meta} durationInFrames={duration}>
      <div style={{position: 'absolute', inset: '160px 100px 220px', display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 70}}>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30}}>
          <div style={enter(frame, 4)}>
            <Img
              src={staticFile('assets/maisa-logo.png')}
              style={{width: 300, height: 'auto', objectFit: 'contain', filter: 'brightness(0)'}}
            />
          </div>
          <div style={enter(frame, 12)}>
            <Headline size={84} width={780}>{meta.headline}</Headline>
          </div>
          <div style={{...enter(frame, 22), display: 'flex', gap: 18, alignItems: 'baseline'}}>
            <span style={{fontFamily: fontMono, fontSize: 92, lineHeight: 1, color: COLORS.blue, fontWeight: 700}}>$25M</span>
            <span style={{fontSize: 30, color: COLORS.mist}}>SEED · 2025</span>
          </div>
          <div style={{...enter(frame, 30), fontSize: 27, lineHeight: 1.55, color: COLORS.mist}}>
            Creandum 领投<br />Valencia × San Francisco
          </div>
        </div>
        <div style={{...enter(frame, 12), overflow: 'hidden', position: 'relative', boxShadow: '0 30px 90px rgba(7,24,39,0.16)'}}>
          <Img
            src={staticFile('assets/maisa-founders.jpg')}
            style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', scale: zoom}}
          />
          <div
            style={{
              position: 'absolute',
              left: 28,
              bottom: 26,
              padding: '13px 18px',
              backgroundColor: 'rgba(7,24,39,0.88)',
              color: COLORS.paper,
              fontSize: 21,
            }}
          >
            Co-founders · David Villalón &amp; Manuel Romero
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};

const FlowStep: React.FC<{index: string; title: string; note: string; delay: number}> = ({index, title, note, delay}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{...enter(frame, delay), display: 'grid', gridTemplateColumns: '70px 1fr', gap: 22, alignItems: 'start'}}>
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          backgroundColor: COLORS.blue,
          color: COLORS.paper,
          fontFamily: fontMono,
          fontSize: 23,
        }}
      >
        {index}
      </div>
      <div>
        <div style={{fontSize: 34, fontWeight: 700}}>{title}</div>
        <div style={{fontSize: 23, color: COLORS.mist, marginTop: 8}}>{note}</div>
      </div>
    </div>
  );
};

const StudioScene: React.FC<{meta: SceneMeta; duration: number}> = ({meta, duration}) => {
  const frame = useCurrentFrame();
  return (
    <SceneFrame meta={meta} durationInFrames={duration}>
      <div style={{position: 'absolute', inset: '150px 100px 260px', display: 'grid', gridTemplateColumns: '0.82fr 1.18fr', gap: 60}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 42, justifyContent: 'center'}}>
          <div style={enter(frame, 4)}>
            <Kicker>NATURAL LANGUAGE ONBOARDING</Kicker>
            <div style={{height: 16}} />
            <Headline size={92}>不用写代码<br />直接“带教”AI</Headline>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
            <FlowStep index="01" title="描述任务" note="目标、规则、工具，用自然语言说明" delay={14} />
            <FlowStep index="02" title="测试反馈" note="让最懂工作的人直接修正" delay={24} />
            <FlowStep index="03" title="部署运行" note="进入现有系统与真实流程" delay={34} />
          </div>
        </div>
        <div style={{...enter(frame, 15), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Img
            src={staticFile('assets/maisa-build-worker.png')}
            style={{
              width: '104%',
              height: '104%',
              objectFit: 'contain',
              translate: `${interpolate(frame, [0, duration], [0, 14], {extrapolateRight: 'clamp'})}px 0`,
            }}
          />
        </div>
      </div>
    </SceneFrame>
  );
};

const EngineNode: React.FC<{label: string; note: string; active?: boolean; delay: number}> = ({label, note, active, delay}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        ...enter(frame, delay),
        width: 330,
        minHeight: 190,
        padding: '34px 30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: active ? COLORS.blue : COLORS.white,
        color: active ? COLORS.paper : COLORS.ink,
        borderTop: `4px solid ${active ? COLORS.gold : COLORS.line}`,
        boxShadow: '0 18px 50px rgba(7,24,39,0.09)',
      }}
    >
      <div style={{fontFamily: fontMono, fontSize: 38, fontWeight: 700}}>{label}</div>
      <div style={{fontSize: 22, marginTop: 18, color: active ? 'rgba(255,253,248,0.68)' : COLORS.mist}}>{note}</div>
    </div>
  );
};

const Arrow: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const width = interpolate(frame, [delay, delay + 18], [0, 110], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{width: 130, display: 'flex', alignItems: 'center'}}>
      <div style={{width, height: 2, backgroundColor: COLORS.gold}} />
      <div style={{width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: `10px solid ${COLORS.gold}`}} />
    </div>
  );
};

const KpuScene: React.FC<{meta: SceneMeta; duration: number}> = ({meta, duration}) => {
  const frame = useCurrentFrame();
  return (
    <SceneFrame meta={meta} durationInFrames={duration}>
      <div style={{position: 'absolute', inset: '165px 110px 220px', display: 'flex', flexDirection: 'column', gap: 70}}>
        <div style={{...enter(frame, 4), display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <div>
            <Kicker>KNOWLEDGE PROCESSING UNIT</Kicker>
            <div style={{height: 16}} />
            <Headline size={92}>{meta.headline}</Headline>
          </div>
          <div style={{fontFamily: fontMono, color: COLORS.mist, fontSize: 22, textAlign: 'right', lineHeight: 1.7}}>
            MODEL-AGNOSTIC<br />CLOUD / PRIVATE
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <EngineNode label="LLM" note="理解指令与内容" delay={14} />
          <Arrow delay={27} />
          <EngineNode label="KPU" note="拆解 · 推理 · 校验" active delay={32} />
          <Arrow delay={45} />
          <EngineNode label="WORK" note="按业务逻辑执行" delay={50} />
        </div>
        <div style={{...enter(frame, 58), display: 'flex', justifyContent: 'center', gap: 18}}>
          {['SaaS', 'API', 'Legacy', 'Private Cloud'].map((item) => (
            <span key={item} style={{padding: '12px 22px', border: `1px solid ${COLORS.line}`, color: COLORS.mist, fontFamily: fontMono, fontSize: 20}}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </SceneFrame>
  );
};

const AuditScene: React.FC<{meta: SceneMeta; duration: number}> = ({meta, duration}) => {
  const frame = useCurrentFrame();
  return (
    <SceneFrame meta={meta} durationInFrames={duration} dark>
      <div style={{position: 'absolute', inset: '160px 100px 220px', display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 70}}>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 34}}>
          <div style={enter(frame, 4)}>
            <Kicker dark>AUDITABLE BY DESIGN</Kicker>
            <div style={{height: 16}} />
            <Headline size={92} dark>{meta.headline}</Headline>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
            {[
              ['01', '输入与证据'],
              ['02', '动作与工具调用'],
              ['03', '判断与输出'],
            ].map(([number, label], index) => (
              <div
                key={number}
                style={{
                  ...enter(frame, 18 + index * 9),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                  padding: '20px 0',
                  borderBottom: '1px solid rgba(255,253,248,0.14)',
                  fontSize: 30,
                }}
              >
                <span style={{fontFamily: fontMono, color: '#E4C584', fontSize: 22}}>{number}</span>
                {label}
              </div>
            ))}
          </div>
          <div style={{...enter(frame, 48), fontSize: 24, color: 'rgba(255,253,248,0.58)', lineHeight: 1.7}}>
            可检查 · 可复核 · 可追责
          </div>
        </div>
        <div
          style={{
            ...enter(frame, 14),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,253,248,0.05)',
            border: '1px solid rgba(255,253,248,0.11)',
            padding: 30,
          }}
        >
          <Img
            src={staticFile('assets/maisa-chain-of-work.jpg')}
            style={{width: '100%', height: '100%', objectFit: 'contain', scale: interpolate(frame, [0, duration], [0.98, 1.03], {extrapolateRight: 'clamp'})}}
          />
        </div>
      </div>
    </SceneFrame>
  );
};

const CasePanel: React.FC<{
  label: string;
  title: string;
  detail: string;
  stats: Array<{value: string; label: string}>;
  delay: number;
}> = ({label, title, detail, stats, delay}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        ...enter(frame, delay, 42),
        minHeight: 455,
        padding: '42px 44px',
        backgroundColor: COLORS.white,
        borderTop: `4px solid ${COLORS.gold}`,
        boxShadow: '0 22px 75px rgba(7,24,39,0.09)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{fontFamily: fontMono, fontSize: 20, letterSpacing: 2, color: COLORS.gold}}>{label}</div>
      <div style={{fontFamily: fontSerif, fontSize: 46, lineHeight: 1.25, fontWeight: 700, marginTop: 18}}>{title}</div>
      <div style={{fontSize: 25, lineHeight: 1.6, color: COLORS.mist, marginTop: 20}}>{detail}</div>
      <div style={{marginTop: 'auto', display: 'flex', gap: 38, paddingTop: 30}}>
        {stats.map((stat) => (
          <div key={stat.value}>
            <div style={{fontFamily: fontMono, fontSize: 50, color: COLORS.blue, fontWeight: 700}}>{stat.value}</div>
            <div style={{fontSize: 20, color: COLORS.mist, marginTop: 8}}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CasesScene: React.FC<{meta: SceneMeta; duration: number}> = ({meta, duration}) => {
  const frame = useCurrentFrame();
  return (
    <SceneFrame meta={meta} durationInFrames={duration}>
      <div style={{position: 'absolute', inset: '155px 100px 220px', display: 'flex', flexDirection: 'column', gap: 42}}>
        <div style={{...enter(frame, 4), display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <div>
            <Kicker>FINANCIAL SERVICES</Kicker>
            <div style={{height: 14}} />
            <Headline size={88}>{meta.headline}</Headline>
          </div>
          <div style={{fontSize: 22, color: COLORS.rose, border: `1px solid ${COLORS.rose}`, padding: '12px 18px'}}>客户名称未披露</div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34}}>
          <CasePanel
            label="CASE A · GLOBAL INVESTMENT BANK"
            title="媒体筛查与声誉风险"
            detail="业务团队完成初次培训后，自行搭建筛查、事实提取、风险判断与审计摘要流程。"
            stats={[{value: '0', label: '工程师参与搭建'}]}
            delay={16}
          />
          <CasePanel
            label="CASE B · FINANCIAL SERVICES"
            title="交易核对与对账"
            detail="公司称，Studio 进入生产后显著减少误报，并提升人均处理效率。"
            stats={[
              {value: '10×', label: '人均效率'},
              {value: '99%', label: '误报过滤'},
              {value: '3', label: '上手培训'},
            ]}
            delay={26}
          />
        </div>
      </div>
    </SceneFrame>
  );
};

const CaveatScene: React.FC<{meta: SceneMeta; duration: number}> = ({meta, duration}) => {
  const frame = useCurrentFrame();
  return (
    <SceneFrame meta={meta} durationInFrames={duration}>
      <div style={{position: 'absolute', inset: '165px 120px 220px', display: 'grid', gridTemplateColumns: '0.84fr 1.16fr', gap: 80}}>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div style={enter(frame, 4)}>
            <Kicker>EDITORIAL NOTE</Kicker>
            <div style={{height: 18}} />
            <Headline size={92}>{meta.headline}</Headline>
          </div>
          <div
            style={{
              ...enter(frame, 20),
              marginTop: 42,
              padding: '28px 30px',
              backgroundColor: '#F5E9EC',
              borderLeft: `4px solid ${COLORS.rose}`,
              color: '#6B3347',
              fontSize: 24,
              lineHeight: 1.6,
            }}
          >
            案例指标来自公司披露<br />客户名称未公开，仍需独立验证
          </div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, alignContent: 'center'}}>
          <div
            style={{
              ...enter(frame, 16),
              minHeight: 410,
              padding: '40px 34px',
              backgroundColor: COLORS.cloud,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{fontFamily: fontMono, fontSize: 21, color: COLORS.mist}}>BEFORE</div>
            <div style={{fontFamily: fontSerif, fontSize: 45, lineHeight: 1.35}}>发现问题<br />提出需求<br />等待交付</div>
            <div style={{fontSize: 24, color: COLORS.mist}}>业务知识经过多次翻译</div>
          </div>
          <div
            style={{
              ...enter(frame, 28),
              minHeight: 410,
              padding: '40px 34px',
              backgroundColor: COLORS.blue,
              color: COLORS.paper,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{fontFamily: fontMono, fontSize: 21, color: '#E4C584'}}>AFTER</div>
            <div style={{fontFamily: fontSerif, fontSize: 45, lineHeight: 1.35}}>描述经验<br />固化流程<br />持续改进</div>
            <div style={{fontSize: 24, color: 'rgba(255,253,248,0.66)'}}>技术与治理团队设定边界</div>
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};

const OutroScene: React.FC<{meta: SceneMeta; duration: number}> = ({meta, duration}) => {
  const frame = useCurrentFrame();
  return (
    <SceneFrame meta={meta} durationInFrames={duration} dark>
      <div style={{position: 'absolute', inset: '175px 140px 220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
        <div style={enter(frame, 4)}>
          <Kicker dark>FROM USING AI → BUILDING AI</Kicker>
        </div>
        <div style={{height: 24}} />
        <div style={enter(frame, 13)}>
          <Headline size={108} width={1450} dark>{meta.headline}</Headline>
        </div>
        <div
          style={{
            ...enter(frame, 28),
            width: 1120,
            marginTop: 36,
            color: 'rgba(255,253,248,0.64)',
            fontSize: 31,
            lineHeight: 1.65,
          }}
        >
          真正的瓶颈，也许不是模型不够强<br />而是最懂业务的人，一直站在系统之外
        </div>
        <div style={{...enter(frame, 46), marginTop: 58}}>
          <Img src={staticFile('assets/wavesight-logo.svg')} style={{width: 300, height: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.92}} />
        </div>
      </div>
    </SceneFrame>
  );
};

const SceneSwitch: React.FC<{scene: TimelineScene}> = ({scene}) => {
  const meta = sceneData.find((item) => item.id === scene.id);
  if (!meta) throw new Error(`Missing scene metadata for ${scene.id}`);
  const props = {meta, duration: scene.durationInFrames};
  switch (scene.id) {
    case '01-hook':
      return <HookScene {...props} />;
    case '02-gap':
      return <GapScene {...props} />;
    case '03-company':
      return <CompanyScene {...props} />;
    case '04-studio':
      return <StudioScene {...props} />;
    case '05-kpu':
      return <KpuScene {...props} />;
    case '06-audit':
      return <AuditScene {...props} />;
    case '07-cases':
      return <CasesScene {...props} />;
    case '08-caveat':
      return <CaveatScene {...props} />;
    case '09-outro':
      return <OutroScene {...props} />;
    default:
      throw new Error(`Unknown scene ${scene.id}`);
  }
};

export const MaisaCaseStudy: React.FC<{title: string}> = () => {
  const {durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.ink}}>
      <Audio
        src={staticFile('audio/piano-bed.m4a')}
        volume={(frame) =>
          interpolate(frame, [0, 12, 18, durationInFrames - 90, durationInFrames], [0, 0.34, 0.24, 0.24, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />
      {timeline.scenes.map((scene) => (
        <Sequence key={scene.id} from={scene.startFrame} durationInFrames={scene.durationInFrames}>
          <SceneSwitch scene={scene} />
          <Sequence from={scene.audioStartFrame}>
            <Audio src={staticFile(scene.audioFile)} volume={1} />
          </Sequence>
        </Sequence>
      ))}
      <CaptionTrack captions={captions} />
    </AbsoluteFill>
  );
};
