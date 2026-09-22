import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import app from '../src/app.js';
import { wishlistService } from '../src/services/wishlistService.js';

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

after(async () => {
  wishlistService.clear();
  await new Promise((resolve) => server.close(resolve));
});

async function apiRequest(path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  return { status: res.status, data };
}

describe('Movie Discovery Backend API Tests', () => {
  test('GET /api/health should report server and db status', async () => {
    const { status, data } = await apiRequest('/api/health');
    assert.strictEqual(status, 200);
    assert.strictEqual(data.status, 'ok');
    assert.ok(data.database);
    assert.ok(data.cache);
  });

  test('GET /api/movies/genres should return list of genres', async () => {
    const { status, data } = await apiRequest('/api/movies/genres');
    assert.strictEqual(status, 200);
    assert.ok(Array.isArray(data.genres));
    assert.ok(data.genres.length > 0);
    assert.ok(data.genres.some((g) => g.name === 'Action' || g.name === 'Sci-Fi'));
  });

  test('GET /api/movies/discover should return paginated movies', async () => {
    const { status, data } = await apiRequest('/api/movies/discover?page=1');
    assert.strictEqual(status, 200);
    assert.strictEqual(data.page, 1);
    assert.ok(Array.isArray(data.results));
    assert.ok(data.results.length > 0);

    const first = data.results[0];
    assert.ok(first.id);
    assert.ok(first.title);
    assert.ok(typeof first.rating === 'number');
    assert.ok(Array.isArray(first.genres));
  });

  test('GET /api/movies/discover with genre & rating filters', async () => {
    const { status, data } = await apiRequest('/api/movies/discover?genre=878&minRating=8');
    assert.strictEqual(status, 200);
    assert.ok(Array.isArray(data.results));
    for (const movie of data.results) {
      assert.ok(movie.rating >= 8, `Movie ${movie.title} rating ${movie.rating} should be >= 8`);
      assert.ok(movie.genres.includes('Sci-Fi') || movie.genres.includes('Action'));
    }
  });

  test('GET /api/movies/trending should return trending movies', async () => {
    const { status, data } = await apiRequest('/api/movies/trending');
    assert.strictEqual(status, 200);
    assert.ok(Array.isArray(data.results));
    assert.ok(data.results.length > 0);
  });

  test('GET /api/movies/search should filter by title', async () => {
    const { status, data } = await apiRequest('/api/movies/search?query=Inception');
    assert.strictEqual(status, 200);
    assert.ok(Array.isArray(data.results));
    assert.ok(data.results.some((m) => m.title.toLowerCase().includes('inception')));
  });

  test('GET /api/movies/:id should return complete details with cast & trailer', async () => {
    const { status, data } = await apiRequest('/api/movies/157336'); // Interstellar
    assert.strictEqual(status, 200);
    assert.strictEqual(data.id, 157336);
    assert.strictEqual(data.title, 'Interstellar');
    assert.ok(data.runtime > 0);
    assert.ok(Array.isArray(data.cast));
    assert.ok(data.cast.length > 0);
    assert.ok(data.trailer);
    assert.ok(data.trailer.key);
  });

  test('Wishlist CRUD flow with SQLite persistence', async () => {
    const sampleMovie = {
      id: 27205,
      title: 'Inception',
      posterUrl: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
      releaseDate: '2010-07-15',
      rating: 8.4,
      genres: ['Action', 'Sci-Fi'],
      overview: 'Dream within a dream heist.',
    };

    // 1. Initially not in wishlist
    const checkBefore = await apiRequest(`/api/wishlist/check/${sampleMovie.id}`);
    assert.strictEqual(checkBefore.data.inWishlist, false);

    // 2. Add to wishlist
    const addRes = await apiRequest('/api/wishlist', {
      method: 'POST',
      body: JSON.stringify(sampleMovie),
    });
    assert.strictEqual(addRes.status, 201);
    assert.strictEqual(addRes.data.success, true);

    // 3. Now in wishlist
    const checkAfter = await apiRequest(`/api/wishlist/check/${sampleMovie.id}`);
    assert.strictEqual(checkAfter.data.inWishlist, true);

    // 4. Retrieve list
    const listRes = await apiRequest('/api/wishlist');
    assert.strictEqual(listRes.status, 200);
    assert.ok(listRes.data.items.some((item) => item.movieId === sampleMovie.id));

    // 5. Delete from wishlist
    const deleteRes = await apiRequest(`/api/wishlist/${sampleMovie.id}`, {
      method: 'DELETE',
    });
    assert.strictEqual(deleteRes.status, 200);
    assert.strictEqual(deleteRes.data.success, true);

    // 6. Verify removed
    const checkFinal = await apiRequest(`/api/wishlist/check/${sampleMovie.id}`);
    assert.strictEqual(checkFinal.data.inWishlist, false);
  });
});
