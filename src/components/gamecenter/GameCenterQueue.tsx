import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { AddEventLinkTracker, CreateLinkEvent, GetConfiguration, RemoveLinkEventTracker } from '../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../common';
import { useSessionInfo } from '../../hooks';
import { useIsPlaying } from '../../hooks/game-center';
import { ExitQueueComposer } from '../../packets/GameCenter/ExitQueueComposer';
import { ExitGameCenterComposer } from '../../packets/GameCenterCompass/ExitGameCenterComposer';
import GameCenterQueuePlayer from './GameCenterQueuePlayer';

export const GameCenterQueue: FC<{}> = props =>
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
                console.log(playersData);
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
        if(isCompassGameCenter) sendMessage(JSON.stringify(new ExitGameCenterComposer()));
        else sendMessage(JSON.stringify(new ExitQueueComposer("amongus")));
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
            { isVisible &&
                <NitroCardView style={{width: "500px"}}>
                    <NitroCardHeaderView headerText="Centro de juegos"  onCloseClick={ event => setIsVisible(false) }/>
                    <NitroCardContentView>
                        <h5 className='text-center text-dark mt-2'><b>Espera a otros jugadores <img src="https://2.bp.blogspot.com/-P6oQWRcF-Ug/V1kVsrAPbxI/AAAAAAAAqAU/96iLr_IVF0Y7vojQsyGSMB22aOWSZ_QhgCKgB/s1600/progressbubbles.gif" /></b></h5>
                        <div className='row'>

                            {players[0] != null ?
                                <GameCenterQueuePlayer figure={players[0].figure} name={players[0].username} />
                                :
                                <div className='col-md-2 mt-2' style={{cursor: "pointer"}}>
                                    <div className='text-center' style={{backgroundColor: "rgba(189, 200, 208, 255)", padding: "32px", borderRadius: "10px"}}>
                                        <img style={{position: "absolute", marginLeft: "-16px", marginTop: "-23px"}} src="https://1.bp.blogspot.com/-pmAeY9LK0_I/X7MoUyBaEeI/AAAAAAABfRk/UI7s-1orVpYSszigbkaRNd7eVUjKn-qtACPcBGAsYHg/s0/26_HabboAvatarRenderLib_h_std_ha_15_2_0.png" />
                                    </div>
                                </div>
                            }

                            {players[1] != null ?
                                <GameCenterQueuePlayer figure={players[1].figure} name={players[1].username} />
                                :
                                <div className='col-md-2 mt-2' style={{cursor: "pointer"}}>
                                    <div className='text-center' style={{backgroundColor: "rgba(189, 200, 208, 255)", padding: "32px", borderRadius: "10px"}}>
                                        <img style={{position: "absolute", marginLeft: "-16px", marginTop: "-23px"}} src="https://1.bp.blogspot.com/-pmAeY9LK0_I/X7MoUyBaEeI/AAAAAAABfRk/UI7s-1orVpYSszigbkaRNd7eVUjKn-qtACPcBGAsYHg/s0/26_HabboAvatarRenderLib_h_std_ha_15_2_0.png" />
                                    </div>
                                </div>
                            }

                            {players[2] != null ?
                                <GameCenterQueuePlayer figure={players[2].figure} name={players[2].username} />
                                :
                                <div className='col-md-2 mt-2' style={{cursor: "pointer"}}>
                                    <div className='text-center' style={{backgroundColor: "rgba(189, 200, 208, 255)", padding: "32px", borderRadius: "10px"}}>
                                        <img style={{position: "absolute", marginLeft: "-16px", marginTop: "-23px"}} src="https://1.bp.blogspot.com/-pmAeY9LK0_I/X7MoUyBaEeI/AAAAAAABfRk/UI7s-1orVpYSszigbkaRNd7eVUjKn-qtACPcBGAsYHg/s0/26_HabboAvatarRenderLib_h_std_ha_15_2_0.png" />
                                    </div>
                                </div>
                            }
                            {players[3] != null ?
                                <GameCenterQueuePlayer figure={players[3].figure} name={players[3].username} />
                                :
                                <div className='col-md-2 mt-2' style={{cursor: "pointer"}}>
                                    <div className='text-center' style={{backgroundColor: "rgba(189, 200, 208, 255)", padding: "32px", borderRadius: "10px"}}>
                                        <img style={{position: "absolute", marginLeft: "-16px", marginTop: "-23px"}} src="https://1.bp.blogspot.com/-pmAeY9LK0_I/X7MoUyBaEeI/AAAAAAABfRk/UI7s-1orVpYSszigbkaRNd7eVUjKn-qtACPcBGAsYHg/s0/26_HabboAvatarRenderLib_h_std_ha_15_2_0.png" />
                                    </div>
                                </div>
                            }
                            {players[4] != null ?
                                <GameCenterQueuePlayer figure={players[4].figure} name={players[4].username} />
                                :
                                <div className='col-md-2 mt-2' style={{cursor: "pointer"}}>
                                    <div className='text-center' style={{backgroundColor: "rgba(189, 200, 208, 255)", padding: "32px", borderRadius: "10px"}}>
                                        <img style={{position: "absolute", marginLeft: "-16px", marginTop: "-23px"}} src="https://1.bp.blogspot.com/-pmAeY9LK0_I/X7MoUyBaEeI/AAAAAAABfRk/UI7s-1orVpYSszigbkaRNd7eVUjKn-qtACPcBGAsYHg/s0/26_HabboAvatarRenderLib_h_std_ha_15_2_0.png" />
                                    </div>
                                </div>
                            }

                            {players[5] != null ?
                                <GameCenterQueuePlayer figure={players[5].figure} name={players[5].username} />
                                :
                                <div className='col-md-2 mt-2' style={{cursor: "pointer"}}>
                                    <div className='text-center' style={{backgroundColor: "rgba(189, 200, 208, 255)", padding: "32px", borderRadius: "10px"}}>
                                        <img style={{position: "absolute", marginLeft: "-16px", marginTop: "-23px"}} src="https://1.bp.blogspot.com/-pmAeY9LK0_I/X7MoUyBaEeI/AAAAAAABfRk/UI7s-1orVpYSszigbkaRNd7eVUjKn-qtACPcBGAsYHg/s0/26_HabboAvatarRenderLib_h_std_ha_15_2_0.png" />
                                    </div>
                                </div>
                            }
                            {players[6] != null ?
                                <GameCenterQueuePlayer figure={players[6].figure} name={players[6].username} />
                                :
                                <div className='col-md-2 mt-2' style={{cursor: "pointer"}}>
                                    <div className='text-center' style={{backgroundColor: "rgba(189, 200, 208, 255)", padding: "32px", borderRadius: "10px"}}>
                                        <img style={{position: "absolute", marginLeft: "-16px", marginTop: "-23px"}} src="https://1.bp.blogspot.com/-pmAeY9LK0_I/X7MoUyBaEeI/AAAAAAABfRk/UI7s-1orVpYSszigbkaRNd7eVUjKn-qtACPcBGAsYHg/s0/26_HabboAvatarRenderLib_h_std_ha_15_2_0.png" />
                                    </div>
                                </div>
                            }
                            {players[7] != null ?
                                <GameCenterQueuePlayer figure={players[7].figure} name={players[7].username} />
                                :
                                <div className='col-md-2 mt-2' style={{cursor: "pointer"}}>
                                    <div className='text-center' style={{backgroundColor: "rgba(189, 200, 208, 255)", padding: "32px", borderRadius: "10px"}}>
                                        <img style={{position: "absolute", marginLeft: "-16px", marginTop: "-23px"}} src="https://1.bp.blogspot.com/-pmAeY9LK0_I/X7MoUyBaEeI/AAAAAAABfRk/UI7s-1orVpYSszigbkaRNd7eVUjKn-qtACPcBGAsYHg/s0/26_HabboAvatarRenderLib_h_std_ha_15_2_0.png" />
                                    </div>
                                </div>
                            }
                            {players[8] != null ?
                                <GameCenterQueuePlayer figure={players[8].figure} name={players[8].username} />
                                :
                                <div className='col-md-2 mt-2' style={{cursor: "pointer"}}>
                                    <div className='text-center' style={{backgroundColor: "rgba(189, 200, 208, 255)", padding: "32px", borderRadius: "10px"}}>
                                        <img style={{position: "absolute", marginLeft: "-16px", marginTop: "-23px"}} src="https://1.bp.blogspot.com/-pmAeY9LK0_I/X7MoUyBaEeI/AAAAAAABfRk/UI7s-1orVpYSszigbkaRNd7eVUjKn-qtACPcBGAsYHg/s0/26_HabboAvatarRenderLib_h_std_ha_15_2_0.png" />
                                    </div>
                                </div>
                            }
                            {players[9] != null ?
                                <GameCenterQueuePlayer figure={players[9].figure} name={players[9].username} />
                                :
                                <div className='col-md-2 mt-2' style={{cursor: "pointer"}}>
                                    <div className='text-center' style={{backgroundColor: "rgba(189, 200, 208, 255)", padding: "32px", borderRadius: "10px"}}>
                                        <img style={{position: "absolute", marginLeft: "-16px", marginTop: "-23px"}} src="https://1.bp.blogspot.com/-pmAeY9LK0_I/X7MoUyBaEeI/AAAAAAABfRk/UI7s-1orVpYSszigbkaRNd7eVUjKn-qtACPcBGAsYHg/s0/26_HabboAvatarRenderLib_h_std_ha_15_2_0.png" />
                                    </div>
                                </div>
                            }
                            {players[10] != null ?
                                <GameCenterQueuePlayer figure={players[10].figure} name={players[10].username} />
                                :
                                <div className='col-md-2 mt-2' style={{cursor: "pointer"}}>
                                    <div className='text-center' style={{backgroundColor: "rgba(189, 200, 208, 255)", padding: "32px", borderRadius: "10px"}}>
                                        <img style={{position: "absolute", marginLeft: "-16px", marginTop: "-23px"}} src="https://1.bp.blogspot.com/-pmAeY9LK0_I/X7MoUyBaEeI/AAAAAAABfRk/UI7s-1orVpYSszigbkaRNd7eVUjKn-qtACPcBGAsYHg/s0/26_HabboAvatarRenderLib_h_std_ha_15_2_0.png" />
                                    </div>
                                </div>
                            }
                            {players[11] != null ?
                                <GameCenterQueuePlayer figure={players[11].figure} name={players[11].username} />
                                :
                                <div className='col-md-2 mt-2' style={{cursor: "pointer"}}>
                                    <div className='text-center' style={{backgroundColor: "rgba(189, 200, 208, 255)", padding: "32px", borderRadius: "10px"}}>
                                        <img style={{position: "absolute", marginLeft: "-16px", marginTop: "-23px"}} src="https://1.bp.blogspot.com/-pmAeY9LK0_I/X7MoUyBaEeI/AAAAAAABfRk/UI7s-1orVpYSszigbkaRNd7eVUjKn-qtACPcBGAsYHg/s0/26_HabboAvatarRenderLib_h_std_ha_15_2_0.png" />
                                    </div>
                                </div>
                            }


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
