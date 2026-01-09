export const songs = [
  // 1960s
  { id: 1, title: "I Want to Hold Your Hand", artist: "The Beatles", year: 1963, youtubeId: "jenWdylTtzs" },
  { id: 2, title: "Like a Rolling Stone", artist: "Bob Dylan", year: 1965, youtubeId: "IwOfCgkyEj0" },
  { id: 3, title: "Respect", artist: "Aretha Franklin", year: 1967, youtubeId: "6FOUqQt3Kg0" },
  { id: 4, title: "Good Vibrations", artist: "The Beach Boys", year: 1966, youtubeId: "Eab_beh07HU" },
  { id: 5, title: "Hey Jude", artist: "The Beatles", year: 1968, youtubeId: "A_MjCqQoLLA" },
  
  // 1970s
  { id: 6, title: "Bohemian Rhapsody", artist: "Queen", year: 1975, youtubeId: "fJ9rUzIMcZQ" },
  { id: 7, title: "Stairway to Heaven", artist: "Led Zeppelin", year: 1971, youtubeId: "QkF3oxziUI4" },
  { id: 8, title: "Hotel California", artist: "Eagles", year: 1977, youtubeId: "EqPtz5qN7HM" },
  { id: 9, title: "Stayin' Alive", artist: "Bee Gees", year: 1977, youtubeId: "fNFzfwLM72c" },
  { id: 10, title: "Imagine", artist: "John Lennon", year: 1971, youtubeId: "YkgkThdzX-8" },
  
  // 1980s
  { id: 11, title: "Billie Jean", artist: "Michael Jackson", year: 1983, youtubeId: "Zi_XLOBDo_Y" },
  { id: 12, title: "Sweet Child O' Mine", artist: "Guns N' Roses", year: 1987, youtubeId: "1w7OgIMMRc4" },
  { id: 13, title: "Livin' on a Prayer", artist: "Bon Jovi", year: 1986, youtubeId: "lDK9QqIzhwk" },
  { id: 14, title: "Like a Prayer", artist: "Madonna", year: 1989, youtubeId: "79fzeNUqQbQ" },
  { id: 15, title: "Every Breath You Take", artist: "The Police", year: 1983, youtubeId: "OMOGaugKpzs" },
  
  // 1990s
  { id: 16, title: "Smells Like Teen Spirit", artist: "Nirvana", year: 1991, youtubeId: "hTWKbfoikeg" },
  { id: 17, title: "Wonderwall", artist: "Oasis", year: 1995, youtubeId: "bx1Bh8ZvH84" },
  { id: 18, title: "Wannabe", artist: "Spice Girls", year: 1996, youtubeId: "gJLIiF15wjQ" },
  { id: 19, title: "No Scrubs", artist: "TLC", year: 1999, youtubeId: "FrLequ6dUdM" },
  { id: 20, title: "...Baby One More Time", artist: "Britney Spears", year: 1998, youtubeId: "C-u5WLJ9Yk4" },
  
  // 2000s
  { id: 21, title: "Crazy in Love", artist: "Beyoncé ft. Jay-Z", year: 2003, youtubeId: "ViwtNLUqkMY" },
  { id: 22, title: "Hey Ya!", artist: "OutKast", year: 2003, youtubeId: "PWgvGjAhvIw" },
  { id: 23, title: "Rehab", artist: "Amy Winehouse", year: 2006, youtubeId: "KUmZp8pR1uc" },
  { id: 24, title: "Umbrella", artist: "Rihanna ft. Jay-Z", year: 2007, youtubeId: "CvBfHwUxHIk" },
  { id: 25, title: "Mr. Brightside", artist: "The Killers", year: 2004, youtubeId: "gGdGFtwCNBE" },
  
  // 2010s
  { id: 26, title: "Rolling in the Deep", artist: "Adele", year: 2010, youtubeId: "rYEDA3JcQqw" },
  { id: 27, title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", year: 2014, youtubeId: "OPf0YbXqDm0" },
  { id: 28, title: "Happy", artist: "Pharrell Williams", year: 2013, youtubeId: "ZbZSe6N_BXs" },
  { id: 29, title: "Shape of You", artist: "Ed Sheeran", year: 2017, youtubeId: "JGwWNGJdvx8" },
  { id: 30, title: "Bad Guy", artist: "Billie Eilish", year: 2019, youtubeId: "DyDfgMOUjCI" },
  
  // 2020s
  { id: 31, title: "Blinding Lights", artist: "The Weeknd", year: 2020, youtubeId: "4NRXx6U8ABQ" },
  { id: 32, title: "Levitating", artist: "Dua Lipa", year: 2020, youtubeId: "TUVcZfQe-Kw" },
  { id: 33, title: "drivers license", artist: "Olivia Rodrigo", year: 2021, youtubeId: "ZmDBbnmKpqQ" },
  { id: 34, title: "Anti-Hero", artist: "Taylor Swift", year: 2022, youtubeId: "b1kbLwvqugk" },
  { id: 35, title: "Flowers", artist: "Miley Cyrus", year: 2023, youtubeId: "G7KNmW9a75Y" },
];

export function getRandomSong(excludeIds = []) {
  const availableSongs = songs.filter(song => !excludeIds.includes(song.id));
  return availableSongs[Math.floor(Math.random() * availableSongs.length)];
}
