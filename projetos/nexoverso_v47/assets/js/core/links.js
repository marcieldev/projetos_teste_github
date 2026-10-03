/* LINKS — interpreta destinos externos; não renderiza interface. */
export const mediaLink = media => media?.link || media?.url || '';

export function externalHref(link){
  if(!link) return '';
  try{
    const u = new URL(link, location.href);
    if(!['http:','https:'].includes(u.protocol)) throw new Error();
    return u.href;
  }catch{
    throw new Error('O link externo cadastrado é inválido.');
  }
}

export function youtubeInfo(link){
  const href = externalHref(link);
  if(!href) return null;
  const u = new URL(href);
  const host = u.hostname.toLowerCase().replace(/^www\./,'');
  const youtube = ['youtube.com','m.youtube.com','music.youtube.com'].includes(host);
  const short = host === 'youtu.be';
  if(!youtube && !short) return null;

  let videoId = '';
  if(short) videoId = u.pathname.split('/').filter(Boolean)[0] || '';
  if(!videoId && u.pathname === '/watch') videoId = u.searchParams.get('v') || '';
  const listId = u.searchParams.get('list') || '';

  // Qualquer link com ?list= é tratado como contexto de playlist.
  const tipo = listId ? 'playlist' : 'video';
  const thumbnail = videoId
    ? `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`
    : '';

  return {
    tipo,
    videoId,
    listId,
    thumbnail,
    href,
    descricao: tipo === 'playlist' ? 'Playlist do YouTube' : 'Vídeo do YouTube',
    rotulo: 'Abrir'
  };
}

export function externalInfo(link, declaredType=''){
  const href = externalHref(link);
  if(!href) return {tipo:'indisponivel',rotulo:'Link não cadastrado',descricao:'Nenhum link externo foi cadastrado.',href:''};
  const yt = youtubeInfo(href);
  if(yt){
    if(declaredType === 'video') return {...yt,tipo:'video',descricao:'Vídeo do YouTube'};
    if(declaredType === 'playlist') return {...yt,tipo:'playlist',descricao:'Playlist do YouTube'};
    return yt;
  }
  return {tipo:'externo',rotulo:'Abrir',descricao:'Conteúdo externo',href};
}

export const hasMedia = item => Boolean(mediaLink(item?.midia));
