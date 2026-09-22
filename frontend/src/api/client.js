// Lightweight native fetch client with AbortController support

export const apiClient = {
  async get(url, params = {}, signal = null) {
    const urlObj = new URL(url, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        urlObj.searchParams.append(key, String(value));
      }
    });

    const res = await fetch(urlObj.toString(), {
      signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      let errorMessage = `HTTP error ${res.status}`;
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // ignore json parse error
      }
      throw new Error(errorMessage);
    }

    return res.json();
  },

  async post(url, body = {}) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      let errorMessage = `HTTP error ${res.status}`;
      try {
        const err = await res.json();
        errorMessage = err.message || errorMessage;
      } catch (e) {}
      throw new Error(errorMessage);
    }

    return res.json();
  },

  async delete(url) {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      let errorMessage = `HTTP error ${res.status}`;
      try {
        const err = await res.json();
        errorMessage = err.message || errorMessage;
      } catch (e) {}
      throw new Error(errorMessage);
    }

    return res.json();
  },

  // Movie endpoints
  getGenres(signal) {
    return this.get('/api/movies/genres', {}, signal);
  },

  getDiscover(params, signal) {
    return this.get('/api/movies/discover', params, signal);
  },

  getTrending(params, signal) {
    return this.get('/api/movies/trending', params, signal);
  },

  search(params, signal) {
    return this.get('/api/movies/search', params, signal);
  },

  getMovieDetails(id, signal) {
    return this.get(`/api/movies/${id}`, {}, signal);
  },

  getRecommendations(id, signal) {
    return this.get(`/api/movies/${id}/recommendations`, {}, signal);
  },

  // Wishlist endpoints
  getWishlist() {
    return this.get('/api/wishlist');
  },

  checkWishlist(movieId) {
    return this.get(`/api/wishlist/check/${movieId}`);
  },

  addToWishlist(movie) {
    return this.post('/api/wishlist', movie);
  },

  removeFromWishlist(movieId) {
    return this.delete(`/api/wishlist/${movieId}`);
  },
};
