type LoaderProps = {
  label?: string;
};

export default function Loader({ label = "Loading..." }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />
      <p className="text-sm text-text-muted">{label}</p>
    </div>
  );
}
