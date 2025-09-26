// ano no footer
document.getElementById('y').textContent = new Date().getFullYear();

const img = (path, size='w300') => path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
const tmdbUrl = (item) => {
  const type = item.media_type || (item.title ? 'movie' : 'tv');
  return `https://www.themoviedb.org/${type}/${item.id}`;
};

async function fetchJson(url){
  const r = await fetch(url);
  if(!r.ok) throw new Error('Erro TMDB proxy: '+r.status);
  return r.json();
}

async function loadHero(){
  try{
    const data = await fetchJson('/api/tmdb?list=trending_day');
    const item = (data.results||[])[0];
    if(!item) return;
    const title = item.title || item.name;
    const sub = (item.media_type === 'tv' ? 'Série' : 'Filme') +
      ((item.release_date || item.first_air_date) ? ` • ${(item.release_date || item.first_air_date).slice(0,4)}` : '');
    const bg = img(item.backdrop_path, 'w1280') || img(item.poster_path, 'w780');

    document.getElementById('hero-title').textContent = title;
    document.getElementById('hero-sub').textContent = sub;
    document.getElementById('hero-btn').href = tmdbUrl(item);
    if(bg) document.getElementById('hero-bg').style.backgroundImage = `url('${bg}')`;
  }catch(e){
    document.getElementById('hero-title').textContent = 'PipocaClub';
    document.getElementById('hero-sub').textContent = 'Explore filmes e séries com a gente.';
  }
}

async function loadRow(list, targetId){
  try{
    const data = await fetchJson(`/api/tmdb?list=${list}`);
    const row = document.getElementById(targetId);
    row.innerHTML = '';
    (data.results||[]).slice(0,18).forEach(item=>{
      const poster = img(item.poster_path) || img(item.backdrop_path);
      if(!poster) return;
      const a = document.createElement('a');
      a.href = tmdbUrl(item); a.target = '_blank'; a.rel = 'noopener';
      a.className = 'poster'; a.style.backgroundImage = `url('${poster}')`; a.title = item.title || item.name || '';
      row.appendChild(a);
    });
  }catch(e){
    // fallback minimal
  }
}

loadHero();
loadRow('movie_popular','row-movies');
loadRow('tv_popular','row-series');
