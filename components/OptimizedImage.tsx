'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  fill = false, 
  className = '', 
  sizes,
  priority = false,
  quality = 85
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Default sizes based on common breakpoints
  const defaultSizes = sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  
  // Fallback placeholder images from Unsplash (reliable, fast)
  const fallbackImages = {
    hero: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=800&fit=crop',
    event: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    tradition: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop',
  };

  if (error) {
    // Return fallback image if Google images fail
    let fallbackSrc = fallbackImages.event;
    if (className.includes('hero')) fallbackSrc = fallbackImages.hero;
    if (className.includes('tradition')) fallbackSrc = fallbackImages.tradition;
    
    return (
      <Image
        src={fallbackSrc}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  return (
    <div className={`relative ${loading ? 'bg-gray-100 animate-pulse' : ''}`}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        sizes={defaultSizes}
        priority={priority}
        quality={quality}
        onError={() => setError(true)}
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  );
}