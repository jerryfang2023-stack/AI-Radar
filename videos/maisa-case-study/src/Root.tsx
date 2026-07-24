import {Composition} from 'remotion';
import timeline from '../public/data/timeline.json';
import {MaisaCaseStudy} from './MaisaCaseStudy';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MaisaCaseStudy"
      component={MaisaCaseStudy}
      durationInFrames={timeline.durationInFrames}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: '一家公司融了 2500 万美元，只为让不会编程的人自己建 AI',
      }}
    />
  );
};
