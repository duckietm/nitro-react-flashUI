import { useIsPlaying } from '../../../../hooks/game-center';
import { GameInterfaceView } from '../food-delivery/GameInterfaceView';
import { GameWinInterface } from './GameWinInterface';

export const GameInterface = (props: DefaultWebsocketInterface) => 
{
    const { isPlaying } = useIsPlaying();

    return (
        <>
            {
                !!isPlaying &&
                <GameInterfaceView sendPacket={props.sendPacket} />
            }
            <GameWinInterface />
        </>
    )
}
