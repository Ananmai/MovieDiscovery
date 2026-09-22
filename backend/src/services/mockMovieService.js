import { transformMovieSummary, transformMovieDetails, GENRE_MAP } from './transformer.js';

// Comprehensive dataset of popular films with real TMDB asset paths
export const MOCK_MOVIES = [
  {
    id: 157336,
    title: 'Interstellar',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/rAiYTsqBkRefDs8v2qiAlqJV0Y8.jpg',
    release_date: '2014-11-05',
    vote_average: 8.4,
    vote_count: 35200,
    popularity: 145.2,
    genre_ids: [12, 18, 878],
    runtime: 169,
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    credits: {
      cast: [
        { id: 10297, name: 'Matthew McConaughey', character: 'Cooper', profile_path: '/eDzgPnG0n9e8tQOszpYQd2lE1dY.jpg' },
        { id: 1813, name: 'Anne Hathaway', character: 'Brand', profile_path: '/tLpq59ap0sD1zW3A7nN4W7oV4j6.jpg' },
        { id: 2038, name: 'Jessica Chastain', character: 'Murph', profile_path: '/nkFrJqgY3h5hH1gqV2r0x6T9m4A.jpg' },
        { id: 3895, name: 'Michael Caine', character: 'Professor Brand', profile_path: '/bV3vM9A5Jz0S5tV4d6R8P3mK.jpg' },
      ],
      crew: [{ id: 525, name: 'Christopher Nolan', job: 'Director' }],
    },
    videos: {
      results: [{ key: 'zSWdZVtXT7E', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }],
    },
  },
  {
    id: 27205,
    title: 'Inception',
    overview: 'Cobb, a skilled thief who steals corporate secrets through the use of dream-sharing technology, is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdrop_path: '/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    release_date: '2010-07-15',
    vote_average: 8.4,
    vote_count: 36400,
    popularity: 132.8,
    genre_ids: [28, 12, 878],
    runtime: 148,
    tagline: 'Your mind is the scene of the crime.',
    credits: {
      cast: [
        { id: 6193, name: 'Leonardo DiCaprio', character: 'Dom Cobb', profile_path: '/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg' },
        { id: 24045, name: 'Joseph Gordon-Levitt', character: 'Arthur', profile_path: '/4z2sSj6XbH0Vn3b1W4x5a6j.jpg' },
        { id: 27578, name: 'Elliot Page', character: 'Ariadne', profile_path: '/2d87eLwW4qG7y0d2sB4g8f.jpg' },
        { id: 2524, name: 'Tom Hardy', character: 'Eames', profile_path: '/yVGF93vjW320Wp4aX2X9Dk4w.jpg' },
      ],
      crew: [{ id: 525, name: 'Christopher Nolan', job: 'Director' }],
    },
    videos: {
      results: [{ key: 'YoHD9XEInc0', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }],
    },
  },
  {
    id: 155,
    title: 'The Dark Knight',
    overview: 'Batman raises the stakes in his war on crime. With the help of allies Lt. Jim Gordon and DA Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: '/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
    release_date: '2008-07-16',
    vote_average: 8.5,
    vote_count: 32500,
    popularity: 120.4,
    genre_ids: [18, 28, 80, 53],
    runtime: 152,
    tagline: 'Welcome to a world without rules.',
    credits: {
      cast: [
        { id: 3894, name: 'Christian Bale', character: 'Bruce Wayne / Batman' },
        { id: 1810, name: 'Heath Ledger', character: 'Joker' },
        { id: 64, name: 'Gary Oldman', character: 'James Gordon' },
      ],
      crew: [{ id: 525, name: 'Christopher Nolan', job: 'Director' }],
    },
    videos: {
      results: [{ key: 'EXeTwQWrcwY', name: 'Main Trailer', site: 'YouTube', type: 'Trailer', official: true }],
    },
  },
  {
    id: 693134,
    title: 'Dune: Part Two',
    overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.',
    poster_path: '/czembW0Rk1Ke7lCJGhk4TGmm5Q.jpg',
    backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s520027.jpg',
    release_date: '2024-02-27',
    vote_average: 8.2,
    vote_count: 5300,
    popularity: 210.5,
    genre_ids: [878, 12],
    runtime: 166,
    tagline: 'Long live the fighters.',
    credits: {
      cast: [
        { id: 1190668, name: 'Timothée Chalamet', character: 'Paul Atreides' },
        { id: 505710, name: 'Zendaya', character: 'Chani' },
        { id: 935, name: 'Rebecca Ferguson', character: 'Lady Jessica Atreides' },
      ],
      crew: [{ id: 137427, name: 'Denis Villeneuve', job: 'Director' }],
    },
    videos: {
      results: [{ key: 'Way9Dexny3w', name: 'Official Trailer 3', site: 'YouTube', type: 'Trailer', official: true }],
    },
  },
  {
    id: 872585,
    title: 'Oppenheimer',
    overview: 'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II.',
    poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop_path: '/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg',
    release_date: '2023-07-19',
    vote_average: 8.1,
    vote_count: 8700,
    popularity: 180.2,
    genre_ids: [18, 36],
    runtime: 180,
    tagline: 'The world forever changes.',
    credits: {
      cast: [
        { id: 2037, name: 'Cillian Murphy', character: 'J. Robert Oppenheimer' },
        { id: 3223, name: 'Robert Downey Jr.', character: 'Lewis Strauss' },
        { id: 1373737, name: 'Florence Pugh', character: 'Jean Tatlock' },
      ],
      crew: [{ id: 525, name: 'Christopher Nolan', job: 'Director' }],
    },
    videos: {
      results: [{ key: 'uYPbbksJxIg', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }],
    },
  },
  {
    id: 324857,
    title: 'Spider-Man: Into the Spider-Verse',
    overview: 'Teen Miles Morales becomes the new Spider-Man and joins other Spider-Heroes from alternate universes to stop a threat to all reality.',
    poster_path: '/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',
    backdrop_path: '/7d6Gitkn02aqO501G472eL7b5j.jpg',
    release_date: '2018-12-06',
    vote_average: 8.4,
    vote_count: 15100,
    popularity: 115.8,
    genre_ids: [16, 28, 12, 878],
    runtime: 117,
    tagline: 'More than one wears the mask.',
    credits: {
      cast: [
        { id: 587506, name: 'Shameik Moore', character: 'Miles Morales (voice)' },
        { id: 1083010, name: 'Hailee Steinfeld', character: 'Gwen Stacy (voice)' },
      ],
      crew: [{ id: 12891, name: 'Bob Persichetti', job: 'Director' }],
    },
    videos: {
      results: [{ key: 'g4Hbz2jLxvQ', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }],
    },
  },
  {
    id: 569094,
    title: 'Spider-Man: Across the Spider-Verse',
    overview: 'After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    poster_path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop_path: '/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    release_date: '2023-05-31',
    vote_average: 8.4,
    vote_count: 6700,
    popularity: 160.4,
    genre_ids: [16, 28, 12, 878],
    runtime: 140,
    tagline: 'It\'s how you wear the mask that matters.',
    credits: {
      cast: [
        { id: 587506, name: 'Shameik Moore', character: 'Miles Morales (voice)' },
        { id: 1083010, name: 'Hailee Steinfeld', character: 'Gwen Stacy (voice)' },
      ],
      crew: [{ id: 1017983, name: 'Joaquim Dos Santos', job: 'Director' }],
    },
    videos: {
      results: [{ key: 'cqGjhVJWtEg', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }],
    },
  },
  {
    id: 496243,
    title: 'Parasite',
    overview: 'All unemployed, Ki-taek\'s family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.',
    poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdrop_path: '/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg',
    release_date: '2019-05-30',
    vote_average: 8.5,
    vote_count: 17800,
    popularity: 98.4,
    genre_ids: [35, 53, 18],
    runtime: 132,
    tagline: 'Act like you own the place.',
    credits: {
      cast: [
        { id: 20738, name: 'Song Kang-ho', character: 'Kim Ki-taek' },
        { id: 1253360, name: 'Choi Woo-shik', character: 'Kim Ki-woo' },
      ],
      crew: [{ id: 21684, name: 'Bong Joon-ho', job: 'Director' }],
    },
    videos: {
      results: [{ key: '5xH0hhMBcGwo', name: 'Trailer', site: 'YouTube', type: 'Trailer', official: true }],
    },
  },
  {
    id: 299534,
    title: 'Avengers: Endgame',
    overview: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos’ actions and restore balance to the universe.',
    poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    backdrop_path: '/7RyHsO4yDXtBv1zJW8ACSLNT0d5.jpg',
    release_date: '2019-04-24',
    vote_average: 8.3,
    vote_count: 24800,
    popularity: 140.7,
    genre_ids: [12, 878, 28],
    runtime: 181,
    tagline: 'Part of the journey is the end.',
    credits: {
      cast: [
        { id: 3223, name: 'Robert Downey Jr.', character: 'Tony Stark / Iron Man' },
        { id: 16828, name: 'Chris Evans', character: 'Steve Rogers / Captain America' },
        { id: 1245, name: 'Scarlett Johansson', character: 'Natasha Romanoff / Black Widow' },
      ],
      crew: [{ id: 19271, name: 'Anthony Russo', job: 'Director' }],
    },
    videos: {
      results: [{ key: 'TcMBFSGVi1c', name: 'Official Trailer', site: 'YouTube', type: 'Trailer', official: true }],
    },
  },
  {
    id: 545611,
    title: 'Everything Everywhere All at Once',
    overview: 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what’s important to her by connecting with the lives she could have led in other universes.',
    poster_path: '/w3LxiVYPqrlexP07AlNVpsvdwAs.jpg',
    backdrop_path: '/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
    release_date: '2022-03-24',
    vote_average: 7.8,
    vote_count: 6200,
    popularity: 88.3,
    genre_ids: [28, 12, 878],
    runtime: 139,
    tagline: 'The universe is so much bigger than you realize.',
    credits: {
      cast: [
        { id: 1620, name: 'Michelle Yeoh', character: 'Evelyn Wang' },
        { id: 24045, name: 'Ke Huy Quan', character: 'Waymond Wang' },
        { id: 3224, name: 'Jamie Lee Curtis', character: 'Deirdre Beaubeirdre' },
      ],
      crew: [{ id: 114400, name: 'Daniel Kwan', job: 'Director' }],
    },
    videos: {
      results: [{ key: 'wxN1T1uxQ2g', name: 'Trailer', site: 'YouTube', type: 'Trailer', official: true }],
    },
  },
  {
    id: 680,
    title: 'Pulp Fiction',
    overview: 'A burger-loving hit man, his philosophical partner, a drug-addled gangster\'s moll and a washed-up boxer converge in this sprawling, comedic crime caper.',
    poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdrop_path: '/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    release_date: '1994-09-10',
    vote_average: 8.5,
    vote_count: 27100,
    popularity: 110.1,
    genre_ids: [53, 80],
    runtime: 154,
    tagline: 'Just because you are a character doesn\'t mean you have character.',
    credits: {
      cast: [
        { id: 8891, name: 'John Travolta', character: 'Vincent Vega' },
        { id: 2231, name: 'Samuel L. Jackson', character: 'Jules Winnfield' },
        { id: 139, name: 'Uma Thurman', character: 'Mia Wallace' },
      ],
      crew: [{ id: 138, name: 'Quentin Tarantino', job: 'Director' }],
    },
    videos: {
      results: [{ key: 's7EdQ4FqbhY', name: 'Trailer', site: 'YouTube', type: 'Trailer', official: true }],
    },
  },
  {
    id: 238,
    title: 'The Godfather',
    overview: 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers.',
    poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    backdrop_path: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    release_date: '1972-03-14',
    vote_average: 8.7,
    vote_count: 19800,
    popularity: 135.0,
    genre_ids: [18, 80],
    runtime: 175,
    tagline: 'An offer you can\'t refuse.',
    credits: {
      cast: [
        { id: 3084, name: 'Marlon Brando', character: 'Don Vito Corleone' },
        { id: 1158, name: 'Al Pacino', character: 'Michael Corleone' },
      ],
      crew: [{ id: 1776, name: 'Francis Ford Coppola', job: 'Director' }],
    },
    videos: {
      results: [{ key: 'sY1S34973zA', name: 'Trailer', site: 'YouTube', type: 'Trailer', official: true }],
    },
  },
  {
    id: 244786,
    title: 'Whiplash',
    overview: 'Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, even his humanity.',
    poster_path: '/7fn624j5lj3xTme2SgiLCeuedmO.jpg',
    backdrop_path: '/6bbZ6XyvgfjhQwfplVUhBu25Hq4.jpg',
    release_date: '2014-10-10',
    vote_average: 8.4,
    vote_count: 14700,
    popularity: 92.5,
    genre_ids: [18, 10402],
    runtime: 107,
    tagline: 'The road to greatness can take you to the edge.',
    credits: {
      cast: [
        { id: 76092, name: 'Miles Teller', character: 'Andrew Neiman' },
        { id: 18973, name: 'J.K. Simmons', character: 'Terence Fletcher' },
      ],
      crew: [{ id: 133481, name: 'Damien Chazelle', job: 'Director' }],
    },
    videos: {
      results: [{ key: '7d_jQycdQGo', name: 'Trailer', site: 'YouTube', type: 'Trailer', official: true }],
    },
  },
  {
    id: 129,
    title: 'Spirited Away',
    overview: 'A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.',
    poster_path: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    backdrop_path: '/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg',
    release_date: '2001-07-20',
    vote_average: 8.5,
    vote_count: 16100,
    popularity: 96.0,
    genre_ids: [16, 14, 10751],
    runtime: 125,
    tagline: 'The tunnel led Chihiro to a mysterious town...',
    credits: {
      cast: [
        { id: 19588, name: 'Rumi Hiiragi', character: 'Chihiro Ogino (voice)' },
        { id: 19589, name: 'Miyu Irino', character: 'Haku (voice)' },
      ],
      crew: [{ id: 608, name: 'Hayao Miyazaki', job: 'Director' }],
    },
    videos: {
      results: [{ key: 'ByXuk9QqQkk', name: 'Trailer', site: 'YouTube', type: 'Trailer', official: true }],
    },
  },
  {
    id: 603,
    title: 'The Matrix',
    overview: 'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.',
    poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdrop_path: '/l4QHerTSbflrqeuMu43kcl2zGTz.jpg',
    release_date: '1999-03-30',
    vote_average: 8.2,
    vote_count: 24900,
    popularity: 99.4,
    genre_ids: [28, 878],
    runtime: 136,
    tagline: 'Welcome to the Real World.',
    credits: {
      cast: [
        { id: 6384, name: 'Keanu Reeves', character: 'Neo / Thomas Anderson' },
        { id: 2975, name: 'Laurence Fishburne', character: 'Morpheus' },
        { id: 530, name: 'Carrie-Anne Moss', character: 'Trinity' },
      ],
      crew: [{ id: 9339, name: 'Lana Wachowski', job: 'Director' }],
    },
    videos: {
      results: [{ key: 'vKQi3bBA1y8', name: 'Trailer', site: 'YouTube', type: 'Trailer', official: true }],
    },
  },
  {
    id: 354912,
    title: 'Coco',
    overview: 'Despite his family’s baffling generations-old ban on music, Miguel dreams of becoming an accomplished musician like his idol, Ernesto de la Cruz. Desperate to prove his talent, Miguel finds himself in the stunning and colorful Land of the Dead.',
    poster_path: '/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg',
    backdrop_path: '/askg3SMvhqEl4OL52YuvdtQw40Y.jpg',
    release_date: '2017-10-27',
    vote_average: 8.2,
    vote_count: 18500,
    popularity: 91.0,
    genre_ids: [16, 10751, 14, 10402],
    runtime: 105,
    tagline: 'The celebration of a lifetime.',
    credits: {
      cast: [
        { id: 1891544, name: 'Anthony Gonzalez', character: 'Miguel (voice)' },
        { id: 31535, name: 'Gael García Bernal', character: 'Héctor (voice)' },
      ],
      crew: [{ id: 7531, name: 'Lee Unkrich', job: 'Director' }],
    },
    videos: {
      results: [{ key: 'Rvr68u6k5sI', name: 'Trailer', site: 'YouTube', type: 'Trailer', official: true }],
    },
  },
  {
    id: 98,
    title: 'Gladiator',
    overview: 'In the year 180, the death of emperor Marcus Aurelius throws the Roman Empire into turmoil. Maximus, one of the Roman army\'s most capable generals, is betrayed and his family murdered. Reduced to slavery, he rises as a gladiator to avenge their deaths.',
    poster_path: '/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
    backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    release_date: '2000-05-04',
    vote_average: 8.2,
    vote_count: 17900,
    popularity: 94.7,
    genre_ids: [28, 18, 12],
    runtime: 155,
    tagline: 'What we do in life echoes in eternity.',
    credits: {
      cast: [
        { id: 934, name: 'Russell Crowe', character: 'Maximus Decimus Meridius' },
        { id: 73421, name: 'Joaquin Phoenix', character: 'Commodus' },
      ],
      crew: [{ id: 578, name: 'Ridley Scott', job: 'Director' }],
    },
    videos: {
      results: [{ key: 'owK1qxDselE', name: 'Trailer', site: 'YouTube', type: 'Trailer', official: true }],
    },
  },
  {
    id: 76600,
    title: 'Avatar: The Way of Water',
    overview: 'Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.',
    poster_path: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    backdrop_path: '/8YFL5QQVPy3AgrEQxNYVSgiPEbe.jpg',
    release_date: '2022-12-14',
    vote_average: 7.6,
    vote_count: 11200,
    popularity: 118.0,
    genre_ids: [878, 12, 28],
    runtime: 192,
    tagline: 'Return to Pandora.',
    credits: {
      cast: [
        { id: 65731, name: 'Sam Worthington', character: 'Jake Sully' },
        { id: 8691, name: 'Zoe Saldaña', character: 'Neytiri' },
      ],
      crew: [{ id: 2710, name: 'James Cameron', job: 'Director' }],
    },
    videos: {
      results: [{ key: 'd9MyW72ELq0', name: 'Trailer', site: 'YouTube', type: 'Trailer', official: true }],
    },
  }
];

