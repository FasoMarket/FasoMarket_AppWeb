import { useState } from 'react';
import { getImageUrl, getPlaceholderImage } from '../utils/imageUrl';

/**
 * Composant Image réutilisable
 * Gère les URLs d'images et les fallbacks
 */
export default function Image({ 
  src, 
  alt = 'Image', 
  className = '', 
  fallback = null,
  ...props 
}) {
  const [error, setError] = useState(false);

  const imageUrl = getImageUrl(src);
  const displayUrl = error ? (fallback || getPlaceholderImage(alt)) : imageUrl;

  return (
    <img
      src={displayUrl}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
