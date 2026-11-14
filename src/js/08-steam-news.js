// Official Steam posts. The feed contains BBCode, rendered with ordinary DOM nodes.
let steamNews = { posts: [], patches: [] };
let newsCount = 4;

async function loadSteamNews() {
  try {
    const response = await fetch('data/steam-news.json', { cache: 'no-cache' });
    if (response.ok) steamNews = await response.json();
  } catch {
    // The curated patch history remains available if the feed cannot be loaded.
  }
}

function mergeSteamPatches() {
  const parts = (version) => version.split('.').map(Number);
  const compare = (a, b) => {
    const [major, minor, patch] = parts(a);
    const [otherMajor, otherMinor, otherPatch] = parts(b);
    return major - otherMajor || minor - otherMinor || patch - otherPatch;
  };
  const curated = PATCH_NOTES.patches || [];
  const imported = steamNews.patches
    .filter((post) => !curated.some((patch) => patch.version === post.version))
    .map((post) => ({ ...post, source: post.url }));
  PATCH_NOTES.patches = [...curated, ...imported].sort((a, b) => compare(b.version, a.version));
  DATA_META.patch = PATCH_NOTES.patches[0]?.version || DATA_META.patch;
  PATCH_NOTES.latestBalance = PATCH_NOTES.patches.find((patch) => patch.balance)?.version || PATCH_NOTES.latestBalance;
  DATA_META.balancePatch = PATCH_NOTES.latestBalance;
}

function steamLink(value) {
  try {
    const url = new URL(value.replaceAll('{STEAM_CLAN_IMAGE}', 'https://clan.fastly.steamstatic.com/images'));
    return url.protocol === 'https:' && !url.username && !url.password ? url : null;
  } catch {
    return null;
  }
}

