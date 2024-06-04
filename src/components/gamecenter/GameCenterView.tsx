import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { AddEventLinkTracker, CreateLinkEvent, GetConfiguration, LocalizeText, RemoveLinkEventTracker } from '../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../common';
import { JoinGameComposer } from '../../packets/GameCenter/JoinGameComposer';
import { JoinGameCenterComposer } from '../../packets/GameCenterCompass/JoinGameCenterComposer';

export const GameCenterView: FC<DefaultWebsocketInterface> = props =>
{
    const sso = new URLSearchParams(window.location.search).get('sso');
    const [ isVisible, setIsVisible ] = useState(false)
	const [isLookingSnowStorm, setIsLookingSnowStorm] = useState(false);																	
    const [ isLookingAmongUs, setIsLookingAmongUs] = useState(false);
    const [ isLookingTombRunner, setIsLookingTombRunner] = useState(false);
    const [ isLookingFlappyBirds, setIsLookingFlappyBirds] = useState(false);
    const [ isLookingHamburger, setIsLookingHamburger ] = useState(false);
    const [ isLookingBattleBuild, setIsLookingBattleBuild ] = useState(false);

    const [messageHistory, setMessageHistory] = useState([]);
    const [socketUrl, setSocketUrl] = useState(GetConfiguration<string>("websocket.external.url"));
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, { share: true });

    useEffect(() => {
        if (lastMessage !== null) {
            var message = JSON.parse(lastMessage.data);
    
            if(message.header === "joinGame" && message.data !== null){
                if(message.data.game === "amongus"){
                    CreateLinkEvent("gamecenterqueue/show");
                }
            }
            
        }
      }, [lastMessage, setMessageHistory]);

    function joinGame(gameName: string){
        props.sendPacket(new JoinGameComposer(gameName))
    }

    const joinGameCenter = (type: string) => 
    {
        CreateLinkEvent('gamecenterqueue/show/'+type);
        props.sendPacket(new JoinGameCenterComposer(type))
        setIsVisible(false);
    }

    useEffect(() => {
       if(!isVisible){
        setIsLookingSnowStorm(false);
		setIsLookingAmongUs(false);
		setIsLookingTombRunner(false);
		setIsLookingFlappyBirds(false);
		setIsLookingHamburger(false);
		setIsLookingBattleBuild(false);
       } 
    }, [isVisible]);
    
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
                }
            },
            eventUrlPrefix: 'gamecenter/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ setIsVisible ]);

    return (
        <>
            {isVisible && (
                <NitroCardView style={{ width: "500px" }}>
                    <NitroCardHeaderView headerText="Centro de juegos" onCloseClick={event => setIsVisible(false)} />
                    <NitroCardContentView>
                        <div className='row mt-2'>
                            <div className='col-md-4 mb-2'>
                                <div
                                    onClick={() => joinGameCenter("hamburger")}
                                    onMouseEnter={() => setIsLookingHamburger(true)}
                                    onMouseLeave={() => setIsLookingHamburger(false)}
                                    className='w-100 game-center-image-hamburger'
                                ></div>
                            </div>
                            <div className='col-md-4 mb-2'>
                                <div
                                    onClick={() => joinGameCenter("battlebuild")}
                                    onMouseEnter={() => setIsLookingBattleBuild(true)}
                                    onMouseLeave={() => setIsLookingBattleBuild(false)}
                                    className='w-100 game-center-image-battlebuild'
                                ></div>
                            </div>
                            <div className='col-md-4 mb-2'>
                                <div
                                    onClick={() => joinGame("amongus")}
                                    onMouseEnter={() => setIsLookingAmongUs(true)}
                                    onMouseLeave={() => setIsLookingAmongUs(false)}
                                    className='w-100 game-center-image-amongus'
                                ></div>
                            </div>
                            <div className='col-md-4 mb-2'>
                                <div
                                    onClick={() => CreateLinkEvent(`gamecentertomb/show/Tomb Runner/800/500/${encodeURIComponent("https://files.ufreegame.net/1024/temple-run-2/")}`)}
                                    onMouseEnter={() => setIsLookingTombRunner(true)}
                                    onMouseLeave={() => setIsLookingTombRunner(false)}
                                    className='w-100 game-center-image-tombrunner'
                                ></div>
                            </div>
                            <div className='col-md-4 mb-2'>
                                <div
                                    onClick={() => CreateLinkEvent(`gamecentertomb/show/Flappy Birds/800/500/${encodeURIComponent("https://playcanv.as/index/DLgXf1zr")}`)}
                                    onMouseEnter={() => setIsLookingFlappyBirds(true)}
                                    onMouseLeave={() => setIsLookingFlappyBirds(false)}
                                    className='w-100 game-center-image-flappybirds'
                                ></div>
                            </div>
                        </div>

                        {isLookingAmongUs && (
                            <div className='row mt-2'>
                                <div className='col-md-8 text-dark'>
                                    <h2><b>AMONG US</b></h2>
                                    <div style={{ marginTop: "-10px" }}>
                                        <span className='badge bg-primary text-white'>{LocalizeText('gamecenter.players.4to12')}</span>
                                    </div>
                                    <br />{LocalizeText('gamecenter.amongus.description')}
                                </div>
                                <div className='col-md-4'>
                                    <div className='game-center-image-amongus-image'></div>
                                </div>
                            </div>
                        )}

                        {isLookingTombRunner && (
                            <div className='row mt-2'>
                                <div className='col-md-8 text-dark'>
                                    <h2><b>TOMB RUNNER</b></h2>
                                    <div style={{ marginTop: "-10px" }}>
                                        <span className='badge bg-primary text-white'>{LocalizeText('gamecenter.players.single')}</span>
                                    </div>
                                    <br />{LocalizeText('gamecenter.tombrunner.description')}
                                </div>
                                <div className='col-md-4'>
                                    <div className='game-center-image-tombrunner-image'></div>
                                </div>
                            </div>
                        )}

                        {isLookingFlappyBirds && (
                            <div className='row mt-2'>
                                <div className='col-md-8 text-dark'>
                                    <h2><b>FLAPPY BIRDS</b></h2>
                                    <div style={{ marginTop: "-10px" }}>
                                        <span className='badge bg-primary text-white'>{LocalizeText('gamecenter.players.single')}</span>
                                    </div>
                                    <br />{LocalizeText('gamecenter.flappybirds.description')}
                                </div>
                                <div className='col-md-4'>
                                    <div className='game-center-image-flappybirds-image'></div>
                                </div>
                            </div>
                        )}

                        {isLookingHamburger && (
                            <div className='row mt-2'>
                                <div className='col-md-8 text-dark'>
                                    <h2><b>Bobba Bar</b></h2>
                                    <div style={{ marginTop: "-10px" }}>
                                        <span className='badge bg-primary text-white'>{LocalizeText('gamecenter.players.2to6')}</span>
                                    </div>
                                    <br />{LocalizeText('gamecenter.bargame.description')}
                                </div>
                            </div>
                        )}

                        {isLookingBattleBuild && (
                            <div className='row mt-2'>
                                <div className='col-md-8 text-dark'>
                                    <h2><b>Battle Build</b></h2>
                                    <div style={{ marginTop: "-10px" }}>
                                        <span className='badge bg-primary text-white'>{LocalizeText('gamecenter.players.2to8')}</span>
                                    </div>
                                    <br />{LocalizeText('gamecenter.roombuildergame.description')}
                                </div>
                            </div>
                        )}
                    </NitroCardContentView>
                </NitroCardView>
            )}
        </>
    );
};