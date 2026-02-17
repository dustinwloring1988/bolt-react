import type { ITheme } from '@xterm/xterm';

export function getTerminalTheme(overrides?: ITheme): ITheme {
  return {
    cursor: '#c9a55c', // Gold accent
    cursorAccent: '#0a0e14',
    foreground: '#f0ebe6', // Warm off-white
    background: '#0a0e14', // Deep navy
    selectionBackground: 'rgba(201, 165, 92, 0.25)', // Gold with opacity
    selectionForeground: '#f0ebe6',
    selectionInactiveBackground: 'rgba(201, 165, 92, 0.1)',

    // ansi escape code colors - refined for gold theme
    black: '#0a0e14',
    red: '#e57373', // Muted red
    green: '#81c784', // Soft green
    yellow: '#c9a55c', // Gold
    blue: '#64b5f6', // Soft blue
    magenta: '#ba68c8', // Soft purple
    cyan: '#4dd0e1', // Soft cyan
    white: '#f0ebe6',
    brightBlack: '#546e7a',
    brightRed: '#ef5350',
    brightGreen: '#66bb6a',
    brightYellow: '#ffd54f',
    brightBlue: '#42a5f5',
    brightMagenta: '#ab47bc',
    brightCyan: '#26c6da',
    brightWhite: '#ffffff',

    ...overrides,
  };
}