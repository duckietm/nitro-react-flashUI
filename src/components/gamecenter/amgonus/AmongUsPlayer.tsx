import { ILinkEventTracker, RoomObjectCategory, RoomObjectType } from '@nitrots/nitro-renderer';
import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { clearInterval, setInterval } from 'timers';
import { AddEventLinkTracker, CreateLinkEvent, GetConfiguration, RemoveLinkEventTracker } from '../../../api';
import { PlayerAmong } from '../../../common/amongus/PlayerAmong';
import { useRoom, useSessionInfo } from '../../../hooks';
import { DeleteVoteComposer } from '../../../packets/AmongUs/DeleteVoteComposer';
import { KillComposer } from '../../../packets/AmongUs/KillComposer';
import { VoteComposer } from '../../../packets/AmongUs/VoteComposer';
import { ContextShadeView } from '../../room/widgets/context-menu/ContextShadeView';

export const AmongUsPlayer = (props) => {
    const [ isVisible, setIsVisible ] = useState(false)
    
    const [ votingView, setVotingView ] = useState(false);
    const [ votingPlayers, setVotingPlayers ] = useState(null);
    const [ timeEntVoting, setTimeEndVoting ] = useState(0);

    const [ isImpostor, setImpostor ] = useState(false)
    const [ isShhh, setShhh ] = useState(true)
    const [ amongType, setAmongType ] = useState("");

    const [ expleView, setExpleView ] = useState(false);
    const [ playerExpel, setPlayerExpel ] = useState(null);

    const [ winnersView, setWinnersView ] = useState(false);
    const [ winnersPlayers, setWinnersPlayers ] = useState([]);
    const [ winner, setWinner ] = useState(false);

    const { roomSession = null } = useRoom();
    const sessionInfo = useSessionInfo();

    const [ shadeView, setShadeView ] = useState(false);

    const [messageHistory, setMessageHistory] = useState([]);
    const [socketUrl, setSocketUrl] = useState(GetConfiguration<string>("websocket.external.url"));
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, { share: true });

    useEffect(() => {
        if (lastMessage !== null) {
            var message = JSON.parse(lastMessage.data);

            if(message.header === "initVoting" && message.data != null){
                var players = JSON.parse(message.data.playersVoting);

                setVotingPlayers(players);
                setTimeEndVoting(120);
                setVotingView(true);
            }

            if(message.header === "updateVoting" && message.data != null){
                var players = JSON.parse(message.data.playersVoting);

                setVotingPlayers(players);
            }

            if(message.header === "endVoting"){
                setVotingPlayers(null);
                setVotingView(false);
                setTimeEndVoting(0);

                if(message.data != null){
                    var p = JSON.parse(message.data.amongPlayer);

                    setPlayerExpel(p);
                    setExpleView(true);
                    
                    scene("exple", 4000)
                }
            }

            if(message.header === "countEndVoting"){
                setTimeEndVoting(message.data.timeVoting)
            }

            if(message.header === "amongWinners" && message.data != null){
                var players = JSON.parse(message.data.winnersPlayers);
                setWinnersPlayers(players);
                setWinner(message.data.winner);
                setWinnersView(true);
                setShadeView(false);

                setVotingPlayers(null);
                setVotingView(false);
                setTimeEndVoting(0);

                CreateLinkEvent("toolbar/show");
                CreateLinkEvent("friendsview/show");
                CreateLinkEvent("rightside/show");
                CreateLinkEvent("upside/show");
                CreateLinkEvent("roomwidgets/show");
                
                scene("winners", 4000);
            }

            if(message.header === "amongLeftPlayer"){
                setVotingPlayers(null);
                setVotingView(false);
                setTimeEndVoting(0);
                setShadeView(false);

                CreateLinkEvent("toolbar/show");
                CreateLinkEvent("friendsview/show");
                CreateLinkEvent("rightside/show");
                CreateLinkEvent("upside/show");
                CreateLinkEvent("roomwidgets/show");
            }
            
            
        }
      }, [lastMessage, setMessageHistory]);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length < 2) return;

                switch(parts[1])
                {
                    case 'init':
                        setIsVisible(true);
                        setVotingView(true);
                        setShadeView(true);
                        

                        if(parts[2] === "true"){
                            setImpostor(true);
                            CreateLinkEvent("toolbar/impostor");
                        }

                        setAmongType(parts[3]);
                        
                        scene("sshh", 3000);
                        scene("myAmong", 7000);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        setShhh(true);
                        return;
                    case 'kill':
                        sendMessage(JSON.stringify(new KillComposer()));
                        return;
                }
            },
            eventUrlPrefix: 'amongus/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ setIsVisible, setShhh, setVotingView ]);

    const votePlayer = (userId: number) =>{
        sendMessage(JSON.stringify(new VoteComposer(userId)));
    } 

    const DeletevotePlayer = (userId: number) =>{
        sendMessage(JSON.stringify(new DeleteVoteComposer(userId)));
    }

    const scene = (type: string, delay: number) => {
        const interval = setInterval(() => {
            switch(type){
                case "exple":
                    setExpleView(false)
                    break
                case "winners":
                    setWinnersView(false)
                    break;
                case "myAmong":
                    setIsVisible(false);
                    setShhh(true);
                case "sshh":
                    setShhh(false) 
                default : 
                    return () => clearInterval(interval);
            }
        }, delay)

        return () => clearInterval(interval);
    }

    return(
        <>
        { isVisible &&
        <div className='background-amongus'>
            { isShhh ? 
                <div className='shhh animate__animated animate__fadeIn'></div>
             :
                <div className='animate__animated animate__fadeIn'>
                    { isImpostor ?
                        <><div className="impostor">Impostor</div><div className="red-light"></div></>
                        :
                        <><div className="crewmate">Crewmate</div><div className="blue-light"></div></>
                    }
                    
                    <PlayerAmong amongType={amongType} voting={false}/>
                </div>
            }
        </div>
        }

        { shadeView && roomSession != null && roomSession.userDataManager.getUserData(sessionInfo.userInfo.userId) != null &&
            <ContextShadeView objectId={roomSession.userDataManager.getUserData(sessionInfo.userInfo.userId).roomIndex} category={RoomObjectCategory.UNIT} userType={RoomObjectType.USER} />
        }
        

        { votingView && votingPlayers != null &&
            <div className='background-amongus-votes d-flex justify-content-center'>
                <div className="tablet">
                    <div className="screen">
                        <div className="h11">Who Is The Imposter?</div>
                        <div className='row players-votes'>
                            { votingPlayers.map((p) =>
                                <div className='col-6'>
                                    <div className={`tiles ${ p.death ? "death" : "alive"}`}>
                                        { p.username } <br></br>
                                            
                                        <div className='row votes-list'>
                                            { p.votes != null && p.votes.map((v) =>
                                                <div className='col votes'>
                                                    <div className={`among-votings ${v}`}></div>
                                                </div>
                                            )}
                                            
                                        </div>

                                        <div className={`among-votings ${ p.amongType } p`}>
                                            { p.isVoted && <div className='ivoted'></div> }
                                        </div>

                                        { p.death ? '' : 
                                        <> 
                                        <div className="vote tick t-img voted" onClick={() => votePlayer(p.userId)}></div>
                                        <div className="vote cross t-img rvoted" onClick={() => DeletevotePlayer(p.userId)}></div>
                                        </>
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <button className="skip-btn">SKIP</button>
                        <div className="time">Voting Ends In: {timeEntVoting}s</div>
                    </div>
                </div>
            </div>
        }

        { expleView && 
            <div className='expel'>
                <div className="sky"></div>
            
                <div className='h111'>{playerExpel.amongName} was ejected.</div>
            
                <div className="boi">
                    <div className={`rightleg ${playerExpel.amongType}`}></div>
                    <div className={`leftleg ${playerExpel.amongType}`}></div>
                    <div className={`backpack ${playerExpel.amongType}`}></div>
                    <div className={`belly ${playerExpel.amongType}`}></div>
                    <div className={`eye`}></div>
                    <div className={`leftleg`}></div>
                </div>
            </div>
        }

        { winnersView &&
            <div className='background-amongus-winners'>
                <div className='animate__animated animate__fadeIn'>
                    { winner ? 
                        <><div className="crewmate">Victory</div><div className="blue-light"></div></>
                    :
                        <><div className="impostor">Defeat</div><div className="red-light"></div></>
                    }

                    <div className='winners row justify-content-md-center animate__animated animate__fadeIn'>
                            <>
                                <div className="a">
                                    {winnersPlayers[10] != null ?
                                        <img src={`https://images.habbo.je/images/amongus/${winnersPlayers[10]}.png`} alt="" style={{ objectFit: "contain" }} />
                                        :
                                        <img src={`https://images.habbo.je/images/amongus/none.png`} alt="" style={{ objectFit: "contain" }} />
                                    }
                                    {winnersPlayers[9] != null ?
                                        <img src={`https://images.habbo.je/images/amongus/${winnersPlayers[9]}.png`} alt="" style={{ objectFit: "contain" }} className='r' /> 
                                        : 
                                        <img src={`https://images.habbo.je/images/amongus/none.png`} alt="" style={{ objectFit: "contain" }} className='r' />
                                    }
                                </div>
                                <div className="b">
                                    {winnersPlayers[8] != null ?
                                        <img src={`https://images.habbo.je/images/amongus/${winnersPlayers[8]}.png`} alt="" style={{ objectFit: "contain" }} />
                                        :
                                        <img src={`https://images.habbo.je/images/amongus/none.png`} alt="" style={{ objectFit: "contain" }} />
                                    }
                                    {winnersPlayers[7] != null ?
                                        <img src={`https://images.habbo.je/images/amongus/${winnersPlayers[7]}.png`} alt="" style={{ objectFit: "contain" }} className='r' />
                                        : 
                                        <img src={`https://images.habbo.je/images/amongus/none.png`} alt="" style={{ objectFit: "contain" }} className='r' />
                                    }
                                </div>
                                <div className="c">
                                    {winnersPlayers[6] != null ?
                                        <img src={`https://images.habbo.je/images/amongus/${winnersPlayers[6]}.png`} alt="" style={{ objectFit: "contain" }} />
                                        :
                                        <img src={`https://images.habbo.je/images/amongus/none.png`} alt="" style={{ objectFit: "contain" }} />
                                    }
                                    {winnersPlayers[5] != null ?
                                        <img src={`https://images.habbo.je/images/amongus/${winnersPlayers[5]}.png`} alt="" style={{ objectFit: "contain" }} className='r' />
                                        : 
                                        <img src={`https://images.habbo.je/images/amongus/none.png`} alt="" style={{ objectFit: "contain" }} className='r' />
                                    }
                                </div>
                                <div className="d">
                                    {winnersPlayers[4] != null ?
                                        <img src={`https://images.habbo.je/images/amongus/${winnersPlayers[4]}.png`} alt="" style={{ objectFit: "contain" }} />
                                        :
                                        <img src={`https://images.habbo.je/images/amongus/none.png`} alt="" style={{ objectFit: "contain" }} />
                                    }
                                    {winnersPlayers[3] != null ?
                                        <img src={`https://images.habbo.je/images/amongus/${winnersPlayers[3]}.png`} alt="" style={{ objectFit: "contain" }} className='r' />
                                        : 
                                        <img src={`https://images.habbo.je/images/amongus/none.png`} alt="" style={{ objectFit: "contain" }} className='r' />
                                    }
                                </div>
                                <div className="e">
                                    {winnersPlayers[2] != null ?
                                        <img src={`https://images.habbo.je/images/amongus/${winnersPlayers[2]}.png`} alt="" style={{ objectFit: "contain" }} />
                                        :
                                        <img src={`https://images.habbo.je/images/amongus/none.png`} alt="" style={{ objectFit: "contain" }} />
                                    }
                                    {winnersPlayers[1] != null ?
                                        <img src={`https://images.habbo.je/images/amongus/${winnersPlayers[1]}.png`} alt="" style={{ objectFit: "contain" }} className='r' />
                                        : 
                                        <img src={`https://images.habbo.je/images/amongus/none.png`} alt="" style={{ objectFit: "contain" }} className='r' />
                                    }
                                </div>
                                <div className="f">
                                    {winnersPlayers[0] != null ?
                                        <img src={`https://images.habbo.je/images/amongus/${winnersPlayers[0]}.png`} alt="" style={{objectFit: "contain"}}/>
                                        :
                                        <img src={`https://images.habbo.je/images/amongus/none.png`} alt="" style={{ objectFit: "contain" }} />
                                    }
                                </div>
                            </>
                    </div>
                    
                </div>
            </div>
        }
        
        </>    
    );
}