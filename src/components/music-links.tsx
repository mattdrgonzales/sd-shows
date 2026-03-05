import {
  spotifySearchUrl,
  appleMusicSearchUrl,
  youtubeSearchUrl,
} from "@/lib/music-links";

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function AppleMusicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
      <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043A5.022 5.022 0 0019.7.165a10.14 10.14 0 00-1.898-.133C17.438.017 17.073 0 14.753 0H9.244c-2.32 0-2.687.017-3.053.032a10.14 10.14 0 00-1.898.134 5.02 5.02 0 00-1.873.714 4.965 4.965 0 00-1.464 1.463 5.013 5.013 0 00-.714 1.873 10.14 10.14 0 00-.133 1.898C.095 6.446.078 6.811.078 9.132v5.509c0 2.321.017 2.686.032 3.052a10.14 10.14 0 00.134 1.898 5.03 5.03 0 00.714 1.875 4.965 4.965 0 001.464 1.463 5.01 5.01 0 001.873.714c.624.133 1.261.18 1.898.199.366.014.731.032 3.053.032h5.509c2.32 0 2.686-.018 3.052-.032a10.14 10.14 0 001.898-.2 5.02 5.02 0 001.875-.714 4.988 4.988 0 002.177-3.338c.133-.624.18-1.261.199-1.898.014-.366.032-.731.032-3.052V9.132c-.002-2.321-.02-2.686-.034-3.008zM16.94 17.467a.585.585 0 01-.586.593.562.562 0 01-.207-.04 6.455 6.455 0 00-2.654-.559 6.425 6.425 0 00-2.645.556.56.56 0 01-.207.043.584.584 0 01-.586-.593v-.028a.57.57 0 01.37-.533 7.622 7.622 0 013.068-.634 7.621 7.621 0 013.077.64.572.572 0 01.37.533v.022zm1.72-2.588a.585.585 0 01-.593.586.547.547 0 01-.256-.063c-1.16-.665-2.6-1.04-4.052-1.04-1.456 0-2.879.374-4.047 1.042a.547.547 0 01-.253.06.584.584 0 01-.593-.587.574.574 0 01.328-.516 9.613 9.613 0 014.565-1.137c1.723 0 3.35.42 4.573 1.14a.574.574 0 01.328.515zm1.87-2.905a.589.589 0 01-.592.59.579.579 0 01-.29-.078 11.157 11.157 0 00-5.894-1.608 11.15 11.15 0 00-5.874 1.603.579.579 0 01-.29.082.589.589 0 01-.594-.589v-.008c0-.224.124-.427.319-.53A12.334 12.334 0 0013.753 10a12.34 12.34 0 006.468 1.748.564.564 0 01.319.53l-.01.005v-.009z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function MusicLinks({ artist }: { artist: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <a
        href={spotifySearchUrl(artist)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-[#1DB954]"
        title={`Search ${artist} on Spotify`}
      >
        <SpotifyIcon />
      </a>
      <a
        href={appleMusicSearchUrl(artist)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-[#FA243C]"
        title={`Search ${artist} on Apple Music`}
      >
        <AppleMusicIcon />
      </a>
      <a
        href={youtubeSearchUrl(artist)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-[#FF0000]"
        title={`Search ${artist} on YouTube`}
      >
        <YoutubeIcon />
      </a>
    </div>
  );
}
