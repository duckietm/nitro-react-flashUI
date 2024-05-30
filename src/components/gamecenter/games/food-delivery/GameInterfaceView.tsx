import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import useWebSocket from 'react-use-websocket';
import { AddEventLinkTracker, CreateLinkEvent, GetConfiguration, RemoveLinkEventTracker } from '../../../../api';
import { Base, Button, Flex, LayoutAvatarImageView, Text } from '../../../../common';
import { useIsPlaying } from '../../../../hooks/game-center';
import { ExitGameCenterComposer } from '../../../../packets/GameCenterCompass/ExitGameCenterComposer';
import { VotationGameCenterComposer } from '../../../../packets/GameCenterCompass/VotationGameCenterComposer';
import GameVotationInterfaceView from './GameVotationInterfaceView';

export const GameInterfaceView: FC<{}> = props =>
{
    //
    const [isVisible, setIsVisible] = useState(true);
    const [scores, setScores] = useState([]);
    const [time, setTime] = useState(0);
    const [theme, setTheme] = useState(null);

    // Votations
    const [votationStarted, setVotationStarted] = useState(false);
    const [votationVisible, setVotationVisible] = useState(false);
    const [votationUsername, setVotationUsername] = useState(null);
    const [votationFigure, setVotationFigure] = useState(null);
    const [votationParticipantId, setVotationParticipantId] = useState(0);

    //
    // const [ messageHistory, setMessageHistory ] = useState([]);
    // const [ socketUrl, setSocketUrl ] = useState('wss://ws.habbe.es:8443');
    // const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, { share: true });

    //
    const [messageHistory, setMessageHistory] = useState([]);
    const [socketUrl, setSocketUrl] = useState(GetConfiguration<string>("websocket.external.url"));
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, { share: true });
    const { isPlaying, setIsPlaying, setWinners } = useIsPlaying();

    useEffect(() => {
        console.log("Is playing: " + isPlaying);
        console.log("Is visible: " + isVisible);
    }, [isPlaying, isVisible])

    //
    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if (parts.length < 2) return;

                switch (parts[1])
                {
                    case 'show':
                        setIsVisible(true);
                        setVotationStarted(false);
                        setTheme(null);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                }
            },
            eventUrlPrefix: 'food-delivery-interface/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    const vote = (id, number) => {
        sendMessage(JSON.stringify(new VotationGameCenterComposer(id, number)))
        setVotationVisible(false);
    }

    const cancelMatch = () => 
    {
        setIsVisible(false);
        setIsPlaying(false);
        sendMessage(JSON.stringify(new ExitGameCenterComposer()));
    }

    useEffect(() => {
        
        if (lastMessage !== null) {
            var message = JSON.parse(lastMessage.data);
    
            if (message.header === 'gameInfo' && message.data !== null) 
        {
            setIsVisible(true);
            setScores(JSON.parse(message.data.scores));
            setTime(JSON.parse(message.data.end));

            if (message.data.theme !== null) setTheme(message.data.theme);
            if (message.data.theme === null || message.data.theme === undefined) setTheme(null);
        }

        if (message.header === 'gameScoreInfo' && message.data !== null) 
        {
            setScores(JSON.parse(message.data.scores));
        }

        if (message.header === 'winnerInfo' && message.data !== null) 
        {
            setIsPlaying(false);
            setWinners(JSON.parse(message.data.scores));
            CreateLinkEvent('gameinterfacewin/show');
        }

        if(message.header === "showVotationBattleBuild" && message.data !== null){
            setVotationStarted(true);
            
            setVotationUsername(message.data.name);
            setVotationFigure(message.data.figure);
            setVotationParticipantId(message.data.id);

            setVotationVisible(true);
        }

        if(message.header === "closeVotationBattleBuild") setVotationVisible(false);
            
        }
      }, [lastMessage, setMessageHistory]);

    //
    const renderer = ({ minutes, seconds }) => 
    {
        return (
            <>
                <span>{minutes} minutos {seconds} segundos</span>
            </>
        );
    };

    return (
        <>
            {isVisible &&
                <>
                    <Base className="nitro-game-interface">
                        <Flex className="w-100" justifyContent="between">
                            <Flex className="left-side" column gap={2}>
                                {theme !== null &&
                                    <>
                                        <Button disabled>
                                            <b>Temática: {theme}</b>
                                        </Button>
                                        {!votationStarted &&
                                            <>
                                                <Button onClick={ event => CreateLinkEvent('catalog/toggle') }>Abrir catálogo</Button>
                                                <Button onClick={ event => CreateLinkEvent('inventory/toggle') }>Abrir inventario</Button>
                                            </>
                                        }
                                    </>
                                }
                                <Button onClick={() => cancelMatch()}>Salir del juego</Button>
                                <Flex className="bg-layer-0 small" column alignItems="center">
                                    <Text variant="white" bold>Tiempo restante</Text>
                                    <hr />
                                    { /* { time } */}
                                    <Countdown date={time * 1000} renderer={renderer} key={time} />
                                </Flex>
                            </Flex>
                            <Base className="right-side">
                                <Flex className="bg-layer-0 small" column alignItems="center">
                                    <Text variant="white" bold>Jugadores</Text>
                                    <hr />
                                    <Flex column alignItems="center" gap={2} className="player-list">
                                        {scores.sort((a, b) => b.score - a.score).map((player, index) => (
                                            <Flex alignItems="center" gap={3} key={player.ranking} className="player">
                                                <Text variant="white" bold className="score">{index + 1}</Text>
                                                <LayoutAvatarImageView figure={player.figure} direction={2} />
                                                <Flex column>
                                                    <Text variant="white" bold>{player.username}</Text>
                                                    <Text variant="white" small>Puntuación: {player.score}</Text>
                                                </Flex>
                                            </Flex>
                                        ))}
                                    </Flex>
                                </Flex>
                            </Base>
                        </Flex>
                    </Base>
                    
                    {votationVisible && <GameVotationInterfaceView username={votationUsername} figure={votationFigure} id={votationParticipantId} vote={vote} />}
                </>
            }
        </>
    );

}
