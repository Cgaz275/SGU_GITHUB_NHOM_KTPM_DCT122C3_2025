import { Image } from '@components/common/Image.js';
import React from 'react';

interface BannerProps {
  bannerWidget?: {
    src?: string;
    alignment?: string;
    width?: string;
    height?: string;
    alt?: string;
  };
}

export default function Banner(props: any) {
  // Guard against null/undefined props
  if (!props) {
    return null;
  }

  // Handle both direct props and nested bannerWidget prop
  const bannerWidget = props.bannerWidget || props;

  // Guard against null/undefined bannerWidget
  if (!bannerWidget || typeof bannerWidget !== 'object' || !bannerWidget.src) {
    return null;
  }

  const { src, alignment = 'center', width = '1920', height = '600', alt = '' } = bannerWidget;

  // Parse tailwind classes for alignment
  const alignmentClass =
    alignment === 'left'
      ? 'justify-start'
      : alignment === 'center'
      ? 'justify-center'
      : 'justify-end';

  return (
    <div className={`banner-widget w-full flex ${alignmentClass}`}>
      <Image
        src={src}
        width={parseInt(width, 10)}
        height={parseInt(height, 10)}
        className={alignmentClass}
        alt={alt}
        priority={true}
      />
    </div>
  );
}

export const query = `
  query Query($src: String, $alignment: String, $width: Float, $height: Float, $alt: String) {
    bannerWidget(src: $src, alignment: $alignment, width: $width, height: $height, alt: $alt) {
      src
      alignment
      width
      height
      alt
    }
  }
`;

export const variables = `{
  src: getWidgetSetting("src"),
  alignment: getWidgetSetting("alignment"),
  width: getWidgetSetting("width"),
  height: getWidgetSetting("height"),
  alt: getWidgetSetting("alt")
}`;
