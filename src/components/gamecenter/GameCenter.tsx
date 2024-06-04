import { GameCenterQueue } from './GameCenterQueue'
import { GameCenterTomb } from './GameCenterTomb'
import { GameCenterView } from './GameCenterView'

export const GameCenter = (props: DefaultWebsocketInterface) => {
  return (
    <>
        <GameCenterView sendPacket={props.sendPacket} />
        <GameCenterQueue sendPacket={props.sendPacket} />
        <GameCenterTomb />
    </>
  )
}