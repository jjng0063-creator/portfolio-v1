import { profile } from '@/data/profile'

export default function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-medium text-foreground">{profile.name}</span>
          <span className="tnum"> © {new Date().getFullYear()}</span>
        </p>
        {profile.location && <p>{profile.location}</p>}
      </div>
    </footer>
  )
}
