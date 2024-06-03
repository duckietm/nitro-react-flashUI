import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { AddEventLinkTracker, CreateLinkEvent, GetConfiguration, LocalizeText, RemoveLinkEventTracker } from '../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../common';
import { useSessionInfo } from '../../hooks';
import { useIsPlaying } from '../../hooks/game-center';
import { ExitQueueComposer } from '../../packets/GameCenter/ExitQueueComposer';
import { ExitGameCenterComposer } from '../../packets/GameCenterCompass/ExitGameCenterComposer';
import GameCenterQueuePlayer from './GameCenterQueuePlayer';

export const GameCenterQueue: FC<DefaultWebsocketInterface> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false)
    const user = useSessionInfo();
    const [ players, setPlayers ] = useState([]);
    const [ count, setCount ] = useState(0);
    const [ isCompassGameCenter, setIsCompassGameCenter ] = useState(false);

    const [messageHistory, setMessageHistory] = useState([]);
    const [socketUrl, setSocketUrl] = useState(GetConfiguration<string>("websocket.external.url"));
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, { share: true });

    const { setIsPlaying } = useIsPlaying();

    useEffect(() => {
        if (lastMessage !== null) {
            var message = JSON.parse(lastMessage.data);
    
            if(message.header === "playersQueue" && message.data !== null){
                setCount(message.data.playerCount);

                var playersData = JSON.parse(message.data.players);

                setPlayers(playersData);
            }

            if(message.header === "startgame" && message.data !== null){
                setIsVisible(false);

                setCount(0);
                setPlayers([]);

                CreateLinkEvent("amongus/init/" + message.data.impostor + "/" + message.data.amongType);

                CreateLinkEvent("friendsview/hide");
                CreateLinkEvent("toolbar/hide");
                CreateLinkEvent("rightside/hide");
                CreateLinkEvent("upside/hide");
                CreateLinkEvent("roomwidgets/hide");
            }

            if(message.header === "gamequeue" && message.data !== null){
                setPlayers(JSON.parse(message.data.players));
            }

            if(message.header === "closegamequeue"){
                setIsVisible(false);
                setIsPlaying(true);
            }
            
        }
      }, [lastMessage, setMessageHistory]);

    useEffect(() => {
        if(isVisible) CreateLinkEvent('gamecenter/hide');
    }, [isVisible]);

    const cancelMatch = () => {
        if(isCompassGameCenter) props.sendPacket(new ExitGameCenterComposer())
        else props.sendPacket(new ExitQueueComposer("amongus"))
        setCount(0);
        setPlayers([]);
        setIsVisible(false);
        CreateLinkEvent('gamecenter/show');
    }
    
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
                        if(parts[2] !== null && parts[2] !== undefined) setIsCompassGameCenter(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                }
            },
            eventUrlPrefix: 'gamecenterqueue/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ setIsVisible ]);

    return (
    <>
        {isVisible && 
            <NitroCardView style={{width: "500px"}}>
                <NitroCardHeaderView headerText={LocalizeText('gamecenter.waiting.game.title')} onCloseClick={event => setIsVisible(false)} />
                <NitroCardContentView>
                    <h5 className="waiting-header">
                        <b>{LocalizeText('snowwar.waiting_players')} <span className="waiting-img"></span></b>
                    </h5>
                    <div className='row'>
                        {[...Array(12).keys()].map(index => (
                            <div key={index} className='col-md-2 mt-2' style={{cursor: "pointer"}}>
                                {players[index] ? (
                                    <div className="avatar-position">
                                        <GameCenterQueuePlayer figure={players[index].figure} name={players[index].username} />
                                    </div>
                                ) : (
                                    <div className="avatar-waiting">
                                        <img className="avatar-image" />
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="col-md-12">
                            <button onClick={() => cancelMatch()} className='mt-3 btn btn-danger w-100'>Cancel match</button>
                        </div>
                    </div>
                </NitroCardContentView>
            </NitroCardView>
        }
    </>
);
}
