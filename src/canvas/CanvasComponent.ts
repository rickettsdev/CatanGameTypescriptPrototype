import { useEffect, useRef } from 'react'

let ctx: CanvasRenderingContext2D | null;
let canvas: HTMLCanvasElement | null;

export const getCanvasContext = () => {
  !canvas && (canvas = document.querySelector('#canvas'));
  !ctx && (ctx = canvas?.getContext('2d') || null);

  return { ctx, canvas };
};
