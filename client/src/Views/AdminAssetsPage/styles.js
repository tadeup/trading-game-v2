export const styles = theme => ({
  main: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 4,
    [theme.breakpoints.up(1170 + theme.spacing.unit * 4 * 2)]: {
      width: 1080,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
});