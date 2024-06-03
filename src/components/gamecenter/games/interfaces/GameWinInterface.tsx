import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { AddEventLinkTracker, LocalizeText, RemoveLinkEventTracker } from '../../../../api';
import { Base, Button, Flex, LayoutAvatarImageView, Text } from '../../../../common';
import useWindowSize from '../../../../hooks/communicator/useWindowSize';
import { useIsPlaying } from '../../../../hooks/game-center';

export const GameWinInterface: FC<{}> = props =>
{
    const { winners = null } = useIsPlaying();
    const { width, height } = useWindowSize();
    const [ isVisible, setIsVisible ] = useState(false);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length < 2) return;
        
                switch(parts[1])
                {
                    case 'show':
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                }
            },
            eventUrlPrefix: 'gameinterfacewin/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    return (
        <>
            { isVisible &&
                <>
                    <Base className="nitro-game-interface">
                        <Base className="center-side overlay">
                            <Flex className="bg-layer-0" column gap={ 2 }>
                                <Base className="">
                                    <Text variant="white" bold className="score">{LocalizeText('gamecenter.players.winner')}</Text>
                                </Base>
                                <Flex gap={ 3 } className="min-height">
                                    <Flex alignItems="end">
                                        <Base className="img-stand position-relative">
                                            { winners.map((player, index) => (
                                                <LayoutAvatarImageView figure={ player.figure } direction={ 2 } key={ index } />
                                            )) }
                                        </Base>
                                    </Flex>
                                    <Base className="w-auto player-list">
                                        <Flex column gap={ 2 } center fullHeight>
                                            { winners.map((player, index) => (
                                                <Flex alignItems="center" gap={ 3 } key={ index } className="player">
                                                    <Text variant="white" bold className="score">{ index + 1 }</Text>
                                                    <LayoutAvatarImageView figure={ player.figure } direction={ 2 } />
                                                    <Flex column>
                                                        <Text variant="white" bold>{ player.username }</Text>
                                                        <Text variant="white" small>{LocalizeText('gamecenter.players.score')} { player.score }</Text>
                                                    </Flex>
                                                </Flex>
                                            )) }
                                            <Button className="w-100" onClick={ () => setIsVisible(false) }>OK</Button>
                                        </Flex>
                                    </Base>
                                </Flex>
                            </Flex>
                            <Confetti run={ isVisible } recycle={ true } width={ width } height={ height } numberOfPieces={ 60 } style={ { zIndex: 3 } } initialVelocityY={ 2 } initialVelocityX={ 1 }/>
                        </Base>
                    </Base>
                </>
            }
        </>
    );
}
