import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d5bdaf',
      light: '#e3d5ca',
      dark: '#d6ccc2',
    },
    secondary: {
      main: '#edede9',
      light: '#f5ebe0',
      dark: '#d6ccc2',
    },
    background: {
      default: '#f5ebe0',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#333333',
    },
    custom: {
      lightGray: '#edede9',
      lightTaupe: '#d6ccc2',
      offWhite: '#f5ebe0',
      beige: '#e3d5ca',
      warmTaupe: '#d5bdaf',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      color: '#000000',
      fontWeight: 600,
    },
    h2: {
      color: '#000000',
      fontWeight: 600,
    },
    h3: {
      color: '#000000',
      fontWeight: 600,
    },
    body1: {
      color: '#000000',
    },
    body2: {
      color: '#333333',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        contained: {
          backgroundColor: '#d5bdaf',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#d6ccc2',
          },
        },
        outlined: {
          borderColor: '#e3d5ca',
          color: '#000000',
          '&:hover': {
            borderColor: '#d6ccc2',
            color: '#000000',
            backgroundColor: '#f5ebe0',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 12,
          color: '#000000',
        },
      },
    },
  },
});

export default theme; 