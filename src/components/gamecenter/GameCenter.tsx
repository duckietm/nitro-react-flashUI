import { GameCenterQueue } from './GameCenterQueue'
import { GameCenterTomb } from './GameCenterTomb'
import { GameCenterView } from './GameCenterView'

export const GameCenter = () => {
  return (
    <>
        <GameCenterView />
        <GameCenterQueue />
        <GameCenterTomb />
    </>
  )
}
