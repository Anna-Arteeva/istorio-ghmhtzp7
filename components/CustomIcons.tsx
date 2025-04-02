import React from 'react';
import { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

// Common interface for all icons
interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

// Base SVG component to be reused for all icons
const IconBase = ({ 
  children, 
  size = 24,
  color = 'currentColor',
  ...props
}: IconProps) => {
  return (
    <Svg 
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill={color}
      {...props}
    >
      {children}
    </Svg>
  );
};

export const FaceThinkingIcon = (props: IconProps) => (
  <IconBase {...props}>
    <Path d="M256 464c114.9 0 208-93.1 208-208s-93.1-208-208-208S48 141.1 48 256c0 17.7 2.2 34.8 6.4 51.2C40.8 317.4 32 333.7 32 352l0 28C11.6 343.3 0 301 0 256C0 114.6 114.6 0 256 0S512 114.6 512 256s-114.6 256-256 256c-10.6 0-21.1-.6-31.4-1.9c4-5.7 7.3-12 9.8-18.8l10.1-27.7c3.8 .2 7.7 .3 11.6 .3zm43-158.9c-9.9-2-20.5-1.3-30.7 2.5L237.9 319l-65.5-15.4c-8.6-2-13.9-10.6-11.9-19.2s10.6-13.9 19.2-11.9l97.1 22.8c8.2 1.9 15.7 5.3 22.3 9.8zM144.4 192a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-16a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-120-31.2c-20.5-17.6-49.9-20.4-73.4-7l-7.1 4c-7.7 4.4-17.4 1.7-21.8-6s-1.7-17.4 6-21.8l7.1-4c35.2-20.1 79.3-15.9 110.1 10.5l13.2 11.3c6.7 5.8 7.5 15.9 1.7 22.6s-15.9 7.5-22.6 1.7l-13.2-11.3zM112 352l0 48.4 167.6-62.8c12.4-4.7 26.2 1.6 30.9 14s-1.6 26.2-14 30.9L230.9 407c-.1 .4-.3 .8-.4 1.2l-26.3 72.2c-6.9 19-24.9 31.6-45.1 31.6L112 512c-26.5 0-48-21.5-48-48l0-112c0-13.3 10.7-24 24-24s24 10.7 24 24z" />
  </IconBase>
);

export const LanguageIcon = (props: IconProps) => (
  <IconBase {...props}>
    <Path d="M352 256c0 22.2-1.2 43.6-3.3 64l-185.3 0c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64l185.3 0c2.2 20.4 3.3 41.8 3.3 64zm28.8-64l123.1 0c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64l-123.1 0c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32l-116.7 0c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0l-176.6 0c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0L18.6 160C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192l123.1 0c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64L8.1 320C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64z" />
  </IconBase>
);

export const ArrowUpFromBracketIcon = (props: IconProps) => (
  <IconBase {...props} viewBox="0 0 448 512">
    <Path d="M241 7c-9.4-9.4-24.6-9.4-33.9 0L79 135c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l87-87L200 328c0 13.3 10.7 24 24 24s24-10.7 24-24l0-246.1 87 87c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L241 7zM48 344c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 80c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-80c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 80c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-80z"/>
  </IconBase>
);

export const De = (props: IconProps) => (
  <IconBase {...props}>
    <Path d="M267.7 133.3C253 149.7 231.7 160 208 160s-45-10.3-59.7-26.7c-6.9-7.7-21.4-8.6-29.6-2.3C108 139.1 94.6 144 80 144c-35.3 0-64-28.7-64-64s28.7-64 64-64c14.6 0 28 4.9 38.7 13c8.2 6.3 22.7 5.4 29.6-2.3C163 10.3 184.3 0 208 0s45 10.3 59.7 26.7c6.9 7.7 21.4 8.6 29.6 2.3C308 20.9 321.4 16 336 16c35.3 0 64 28.7 64 64s-28.7 64-64 64c-14.6 0-28-4.9-38.7-13c-8.2-6.3-22.7-5.4-29.6 2.3zM32 448l0-284.8C46.1 171.3 62.5 176 80 176c18.7 0 36.2-5.4 51-14.7c20 19 47.2 30.7 77 30.7s57-11.7 77-30.7c14.8 9.3 32.3 14.7 51 14.7c19.6 0 37.9-5.9 53.1-16l46.1 0c42.4 0 76.8 34.4 76.8 76.8l0 102.1c0 30.3-17.9 57.9-45.6 70.2L384 445.7l0 2.3c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64zm352-72.4l56.4-25.1c4.6-2.1 7.6-6.6 7.6-11.7l0-102.1c0-7.1-5.7-12.8-12.8-12.8L384 224l0 151.6zM160 240c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 160c0 8.8 7.2 16 16 16s16-7.2 16-16l0-160zm64 0c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 160c0 8.8 7.2 16 16 16s16-7.2 16-16l0-160zm64 0c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 160c0 8.8 7.2 16 16 16s16-7.2 16-16l0-160z"/>
  </IconBase>
);

export const Fr = (props: IconProps) => (
  <IconBase {...props}>
    <Path d="M259.4 1.4c3.9 5.9 7 12.5 9.1 19.5l59.9 199.7c1.2 4.1 2 8.2 2.4 12.4L440.3 92.2c13.6-17.4 10.5-42.8-8.6-53.9C389.4 14 340.3 0 288 0c-9.7 0-19.2 .5-28.6 1.4zM233 330.8c-4.1-.4-8.3-1.2-12.4-2.4L20.9 268.5c-7-2.1-13.6-5.2-19.5-9.1C.5 268.8 0 278.3 0 288c0 52.3 14 101.4 38.4 143.7c11 19.1 36.4 22.2 53.9 8.6L233 330.8zM232.7 19s0 0 0 0c2 3 3.6 6.4 4.8 10c-1.2-3.6-2.8-6.9-4.8-10c0 0 0 0 0 0zm232.9 92.8L390 209l87.6 14.6c1.6 .3 3.2 .4 4.9 .4c16.3 0 29.6-13.2 29.6-29.6l0-5.4c0-4.2-.7-8.3-2.3-12.2c-10.1-25.2-24.1-48.5-41.3-69c-.9 1.4-1.9 2.7-2.9 4zM209 390l-97.1 75.6c-1.3 1-2.6 2-4 2.9c20.5 17.2 43.8 31.2 69 41.3c3.9 1.5 8 2.3 12.2 2.3l5.4 0c16.3 0 29.6-13.2 29.6-29.6c0-1.6-.1-3.3-.4-4.9L209 390zM19 232.7s0 0 0 0c2.3 1.5 4.7 2.8 7.3 3.8c1.2 .5 2.5 1 3.8 1.3l199.7 59.9c11.3 3.4 23.5 .3 31.8-8l28.1-28.1c8.3-8.3 11.4-20.5 8-31.8L237.8 30.1C232.5 12.2 216 0 197.4 0c-4.6 0-9.2 .7-13.5 2.3C99.7 33 33 99.7 2.3 183.9C.7 188.2 0 192.8 0 197.4c0 14.5 7.4 27.6 19 35.3c0 0 0 0 0 0z"/>
  </IconBase>
);

export const Es = (props: IconProps) => (
  <IconBase {...props}>
    <Path d="M465 7c-9.4-9.4-24.6-9.4-33.9 0L383 55c-2.4 2.4-4.3 5.3-5.5 8.5l-15.4 41-77.5 77.6c-45.1-29.4-99.3-30.2-131 1.6c-11 11-18 24.6-21.4 39.6c-3.7 16.6-19.1 30.7-36.1 31.6c-25.6 1.3-49.3 10.7-67.3 28.6C-16 328.4-7.6 409.4 47.5 464.5s136.1 63.5 180.9 18.7c17.9-17.9 27.4-41.7 28.6-67.3c.9-17 15-32.3 31.6-36.1c15-3.4 28.6-10.5 39.6-21.4c31.8-31.8 31-85.9 1.6-131l77.6-77.6 41-15.4c3.2-1.2 6.1-3.1 8.5-5.5l48-48c9.4-9.4 9.4-24.6 0-33.9L465 7zM208 256a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
  </IconBase>
);

export const It = (props: IconProps) => (
  <IconBase {...props}>
    <Path d="M169.7 .9c-22.8-1.6-41.9 14-47.5 34.7L110.4 80c.5 0 1.1 0 1.6 0c176.7 0 320 143.3 320 320c0 .5 0 1.1 0 1.6l44.4-11.8c20.8-5.5 36.3-24.7 34.7-47.5C498.5 159.5 352.5 13.5 169.7 .9zM399.8 410.2c.1-3.4 .2-6.8 .2-10.2c0-159.1-128.9-288-288-288c-3.4 0-6.8 .1-10.2 .2L.5 491.9c-1.5 5.5 .1 11.4 4.1 15.4s9.9 5.6 15.4 4.1L399.8 410.2zM176 208a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm64 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM96 384a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
  </IconBase>
);

export const Ru = (props: IconProps) => (
  <IconBase {...props} viewBox="0 0 640 512">
    <Path d="M192 0c61.9 0 112 50.1 112 112l0 112L80 224l0-112C80 50.1 130.1 0 192 0zm-8.7 64.9c-11.7 15.1-28.7 26-48.2 29.7c-4 .8-7.2 4.2-6.8 8.2c1.5 14 7.6 27.7 18.4 38.5c25 25 65.5 25 90.5 0c10.8-10.8 16.9-24.4 18.4-38.5c.4-4.1-2.7-7.5-6.8-8.2c-19.5-3.7-36.5-14.6-48.2-29.7c-4.1-5.3-13.2-5.3-17.3 0zM635.5 474.1c5.2 7.3 5.9 16.9 1.8 24.9s-12.4 13-21.3 13l-304 0c-9 0-17.2-5-21.3-13c-4.1-8-3.4-17.6 1.8-24.9c0 0 0 0 0 0l.2-.3c.2-.3 .6-.8 1-1.5c.9-1.4 2.3-3.5 4-6.3c3.4-5.6 7.9-13.8 12.5-23.8c9.2-20.3 17.8-46.8 17.8-74.1l0-8c0-75.1 60.9-136 136-136s136 60.9 136 136l0 8c0 27.3 8.6 53.7 17.8 74.1c4.6 10 9.1 18.2 12.5 23.8c1.7 2.8 3.1 5 4 6.3c.5 .7 .8 1.2 1 1.5l.2 .3s0 0 0 0s0 0 0 0zM455.3 320.9C440.7 339.8 417.8 352 392 352c-4.3 0-8 3.3-7.6 7.6c1.7 17.9 9.4 35.3 23.1 49c31.2 31.2 81.9 31.2 113.1 0c13.7-13.7 21.4-31.1 23.1-49c.4-4.3-3.3-7.6-7.6-7.6c-25.8 0-48.7-12.2-63.3-31.1c-4.1-5.3-13.2-5.3-17.3 0zM296 360l0 8c0 21-6.8 42.7-15 60.8c-4 8.7-7.9 15.8-10.8 20.6c-1.4 2.4-2.6 4.1-3.2 5.2c-.3 .5-.6 .9-.7 1c0 0 0 0 0 0c0 0 0 0 0 .1c0 0 0 0 0 0s0 0 0 0c-11.7 16.6-13.5 38.1-4.9 56.3L74.5 512c-17 0-33.4-6.7-42.7-20.9C17.9 469.7 0 432.8 0 384c0-44.4 20.2-84.4 37.9-119.4c2.7-5.3 8.1-8.6 14-8.6l280.2 0C309.5 284.6 296 320.7 296 360z"/>
  </IconBase>
);

export const Nl = (props: IconProps) => (
  <IconBase {...props}>
    <Path d="M315.7 414.8c9.1 14.8 32 6.5 29.5-10.7L316.9 212c-.5-3.4 .1-6.9 1.8-9.9L411 31.2c8.3-15.3-10.4-31-24-20.1L234.7 131.7c-2.7 2.1-6 3.4-9.5 3.5L31.1 140.6C13.7 141 9.5 165 25.7 171.4l180.6 71.5c3.2 1.3 5.9 3.5 7.7 6.5L315.7 414.8zM224 326.8L224 464l-72 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l208 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-72 0 0-33.2-64-104zM256 168a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/>
  </IconBase>
);

export const Pt = (props: IconProps) => (
  <IconBase {...props} viewBox="0 0 640 512">
    <Path d="M33.5 1.9l112 48c12.2 5.2 17.8 19.3 12.6 31.5s-19.3 17.8-31.5 12.6l-112-48C2.4 40.8-3.3 26.7 1.9 14.6S21.3-3.3 33.5 1.9zm112 204.1l-112 48c-12.2 5.2-26.3-.4-31.5-12.6s.4-26.3 12.6-31.5l112-48c12.2-5.2 26.3 .4 31.5 12.6s-.4 26.3-12.6 31.5zM303.9 4.4c10-5.8 22.3-5.8 32.2 0l96 56c15.3 8.9 20.4 28.5 11.5 43.8C437.7 114.3 427 120 416 120l0 40c17.7 0 32 14.3 32 32c0 13.3-8.1 24.7-19.7 29.5L473.6 448l6.4 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-29.1 0L352 512l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-98.9 0L160 512c-17.7 0-32-14.3-32-32s14.3-32 32-32l6.4 0 45.3-226.5C200.1 216.7 192 205.3 192 192c0-17.7 14.3-32 32-32c0 0 0 0 0 0l0-40c-11 0-21.7-5.7-27.6-15.9c-8.9-15.3-3.7-34.9 11.5-43.8l96-56zM352 87.7L320 69.1 288 87.7l0 72.3 64 0 0-72.3zM638.1 14.6c5.2 12.2-.4 26.3-12.6 31.5l-112 48c-12.2 5.2-26.3-.4-31.5-12.6s.4-26.3 12.6-31.5l112-48c12.2-5.2 26.3 .4 31.5 12.6zm-156.1 160c5.2-12.2 19.3-17.8 31.5-12.6l112 48c12.2 5.2 17.8 19.3 12.6 31.5s-19.3 17.8-31.5 12.6l-112-48c-12.2-5.2-17.8-19.3-12.6-31.5z"/>
  </IconBase>
);

export const Ua = (props: IconProps) => (
  <IconBase {...props}>
    <Path d="M472 0c-48.6 0-88 39.4-88 88l0 24c0 8.8 7.2 16 16 16l24 0c48.6 0 88-39.4 88-88l0-24c0-8.8-7.2-16-16-16L472 0zM305.5 27.3c-6.2-6.2-16.4-6.2-22.6 0L271.5 38.6c-37.5 37.5-37.5 98.3 0 135.8l10.4 10.4-30.5 30.5c-3.4-27.3-15.5-53.8-36.5-74.8l-11.3-11.3c-6.2-6.2-16.4-6.2-22.6 0l-11.3 11.3c-37.5 37.5-37.5 98.3 0 135.8l10.4 10.4-30.5 30.5c-3.4-27.3-15.5-53.8-36.5-74.8L101.8 231c-6.2-6.2-16.4-6.2-22.6 0L67.9 242.3c-37.5 37.5-37.5 98.3 0 135.8l10.4 10.4L9.4 457.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l68.9-68.9 12.2 12.2c37.5 37.5 98.3 37.5 135.8 0l11.3-11.3c6.2-6.2 6.2-16.4 0-22.6l-11.3-11.3c-21.8-21.8-49.6-34.1-78.1-36.9l31.9-31.9 12.2 12.2c37.5 37.5 98.3 37.5 135.8 0l11.3-11.3c6.2-6.2 6.2-16.4 0-22.6l-11.3-11.3c-21.8-21.8-49.6-34.1-78.1-36.9l31.9-31.9 12.2 12.2c37.5 37.5 98.3 37.5 135.8 0L486.5 231c6.2-6.2 6.2-16.4 0-22.6L475.2 197c-34.1-34.1-82.6-44.9-125.9-32.5c12.4-43.3 1.5-91.8-32.5-125.9L305.5 27.3z"/>
  </IconBase>
);

export const En = (props: IconProps) => (
  <IconBase {...props} viewBox="0 0 640 512">
    <Path d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2s0 0 0 0s0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.2-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9c0 0 0 0 0 0s0 0 0 0l-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z"/>
  </IconBase>
);

export const Stories = (props: IconProps) => (
  <IconBase {...props} viewBox="0 0 512 512">
    <Path d="M168 80c-13.3 0-24 10.7-24 24l0 304c0 8.4-1.4 16.5-4.1 24L440 432c13.3 0 24-10.7 24-24l0-304c0-13.3-10.7-24-24-24L168 80zM72 480c-39.8 0-72-32.2-72-72L0 112C0 98.7 10.7 88 24 88s24 10.7 24 24l0 296c0 13.3 10.7 24 24 24s24-10.7 24-24l0-304c0-39.8 32.2-72 72-72l272 0c39.8 0 72 32.2 72 72l0 304c0 39.8-32.2 72-72 72L72 480zM176 136c0-13.3 10.7-24 24-24l96 0c13.3 0 24 10.7 24 24l0 80c0 13.3-10.7 24-24 24l-96 0c-13.3 0-24-10.7-24-24l0-80zm200-24l32 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-32 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm0 80l32 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-32 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zM200 272l208 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-208 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm0 80l208 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-208 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/>
  </IconBase>
);

export const Phrases = (props: IconProps) => (
  <IconBase {...props} viewBox="0 0 512 512">
    <Path d="M59.6 54.4c11.1-9.4 30.8-8.7 43.5 3.7l8 8.1 17.5 17.8 17.1-18.3L153 58c12.5-12 31.7-13.1 43.8-3.4c14.2 12.1 14.8 33.3 2 46.2c0 0 0 0 0 0l-70.7 70.8-71-70.8s0 0 0 0C44.3 87.9 44.9 66.6 59.5 54.5c0 0 0 0 0 0l.1-.1zM28.8 17.6C-7.7 47.9-9.4 102 23.1 134.6c0 0 0 0 0 0L101.7 213c14.7 15.1 38.3 14.1 52.5 .4c0 0 0 0 0 0l.3-.3 78.3-78.5s0 0 0 0C265.4 102 263.6 48 227.6 17.7c0 0 0 0 0 0l-.3-.3c-29.9-24.3-71-21.9-99.3-1C99.7-4.4 58.2-7 28.8 17.6zM512 24c0-7.2-3.2-14-8.8-18.6s-12.9-6.4-19.9-5l-160 32C312.1 34.7 304 44.6 304 56l0 105.5c-5.1-1-10.5-1.5-16-1.5c-35.3 0-64 21.5-64 48s28.7 48 64 48s64-21.5 64-48l0-132.3L464 53.3l0 76.2c-5.1-1-10.5-1.5-16-1.5c-35.3 0-64 21.5-64 48s28.7 48 64 48s64-21.5 64-48l0-152zM106.9 309.5l2.7-5.5 68.7 0 2.7 5.5c8.1 16.3 24.8 26.5 42.9 26.5c8.8 0 16 7.2 16 16l0 96c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-96c0-8.8 7.2-16 16-16c18.2 0 34.8-10.3 42.9-26.5zM224 288l-7.2-14.3c-5.4-10.8-16.5-17.7-28.6-17.7l-88.4 0c-12.1 0-23.2 6.8-28.6 17.7L64 288c-35.3 0-64 28.7-64 64l0 96c0 35.3 28.7 64 64 64l160 0c35.3 0 64-28.7 64-64l0-96c0-35.3-28.7-64-64-64zM192 392a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM473.4 259.1c-6-4.4-14.3-4-19.9 .9l-128 112c-5 4.4-6.8 11.4-4.4 17.7s8.3 10.4 15 10.4l55.7 0-38.4 89.7c-2.9 6.9-.7 14.9 5.3 19.2s14.3 4 19.9-.9l128-112c5-4.4 6.8-11.4 4.4-17.7s-8.3-10.4-15-10.4l-55.7 0 38.4-89.7c2.9-6.9 .7-14.9-5.3-19.2z"/>
  </IconBase>
);

export const Practice = (props: IconProps) => (
  <IconBase {...props} viewBox="0 0 640 512">
    <Path d="M128 88c0-30.9 25.1-56 56-56l16 0c30.9 0 56 25.1 56 56l0 144 128 0 0-144c0-30.9 25.1-56 56-56l16 0c30.9 0 56 25.1 56 56l0 16 24 0c30.9 0 56 25.1 56 56l0 72 24 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-24 0 0 72c0 30.9-25.1 56-56 56l-24 0 0 16c0 30.9-25.1 56-56 56l-16 0c-30.9 0-56-25.1-56-56l0-144-128 0 0 144c0 30.9-25.1 56-56 56l-16 0c-30.9 0-56-25.1-56-56l0-16-24 0c-30.9 0-56-25.1-56-56l0-72-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l24 0 0-72c0-30.9 25.1-56 56-56l24 0 0-16zm48 16l0 24 0 256 0 24 0 16c0 4.4 3.6 8 8 8l16 0c4.4 0 8-3.6 8-8l0-336c0-4.4-3.6-8-8-8l-16 0c-4.4 0-8 3.6-8 8l0 16zm-48 48l-24 0c-4.4 0-8 3.6-8 8l0 192c0 4.4 3.6 8 8 8l24 0 0-208zM464 384l0-256 0-24 0-16c0-4.4-3.6-8-8-8l-16 0c-4.4 0-8 3.6-8 8l0 336c0 4.4 3.6 8 8 8l16 0c4.4 0 8-3.6 8-8l0-16 0-24zm72-24c4.4 0 8-3.6 8-8l0-192c0-4.4-3.6-8-8-8l-24 0 0 208 24 0z"/>
  </IconBase>
);