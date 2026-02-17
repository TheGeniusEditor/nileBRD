type LegacyFrameProps = {
  src: string;
  title: string;
};

export default function LegacyFrame({ src, title }: LegacyFrameProps) {
  return (
    <div className="legacy-wrap">
      <iframe className="legacy-frame" src={src} title={title} />
    </div>
  );
}
