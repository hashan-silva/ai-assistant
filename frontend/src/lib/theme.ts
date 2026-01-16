import {createTheme} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0b3d5c',
      contrastText: '#f5fbff'
    },
    secondary: {
      main: '#2f7f8d',
      contrastText: '#f7fbfc'
    },
    background: {
      default: '#edf3f5',
      paper: '#ffffff'
    },
    text: {
      primary: '#0b2232',
      secondary: '#4c5b66'
    }
  },
  shape: {
    borderRadius: 16
  },
  typography: {
    fontFamily: 'var(--font-body)',
    h1: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: '2.8rem'
    },
    h2: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: '2.2rem'
    },
    h3: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: '1.7rem'
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.3rem'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7
    },
    body2: {
      fontSize: '0.95rem',
      lineHeight: 1.6
    }
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          lineHeight: 1.2,
          transform: 'translate(14px, 14px) scale(1)'
        },
        shrink: {
          transform: 'translate(14px, -7px) scale(0.75)'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: '14px'
        }
      }
    }
  }
});

export default theme;
