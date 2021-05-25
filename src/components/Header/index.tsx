import { AppBar, Button, IconButton, Toolbar, Typography } from '@material-ui/core'
import { Brightness4, Brightness7 } from '@material-ui/icons'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { selectIsDark, toggleTheme } from '../../redux/slices/themeSlice'
import { toggleConnectorModal } from '../../redux/slices/appSlice'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      flexGrow: 1
    },
    connect: {
      color: theme.palette.primary.main
    }
  })
)

const Header = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const isDarkMode = useAppSelector(selectIsDark)

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          DeFi App
        </Typography>

        <IconButton
          aria-label="Toggle light/dark mode"
          onClick={() => dispatch(toggleTheme())}
        >
          { isDarkMode ? <Brightness7 /> : <Brightness4 /> }
        </IconButton>

        <Button
          variant="contained"
          className={classes.connect}
          onClick={() => dispatch(toggleConnectorModal(true))}
        >
          CONNECT WALLET
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Header
