export const getMimeTypeFromUrl = (url: string): string => {
  // Strip query params (?) and fragments (#) before getting extension
  const cleanUrl = url.split(/[?#]/)[0];
  const extension = cleanUrl.split('.').pop()?.toLowerCase();
  
  const mimeTypes: Record<string, string> = {
    'png': 'image/png',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'webp': 'image/webp',
    'heic': 'image/heic',
    'heif': 'image/heif',
    'pdf': 'application/pdf',
    'txt': 'text/plain',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'ts': 'text/javascript',
    'csv': 'text/csv',
    'json': 'application/json',
    'mp3': 'audio/mp3',
    'wav': 'audio/wav',
    'mp4': 'video/mp4',
    'mov': 'video/mov',
    'mpeg': 'video/mpeg',
    'mpg': 'video/mpeg',
    'avi': 'video/avi',
    'wmv': 'video/wmv',
  };

  return mimeTypes[extension || ''] || 'application/octet-stream';
};