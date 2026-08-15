import { redirect } from 'next/navigation';

// Superseded by /about-us/president-message ("Director Message" ->
// "President Message", matching Sunil's actual title of President &
// Founder). This just forwards old bookmarks/links so they still land
// somewhere real.
export default function DirectorMessagePage() {
  redirect('/about-us/president-message');
}