export const mockMovieService = {
  getGenres() {
    return Object.entries(GENRE_MAP).map(([id, name]) => ({
      id: parseInt(id, 10),
      name,
    }));
  },

  discover({ page = 1, sortBy = 'popularity.desc', genre = '', year = '', minRating = 0 }) {
    const limit = 8;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);

    let filtered = [...MOCK_MOVIES];

    // Filter by genre
    if (genre) {
      const genreId = parseInt(genre, 10);
      filtered = filtered.filter((m) => m.genre_ids.includes(genreId));
    }

    // Filter by year
    if (year) {
      filtered = filtered.filter((m) => m.release_date.startsWith(String(year)));
    }

    // Filter by minRating
    if (minRating > 0) {
      filtered = filtered.filter((m) => m.vote_average >= parseFloat(minRating));
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'popularity.desc') return b.popularity - a.popularity;
      if (sortBy === 'popularity.asc') return a.popularity - b.popularity;
      if (sortBy === 'vote_average.desc') return b.vote_average - a.vote_average;
      if (sortBy === 'vote_average.asc') return a.vote_average - b.vote_average;
      if (sortBy === 'primary_release_date.desc') return new Date(b.release_date) - new Date(a.release_date);
      if (sortBy === 'primary_release_date.asc') return new Date(a.release_date) - new Date(b.release_date);
      if (sortBy === 'title.asc') return a.title.localeCompare(b.title);
      return b.popularity - a.popularity;
    });

    const totalResults = filtered.length;
    const totalPages = Math.ceil(totalResults / limit) || 1;
    const offset = (pageNum - 1) * limit;
    const pagedMovies = filtered.slice(offset, offset + limit);

    return {
      page: pageNum,
      totalPages,
      totalResults,
      results: pagedMovies.map((m) => transformMovieSummary(m)),
      dataSource: 'mock-fallback',
    };
  },

  trending({ page = 1 } = {}) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limit = 8;
    const sorted = [...MOCK_MOVIES].sort((a, b) => b.popularity - a.popularity);
    const totalResults = sorted.length;
    const totalPages = Math.ceil(totalResults / limit) || 1;
    const offset = (pageNum - 1) * limit;

    return {
      page: pageNum,
      totalPages,
      totalResults,
      results: sorted.slice(offset, offset + limit).map((m) => transformMovieSummary(m)),
      dataSource: 'mock-fallback',
    };
  },

  search({ query = '', page = 1 } = {}) {
    const cleanQuery = (query || '').toLowerCase().trim();
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limit = 8;

    let matches = [];
    if (cleanQuery) {
      matches = MOCK_MOVIES.filter(
        (m) =>
          m.title.toLowerCase().includes(cleanQuery) ||
          m.overview.toLowerCase().includes(cleanQuery)
      );
    } else {
      matches = [...MOCK_MOVIES];
    }

    const totalResults = matches.length;
    const totalPages = Math.ceil(totalResults / limit) || 1;
    const offset = (pageNum - 1) * limit;

    return {
      page: pageNum,
      totalPages,
      totalResults,
      results: matches.slice(offset, offset + limit).map((m) => transformMovieSummary(m)),
      dataSource: 'mock-fallback',
    };
  },

  getById(id) {
    const numericId = parseInt(id, 10);
    const raw = MOCK_MOVIES.find((m) => m.id === numericId);
    if (!raw) return null;
    return {
      ...transformMovieDetails(raw, raw.credits, raw.videos),
      dataSource: 'mock-fallback',
    };
  },

  getRecommendations(id) {
    const numericId = parseInt(id, 10);
    const current = MOCK_MOVIES.find((m) => m.id === numericId);
    if (!current) return [];

    // Find movies that share at least one genre
    const related = MOCK_MOVIES.filter(
      (m) => m.id !== numericId && m.genre_ids.some((g) => current.genre_ids.includes(g))
    ).slice(0, 6);

    return related.map((m) => transformMovieSummary(m));
  },
};
