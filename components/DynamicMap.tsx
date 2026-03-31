"use client";
// components/DynamicMap.tsx
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(
  () => import('./Map'), // Your actual Leaflet map component
  {
    ssr: false,
    loading: () => <p>Loading Map...</p>
  }
);

export default DynamicMap;
