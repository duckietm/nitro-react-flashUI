import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { AddEventLinkTracker, CreateLinkEvent, GetConfiguration, RemoveLinkEventTracker } from '../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../common';
import { JoinGameComposer } from '../../packets/GameCenter/JoinGameComposer';
import { JoinGameCenterComposer } from '../../packets/GameCenterCompass/JoinGameCenterComposer';

export const GameCenterView: FC<{}> = props =>
{
    const sso = new URLSearchParams(window.location.search).get('sso');
    const [ isVisible, setIsVisible ] = useState(false)
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
        sendMessage(JSON.stringify(new JoinGameComposer(gameName)));
    }

    const joinGameCenter = (type: string) => 
    {
        CreateLinkEvent('gamecenterqueue/show/'+type);
        sendMessage(JSON.stringify(new JoinGameCenterComposer(type)));
        setIsVisible(false);
    }

    useEffect(() => {
       if(!isVisible){
        setIsLookingAmongUs(false);
        setIsLookingTombRunner(false);
        setIsLookingFlappyBirds(false);
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
            { isVisible &&
                <NitroCardView style={{width: "500px"}}>
                    <NitroCardHeaderView headerText="Centro de juegos"  onCloseClick={ event => setIsVisible(false) }/>
                    <NitroCardContentView>
                        <div className="d-flex justify-content-between">
                            <div>
                                <div className='text-dark' style={{fontWeight: "bold", fontSize: "23px", marginTop: "4px"}}>
                                    <span className='badge bg-dark'>ELEGIR JUEGO</span>
                                </div>
                            </div>
                            <div>
                                <span className='badge bg-dark' style={{marginTop: "10px"}}>
                                    Developed with | by Ange, Ouster, ElMayor & Compass
                                </span>
                            </div>
                        </div>
                        <div className='row mt-2'>
                            <div className='col-md-4 mb-2'>
                                <div onClick={() => joinGameCenter("hamburger")} onMouseEnter={() => setIsLookingHamburger(true)} onMouseLeave={() => setIsLookingHamburger(false)}  className='w-100' style={{backgroundImage: "url(https://is1-ssl.mzstatic.com/image/thumb/Purple111/v4/f8/a6/de/f8a6de15-5309-caba-ff8a-82691d001178/source/512x512bb.jpg)", height: "150px", backgroundSize: "cover", borderRadius: "20px", border: "3px solid #fff", cursor: "pointer"}}>
                                </div>
                            </div>
                            <div className='col-md-4 mb-2'>
                                <div onClick={() => joinGameCenter("battlebuild")} onMouseEnter={() => setIsLookingBattleBuild(true)} onMouseLeave={() => setIsLookingBattleBuild(false)}  className='w-100' style={{backgroundImage: "url(https://cdn.discordapp.com/attachments/1042878447975931905/1079351995871281212/unnamed_1.png)", height: "150px", backgroundSize: "cover", borderRadius: "20px", border: "3px solid #fff", cursor: "pointer"}}>
                                </div>
                            </div>
                            <div className='col-md-4 mb-2'>
                                <div onClick={() => joinGame("amongus")} onMouseEnter={() => setIsLookingAmongUs(true)} onMouseLeave={() => setIsLookingAmongUs(false)} className='w-100' style={{backgroundImage: "url(https://i.imgur.com/B7ynI1J.jpg)", height: "150px", backgroundSize: "cover", borderRadius: "20px", border: "3px solid #fff", cursor: "pointer"}}>
                                </div>
                            </div>
                            <div className='col-md-4 mb-2'>
                                <div onClick={() => CreateLinkEvent("gamecentertomb/show/Tomb Runner/800/500/"+encodeURIComponent("https://files.ufreegame.net/1024/temple-run-2/"))} onMouseEnter={() => setIsLookingTombRunner(true)} onMouseLeave={() => setIsLookingTombRunner(false)}  className='w-100' style={{backgroundImage: "url(https://i.imgur.com/uutVeG8.png)", height: "150px", backgroundSize: "cover", borderRadius: "20px", border: "3px solid #fff", cursor: "pointer"}}>
                                </div>
                            </div>
                            <div className='col-md-4 mb-2'>
                                <div onClick={() => CreateLinkEvent("gamecentertomb/show/Flappy Birds/800/500/"+encodeURIComponent("https://playcanv.as/index/DLgXf1zr"))} onMouseEnter={() => setIsLookingFlappyBirds(true)} onMouseLeave={() => setIsLookingFlappyBirds(false)}  className='w-100' style={{backgroundImage: "url(https://i.imgur.com/jzet61d.png)", height: "150px", backgroundSize: "cover", borderRadius: "20px", border: "3px solid #fff", cursor: "pointer"}}>
                                </div>
                            </div>
                        </div>
                        {isLookingAmongUs && 
                            <>
                                <div className='row mt-2'>
                                    <div className='col-md-8 text-dark'>
                                        <h2><b>AMONG US</b></h2>
                                        <div style={{marginTop: "-10px"}}>
                                            <span className='badge bg-primary text-white'>4-12 jugadores</span>    
                                        </div><br/>
                                        Among Us es un juego multijugador en el que entre 4 y 10 jugadores quedan varados en una nave espacial en el espacio. Cada jugador tiene su propio rol, como compañero de tripulación o impostor.
                                    </div>
                                    <div className='col-md-4'>
                                        <img src="https://i.imgur.com/xrPjlgK.jpg" className='img-fluid' style={{objectFit: "contain", borderRadius: "10px", border: "3px solid #fff"}} />
                                    </div>
                                </div>
                            </>
                        }
                        {isLookingTombRunner && 
                            <>
                                <div className='row mt-2'>
                                    <div className='col-md-8 text-dark'>
                                        <h2><b>TOMB RUNNER</b></h2>
                                        <div style={{marginTop: "-10px"}}>
                                            <span className='badge bg-primary text-white'>Singleplayer</span>    
                                        </div><br/>
                                        Este cazador de tesoros está decidido a encontrar tantas monedas antiguas como sea posible mientras atraviesa pasillos centenarios y salta sobre enormes grietas. En tu viaje a través de este interminable juego de correr en 3D, también encontrarás puentes inestables y frágiles. Averigüe cuánto tiempo puede sobrevivir.
                                    </div>
                                    <div className='col-md-4'>
                                        <img src="https://imgs2.dab3games.com/tomb-runner-game.png" className='img-fluid' style={{objectFit: "contain", borderRadius: "10px", border: "3px solid #fff"}} />
                                    </div>
                                </div>
                            </>
                        }
                        {isLookingFlappyBirds && 
                            <>
                                <div className='row mt-2'>
                                    <div className='col-md-8 text-dark'>
                                        <h2><b>FLAPPY BIRDS</b></h2>
                                        <div style={{marginTop: "-10px"}}>
                                            <span className='badge bg-primary text-white'>Singleplayer</span>    
                                        </div><br/>
                                        Flappy Bird es un juego de estilo arcade en el que controlaremos al pájaro Faby moviéndose hacia la derecha. Tienes la tarea de navegar por Faby a través de tuberías que tienen espacios iguales a alturas aleatorias.
                                    </div>
                                    <div className='col-md-4'>
                                        <img src="https://i.imgur.com/V5IAqv1.png" className='img-fluid' style={{objectFit: "contain", borderRadius: "10px", border: "3px solid #fff"}} />
                                    </div>
                                </div>
                            </>
                        }
                        {isLookingHamburger &&
                            <>
                                <div className='row mt-2'>
                                    <div className='col-md-8 text-dark'>
                                        <h2><b>Bobba Bar</b></h2>
                                        <div style={{marginTop: "-10px"}}>
                                            <span className='badge bg-primary text-white'>2-6 jugadores</span>    
                                        </div><br/>
                                        Demuestra tu habilidad trabajando en el mejor bar de el hotel, sirviendo las mejores copas a los clientes mas exigentes. Intenta ser el camarero con mejor destreza entregando copas para ganar la partida y demostrar tu habilidad trabajando con cocktails.
                                    </div>
                                    <div className='col-md-4'>
                                        <img src="https://cdn.discordapp.com/attachments/1042878447975931905/1079350942698319932/daria-baranihina-artboardhffj-1.jpg" className='img-fluid' style={{objectFit: "contain", borderRadius: "10px", border: "3px solid #fff"}} />
                                    </div>
                                </div>
                            </>
                        }

                        {isLookingBattleBuild &&
                            <>
                                <div className='row mt-2'>
                                    <div className='col-md-8 text-dark'>
                                        <h2><b>Battle Build</b></h2>
                                        <div style={{marginTop: "-10px"}}>
                                            <span className='badge bg-primary text-white'>2-8 jugadores</span>    
                                        </div><br/>
                                        ¿Se te da bien construir salas? ¿Cuentas con la imaginación suficiente? Entra en una batalla y construye una sala en menos de 6 minutos acerca de un tema. ¡La sala mas bonita gana!
                                    </div>
                                    <div className='col-md-4'>
                                        <img src="https://cdn.discordapp.com/attachments/1042878447975931905/1079352166311014430/816msGUwL.png" className='img-fluid' style={{objectFit: "contain", borderRadius: "10px", border: "3px solid #fff"}} />
                                    </div>
                                </div>
                            </>
                        }
                    </NitroCardContentView>
                </NitroCardView>
            }
        </>
    );
}
