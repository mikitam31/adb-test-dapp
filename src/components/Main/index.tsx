import Header from '../Header'
import ConnectModal from '../ConnectModal'
import { ConnectorType } from '../../connectors'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { connectModalOpen, toggleConnectorModal } from '../../redux/slices/appSlice'

const Main = () => {
  const dispatch = useAppDispatch()
  const modalOpen = useAppSelector(connectModalOpen)

  const handleClose = (connector: ConnectorType) => {
    dispatch(toggleConnectorModal(false))
  }

  return (
    <>
      <Header />
      <ConnectModal open={modalOpen} onClose={handleClose} />
    </>
  )
}

export default Main
