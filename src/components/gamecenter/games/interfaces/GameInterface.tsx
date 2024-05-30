import { useIsPlaying } from '../../../../hooks/game-center';
import { GameInterfaceView } from '../food-delivery/GameInterfaceView';
import { GameWinInterface } from './GameWinInterface';

export const GameInterface = () => 
{
    const { isPlaying } = useIsPlaying();

    return (
        <>
            {
                !!isPlaying &&
                <GameInterfaceView />
            }
            <GameWinInterface />
        </>
    )
}