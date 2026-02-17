import { Compartment, type Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { coolGlow } from 'thememirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import type { Theme } from '@/types/theme.js';
import type { EditorSettings } from './CodeMirrorEditor.js';

export const darkTheme = EditorView.theme({}, { dark: true });
export const themeSelection = new Compartment();

export function getTheme(theme: Theme, settings: EditorSettings = {}): Extension {
  return [
    getEditorTheme(settings),
    theme === 'dark' ? themeSelection.of([getDarkTheme()]) : themeSelection.of([getLightTheme()]),
  ];
}

export function reconfigureTheme(theme: Theme) {
  return themeSelection.reconfigure(theme === 'dark' ? getDarkTheme() : getLightTheme());
}

function getEditorTheme(settings: EditorSettings) {
  return EditorView.theme({
    '&': {
      fontSize: settings.fontSize ?? '12px',
    },
    '&.cm-editor': {
      height: '100%',
      backgroundColor: "hsl(220 25% 8%)",
      color: "hsl(40 25% 94%)",
    },
    '.cm-cursor': {
      borderLeft: '2px solid hsl(38 70% 58%)',
    },
    '.cm-scroller': {
      lineHeight: '1.5',
      '&:focus-visible': {
        outline: 'none',
      },
    },
    '.cm-line': {
      padding: '0 0 0 4px',
    },
    '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground': {
      backgroundColor: "hsl(38 70% 58% / 0.2) !important",
      opacity: '1',
    },
    '&:not(.cm-focused) > .cm-scroller > .cm-selectionLayer .cm-selectionBackground': {
      backgroundColor: "hsl(38 70% 58% / 0.2)",
      opacity: '0.7',
    },
    '&.cm-focused > .cm-scroller .cm-matchingBracket': {
      backgroundColor: "hsl(38 70% 58% / 0.2)",
    },
    '.cm-activeLine': {
      background: "hsl(38 70% 58% / 0.08)",
    },
    '.cm-gutters': {
      background: "hsl(220 25% 6%)",
      borderRight: 0,
      color: "hsl(220 10% 55%)",
    },
    '.cm-gutter': {
      '&.cm-lineNumbers': {
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: settings.gutterFontSize ?? settings.fontSize ?? '12px',
        minWidth: '40px',
      },
      '& .cm-activeLineGutter': {
        background: 'transparent',
        color: "hsl(38 70% 58%)",
      },
      '&.cm-foldGutter .cm-gutterElement > .fold-icon': {
        cursor: 'pointer',
        color: "hsl(220 10% 55%)",
        transform: 'translateY(2px)',
        '&:hover': {
          color: "hsl(38 70% 58%)",
        },
      },
    },
    '.cm-foldGutter .cm-gutterElement': {
      padding: '0 4px',
    },
    '.cm-tooltip-autocomplete > ul > li': {
      minHeight: '18px',
    },
    '.cm-panel.cm-search label': {
      marginLeft: '2px',
      fontSize: '12px',
    },
    '.cm-panel.cm-search .cm-button': {
      fontSize: '12px',
    },
    '.cm-panel.cm-search .cm-textfield': {
      fontSize: '12px',
    },
    '.cm-panel.cm-search input[type=checkbox]': {
      position: 'relative',
      transform: 'translateY(2px)',
      marginRight: '4px',
    },
    '.cm-panels': {
      borderColor: "hsl(38 70% 58% / 0.3)",
    },
    '.cm-panels-bottom': {
      borderTop: `1px solid hsl(38 70% 58% / 0.3)`,
      backgroundColor: 'transparent',
    },
    '.cm-panel.cm-search': {
      background: "hsl(220 25% 10%)",
      color: "hsl(40 25% 94%)",
      padding: '8px',
    },
    '.cm-search .cm-button': {
        background: "hsl(38 70% 58%)",
        borderColor: "hsl(38 70% 58% / 0.3)",
        color: "hsl(222 30% 6%)",
        borderRadius: '4px',
        '&:hover': {
          color: "hsl(222 30% 6%)",
        },
        '&:focus-visible': {
          outline: 'none',
          borderColor: "hsl(38 70% 58%)",
        },
        '&:hover:not(:focus-visible)': {
          background: "hsl(38 70% 65%)",
          borderColor: "hsl(38 70% 58%)",
        },
        '&:hover:focus-visible': {
            background: "hsl(38 70% 58%)",
            borderColor: "hsl(38 70% 58%)",
        },
    },
    '.cm-panel.cm-search [name=close]': {
      top: '6px',
      right: '6px',
      padding: '0 6px',
      fontSize: '1rem',
      backgroundColor: 'transparent',
      color: "hsl(220 10% 55%)",
      '&:hover': {
        'border-radius': '6px',
        color: "hsl(38 70% 58%)",
        backgroundColor: "hsl(220 25% 10%)",
      },
    },
    '.cm-search input': {
      background: "hsl(220 25% 12%)",
      borderColor: "hsl(38 70% 58% / 0.3)",
      color: "hsl(40 25% 94%)",
      outline: 'none',
      borderRadius: '4px',
      '&:focus-visible': {
        borderColor: "hsl(38 70% 58%)",
      },
    },
    '.cm-tooltip': {
      background: "hsl(220 25% 10%)",
      border: '1px solid transparent',
      borderColor: "hsl(38 70% 58% / 0.3)",
      color: "hsl(40 25% 94%)",
    },
    '.cm-tooltip.cm-tooltip-autocomplete ul li[aria-selected]': {
      background: "hsl(38 70% 58% / 0.2)",
      color: "hsl(40 25% 94%)",
    },
    '.cm-searchMatch': {
      backgroundColor: "hsl(155 45% 42% / 0.3)",
    },
    '.cm-tooltip.cm-readonly-tooltip': {
      padding: '4px',
      whiteSpace: 'nowrap',
      backgroundColor: "hsl(220 25% 10%)",
      borderColor: "hsl(38 70% 58%)",
      '& .cm-tooltip-arrow:before': {
        borderTopColor: "hsl(38 70% 58%)",
      },
      '& .cm-tooltip-arrow:after': {
        borderTopColor: 'transparent',
      },
    },
  });
}

function getLightTheme() {
  return coolGlow;
}

function getDarkTheme() {
  return vscodeDark;
}