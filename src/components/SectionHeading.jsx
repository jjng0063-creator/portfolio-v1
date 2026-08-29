export default function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="mb-12 max-w-2xl">
      {eyebrow && (
        <p
          data-reveal=""
          className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h2
        data-reveal=""
        className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {children && (
        <p
          data-reveal=""
          className="mt-4 max-w-[60ch] text-pretty leading-relaxed text-muted-foreground">
          {children}
        </p>
      )}
    </div>
  )
}
