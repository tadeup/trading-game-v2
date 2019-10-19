export const styles = theme => ({
  main: {
    width: 'auto',
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    [theme.breakpoints.up(1170 + theme.spacing(8))]: {
      width: 1080,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
});