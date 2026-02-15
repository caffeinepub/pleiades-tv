export function getVideoShareUrl(videoId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/#/video/${videoId}`;
}

export async function shareVideo(videoId: string, title: string): Promise<boolean> {
  const url = getVideoShareUrl(videoId);

  // Try Web Share API first
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${title} - Pleiades TV`,
        url,
      });
      return true;
    } catch (error) {
      // User cancelled or error occurred
      if ((error as Error).name === 'AbortError') {
        return false;
      }
      // Fall through to clipboard
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