function youtubeId(url) {
  if (url.hostname === 'youtu.be') return url.pathname.slice(1);
  if (!['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) return '';
  return url.pathname === '/watch'
    ? url.searchParams.get('v') || ''
    : url.pathname.match(/^\/(?:live|shorts|embed)\/([^/]+)\/?$/)?.[1] || '';
}

function steamVideo(id) {
  const box = document.createElement('div');
  box.className = 'steam-video';
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Play video';
  const link = document.createElement('a');
  link.href = 'https://www.youtube.com/watch?v=' + id;
  link.textContent = 'Watch on YouTube';
  link.rel = 'noopener noreferrer';
  link.target = '_blank';
  button.onclick = () => {
    const player = document.createElement('iframe');
    player.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1';
    player.title = 'Announcement video';
    player.allow = 'autoplay; encrypted-media; picture-in-picture';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    button.replaceWith(player);
    player.focus();
  };
  box.append(button, link);
  return box;
}

const STEAM_TAGS = {
  b: 'strong',
  i: 'em',
  u: 'u',
  strike: 's',
  p: 'div',
  h1: 'h3',
  h2: 'h3',
  h3: 'h4',
  h4: 'h5',
  h5: 'h5',
  h6: 'h6',
  list: 'ul',
  olist: 'ol',
  '*': 'li',
  quote: 'blockquote',
  code: 'pre',
  spoiler: 'span',
};

function steamBody(body, container) {
  const stack = [{ tag: '', element: container }];
  const videos = new Set();
  const addVideo = (id) => {
    if (!/^[\w-]{11}$/.test(id) || videos.has(id)) return;
    videos.add(id);
    stack.at(-1).element.append(steamVideo(id));
  };
  const addLink = (href, label) => {
    if (!href) {
      stack.at(-1).element.append(label);
      return;
    }
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.textContent = label;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    stack.at(-1).element.append(anchor);
    addVideo(youtubeId(href));
  };
  const appendText = (value) => {
    let position = 0;
    for (const match of value.matchAll(/https:\/\/(?:www\.|m\.)?(?:youtube\.com\/|youtu\.be\/)[^\s<>\[\]]+/gi)) {
      stack.at(-1).element.append(value.slice(position, match.index));
      const url = match[0].replace(/[.,)]+$/, '');
      addLink(steamLink(url), url);
      stack.at(-1).element.append(match[0].slice(url.length));
      position = match.index + match[0].length;
    }
    stack.at(-1).element.append(value.slice(position));
  };
  const tokens = /\[(url|img|previewyoutube)(?:[ =]([^\]]*))?\]([\s\S]*?)\[\/\1\]|\[(\/?)([\w*]+)(?:=[^\]]*)?\]/gi;
  let cursor = 0;
  for (const match of body.matchAll(tokens)) {
    appendText(body.slice(cursor, match.index));
    cursor = match.index + match[0].length;
    const [, media, param, content, closing, name] = match;
    if (media) {
      const attribute = (param || '')
        .replace(/^src\s*=\s*/i, '')
        .trim()
        .replace(/^["']|["']$/g, '');
      if (media.toLowerCase() === 'previewyoutube') {
        addVideo(attribute.split(';')[0]);
      } else {
        const href = steamLink(attribute || content.trim());
        if (media.toLowerCase() === 'url') {
          addLink(href, content.replace(/\[\/?(?:b|i|u)\]/gi, '') || attribute);
        } else if (href) {
          const image = document.createElement('img');
          image.src = href;
          image.alt = 'Image from the Steam announcement';
          image.loading = 'lazy';
          stack.at(-1).element.append(image);
        }
      }
      continue;
    }
    const tag = name.toLowerCase();
    if (tag === 'hr') {
      if (!closing) stack.at(-1).element.append(document.createElement('hr'));
    } else if (!Object.hasOwn(STEAM_TAGS, tag)) {
      appendText(match[0]);
    } else if (closing) {
      const index = stack.findLastIndex((entry) => entry.tag === tag);
      if (index > 0) stack.length = index;
    } else {
      if (tag === '*') {
        const list = stack.findLastIndex((entry) => ['list', 'olist'].includes(entry.tag));
        if (list > 0) stack.length = list + 1;
      }
      const element = document.createElement(STEAM_TAGS[tag]);
      stack.at(-1).element.append(element);
      stack.push({ tag, element });
    }
  }
  appendText(body.slice(cursor));
}

function renderNews() {
  const root = $('newsBody');
  if (root.children.length) return;
  const more = $('newsMore');
  if (!steamNews.posts.length) {
    $('newsEmpty').hidden = false;
    return;
  }
  function appendPosts() {
    for (const post of steamNews.posts.slice(root.children.length, newsCount)) {
      const article = document.createElement('article');
      article.className = 'patch-card steam-post';
      article.innerHTML =
        '<h3></h3><p class="steam-post-meta"><time></time> · <a target="_blank" rel="noopener noreferrer">View on Steam</a></p><div class="steam-body"></div>';
      article.querySelector('h3').textContent = post.title;
      article.querySelector('time').dateTime = post.date;
      article.querySelector('time').textContent = patchDate(post.date);
      article.querySelector('a').href = steamLink(post.url);
      steamBody(post.body, article.querySelector('.steam-body'));
      root.append(article);
    }
    more.hidden = root.children.length >= steamNews.posts.length;
  }
  more.onclick = () => {
    newsCount += 4;
    appendPosts();
  };
  appendPosts();
}

function renderSteamPatchBodies(root) {
  for (const details of root.querySelectorAll('[data-steam-patch]')) {
    const version = details.dataset.steamPatch;
    const post = steamNews.patches.find((entry) => entry.version === version);
    details.addEventListener('toggle', async () => {
      if (!details.open || details.querySelector('.steam-body')) return;
      const body = document.createElement('div');
      body.className = 'steam-body';
      details.append(body);
      if (post) {
        steamBody(post.body, body);
        return;
      }
      try {
        const response = await fetch('assets/patch_notes/' + version + '.txt');
        if (!response.ok) throw new Error();
        body.textContent = await response.text();
      } catch {
        body.textContent = 'The full notes are currently unavailable.';
      }
    });
  }
}
