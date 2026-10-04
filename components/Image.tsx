'use client'

import { useState, useEffect } from 'react'
import NextImage, { ImageProps } from 'next/image'

const basePath = process.env.BASE_PATH || ''

export default function Image({ src, alt = '', className = '', ...rest }: ImageProps) {
  const [isOpen, setIsOpen] = useState(false)
  const fullSrc = typeof src === 'string' && src.startsWith('http') ? src : `${basePath}${src}`

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        aria-label={`View full size image${alt ? `: ${alt}` : ''}`}
        className="group relative inline-block cursor-zoom-in overflow-hidden rounded-lg text-left"
        onClick={() => setIsOpen(true)}
      >
        <NextImage
          src={fullSrc}
          alt={alt}
          className={`transition-transform duration-200 group-hover:scale-[1.01] ${className}`}
          {...rest}
        />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="Close image lightbox backdrop"
            className="fixed inset-0 cursor-zoom-out border-0 bg-black/85 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="pointer-events-auto relative z-10 max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fullSrc}
              alt={alt}
              className="mx-auto max-h-[85vh] max-w-full object-contain"
            />
            {alt && <p className="mt-2 text-center text-sm text-gray-300">{alt}</p>}
          </div>
          <button
            type="button"
            className="absolute top-4 right-4 z-20 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 focus:outline-none"
            onClick={() => setIsOpen(false)}
            aria-label="Close image lightbox"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
