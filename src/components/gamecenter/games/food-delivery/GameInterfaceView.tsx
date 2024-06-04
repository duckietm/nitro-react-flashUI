import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import useWebSocket from 'react-use-websocket';
import { AddEventLinkTracker, CreateLinkEvent, GetConfiguration, LocalizeText, RemoveLinkEventTracker } from '../../../../api';
import { Base, Button, Flex, LayoutAvatarImageView, Text } from '../../../../common';
import { useIsPlaying } from '../../../../hooks/game-center';
import { ExitGameCenterComposer } from '../../../../packets/GameCenterCompass/ExitGameCenterComposer';
import { ActiveSkillComposer } from '../../../../packets/battleball/ActiveSkillComposer';
import { GameVotationInterfaceView } from './GameVotationInterfaceView';
import { VotationGameCenterComposer } from '../../../../packets/GameCenterCompass/VotationGameCenterComposer';
import { useSessionInfo } from '../../../../hooks';

export const GameInterfaceView: FC<DefaultWebsocketInterface> = props => {
    const [isVisible, setIsVisible] = useState(true);
    const [scores, setScores] = useState([]);
    const [time, setTime] = useState(0);
    const [theme, setTheme] = useState(null);

    // Snow
    const [snow, setSnow] = useState(false);
    const [snowInfo, setSnowInfo] = useState(null);

    // Votations
    const [votationStarted, setVotationStarted] = useState(false);
    const [votationVisible, setVotationVisible] = useState(false);
    const [votationUsername, setVotationUsername] = useState(null);
    const [votationFigure, setVotationFigure] = useState(null);
    const [votationParticipantId, setVotationParticipantId] = useState(0);
    const [voteCompleted, setVoteCompleted] = useState(false);

    // BattleBall
    const [battleBallPower, setBattleBallPower] = useState(null);

    const [messageHistory, setMessageHistory] = useState([]);
    const [socketUrl, setSocketUrl] = useState(GetConfiguration<string>("websocket.external.url"));
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, { share: true });
    const { isPlaying, setIsPlaying, setWinners } = useIsPlaying();
    const userInfo = useSessionInfo();

    useEffect(() => {
    }, [isPlaying, isVisible]);

    useEffect(() => {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) => {
                const parts = url.split('/');

                if (parts.length < 2) return;

                switch (parts[1]) {
                    case 'show':
                        setIsVisible(true);
                        setVotationStarted(false);
                        setTheme(null);

                        setSnowInfo(null);
                        setSnow(false);
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

    const cancelMatch = () => {
        setIsVisible(false);
        setIsPlaying(false);
        props.sendPacket(new ExitGameCenterComposer());
    }

    const vote = (id: number, number: number) => {
        props.sendPacket(new VotationGameCenterComposer(id, number));
        setVotationVisible(false);
        setVoteCompleted(true);
    }

    useEffect(() => {
        if (lastMessage !== null) {
            const message = JSON.parse(lastMessage.data);

            if (message.header === 'gameInfo' && message.data !== null) {
                setIsVisible(true);
                setScores(JSON.parse(message.data.scores));
                setTime(JSON.parse(message.data.end));

                if (message.data.theme !== null) setTheme(message.data.theme);
                if (message.data.theme === null || message.data.theme === undefined) setTheme(null);

                if (message.data.snow !== null) setSnow(true);
                if (message.data.snow === null || message.data.snow === undefined) setSnow(false);
            }

            if (message.header === 'entityInfo' && message.data !== null) setSnowInfo(message.data);

            if (message.header === 'gameScoreInfo' && message.data !== null) {
                setScores(JSON.parse(message.data.scores));
            }

            if (message.header === 'winnerInfo' && message.data !== null) {
                setIsPlaying(false);
                setWinners(JSON.parse(message.data.scores));
                CreateLinkEvent('gameinterfacewin/show');
            }

            if (message.header === "showVotationBattleBuild" && message.data !== null) {
                setVotationStarted(true);

                setVotationUsername(message.data.name);
                setVotationFigure(message.data.figure);
                setVotationParticipantId(message.data.id);

                setVotationVisible(true);
                setVoteCompleted(false);
            }

            if (message.header === "closeVotationBattleBuild") setVotationVisible(false);

            if (message.header === "battleBallPower" && message.data !== null) {
                setBattleBallPower(message.data);
            }

            if (message.header === "soundGameInfo" && message.data !== null) {
                new Audio(message.data.link).play();
            }

        }
    }, [lastMessage, setMessageHistory]);

    const renderer = ({ minutes, seconds }) => {
        return (
            <>
                <span>{minutes} {LocalizeText('countdown_clock_unit_minutes')} {seconds} {LocalizeText('countdown_clock_unit_seconds')}</span>
            </>
        );
    };

    return (
        <>
            {isVisible &&
                <>
                    <Base className="nitro-game-interface mt-5">
                        <Flex className="w-100" justifyContent="between">
                            <Flex className="left-side" style={{ marginTop: "100px" }} column gap={2}>
                                {theme !== null &&
                                    <>
                                        <Button disabled>
                                            <b>{LocalizeText('gamecenter.players.theme')} {theme}</b>
                                        </Button>
                                        {!votationStarted &&
                                            <>
                                                <Button onClick={event => CreateLinkEvent('catalog/toggle')}>{LocalizeText('inventory.open.catalog')}</Button>
                                                <Button onClick={event => CreateLinkEvent('inventory/toggle')}>{LocalizeText('camera.open.inventory')}</Button>
                                            </>
                                        }
                                    </>
                                }
                                <Button onClick={() => cancelMatch()}>{LocalizeText('snowwar.leave_game')}</Button>
                                <Flex className="bg-layer-0 small" column alignItems="center">
                                    <Text variant="white" bold>{LocalizeText('resolution.progress.time.left')}</Text>
                                    <hr />
                                    <Countdown date={time * 1000} renderer={renderer} key={time} />
                                </Flex>
                                {battleBallPower != null && battleBallPower.name != "null" &&
                                    <Flex className="bg-layer-0 small" gap={3} alignItems='center'>
                                        <Button style={{ width: "50px", height: "45px" }}>
                                            <div className={`${battleBallPower.time != null && battleBallPower.time <= 10 ? `icon-timer-cooldown cooldown-${battleBallPower.time}` : "icon-timer"} `} />
                                        </Button>
                                        <FontAwesomeIcon icon="chevron-right" />
                                        <Button style={{ width: "50px", height: "45px" }} onClick={() => props.sendPacket(new ActiveSkillComposer())}>
                                            <div className={`icon-pow icon-${battleBallPower.name}`} />
                                        </Button>
                                    </Flex>
                                }
                                {snow && snowInfo !== null &&
                                    <>
                                        <div className="bg-layer-0 small">
                                            <div className='w-100'>
                                                <div className='row'>
                                                    <div className='col-md-5'>
                                                        <div className='battlepass-user-circle' style={{ backgroundImage: `url(${GetConfiguration<string[]>('server.imager')}${userInfo.userFigure}&direction=2&head_direction=2`, backgroundRepeat: "no-repeat", backgroundPosition: "center -10px" }} />
                                                    </div>
                                                    <div className="col-md-7 text-center">
                                                        <div className='mt-1'>
                                                            <div className='mt-2'>
                                                                <h5><b>Meine Team Punkte</b></h5>
                                                                <div className='progress'>
                                                                    <div className="progress-bar" role="progressbar" style={{ width: snowInfo.teamScore1 / (snowInfo.teamScore1 + snowInfo.teamScore2) * 100 + '%' }} aria-valuenow={snowInfo.teamScore1 / (snowInfo.teamScore1 + snowInfo.teamScore2) * 100} aria-valuemin={0} aria-valuemax={100}></div>
                                                                </div>
                                                            </div>
                                                            <div className='mt-2'>
                                                                <h5><b>Gegnerische Team Punkte</b></h5>
                                                                <div className='progress'>
                                                                    <div className="progress-bar" role="progressbar" style={{ width: snowInfo.teamScore2 / (snowInfo.teamScore1 + snowInfo.teamScore2) * 100 + '%' }} aria-valuenow={snowInfo.teamScore2 / (snowInfo.teamScore1 + snowInfo.teamScore2) * 100} aria-valuemin={0} aria-valuemax={100}></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-layer-0 small">
                                            <div className='w-100'>
                                                {snowInfo.balls === 0 ?
                                                    <div className="text-center">
                                                        <h6><b>Du hast keine Schneebälle.</b></h6>
                                                    </div>
                                                    : (
                                                        <div className='row gx-0'>
                                                            <div className="col-md-2">
                                                                {snowInfo.balls >= 1 && <img src="https://images.habbo.je/dcr/hof_furni/icons/xmas_c18_snowfootball_icon.png" />}
                                                            </div>
                                                            <div className="col-md-2">
                                                                {snowInfo.balls >= 2 && <img src="https://images.habbo.je/dcr/hof_furni/icons/xmas_c18_snowfootball_icon.png" />}
                                                            </div>
                                                            <div className="col-md-2">
                                                                {snowInfo.balls >= 3 && <img src="https://images.habbo.je/dcr/hof_furni/icons/xmas_c18_snowfootball_icon.png" />}
                                                            </div>
                                                            <div className="col-md-2">
                                                                {snowInfo.balls >= 4 && <img src="https://images.habbo.je/dcr/hof_furni/icons/xmas_c18_snowfootball_icon.png" />}
                                                            </div>
                                                            <div className="col-md-2">
                                                                {snowInfo.balls >= 5 && <img src="https://images.habbo.je/dcr/hof_furni/icons/xmas_c18_snowfootball_icon.png" />}
                                                            </div>
                                                            <div className="col-md-2">
                                                                {snowInfo.balls >= 6 && <img src="https://images.habbo.je/dcr/hof_furni/icons/xmas_c18_snowfootball_icon.png" />}
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </>
                                }
                            </Flex>
                            {scores.length > 0 &&
                                <Base className="right-side">
                                    <Flex className="bg-layer-0 small" column alignItems="center">
                                        <Text variant="white" bold>{LocalizeText('gamecenter.players')}</Text>
                                        <hr />
                                        <Flex column alignItems="center" gap={2} className="player-list">
                                            {scores.sort((a, b) => b.score - a.score).map((player, index) => (
                                                <Flex alignItems="center" gap={snow ? 2 : 3} key={player.ranking} className="player">
                                                    <Text variant="white" bold className="score">{index + 1}</Text>
                                                    {snow ? <img src="https://1.bp.blogspot.com/-AuHq1KycgIs/X6d4omV5f2I/AAAAAAABfBc/tN0aGMSBuPURRPLXuteSHg50KL2STm_eQCPcBGAsYHg/s0/374__-Vg.png" /> : <LayoutAvatarImageView figure={player.figure} direction={2} />}
                                                    <Flex column>
                                                        <Text variant="white" bold>
                                                            {snow ? (
                                                                <>
                                                                    {player.username === "a" ? "Team A" : "Team B"}
                                                                </>
                                                            ) : <>{player.username}</>}
                                                        </Text>
                                                        <Text variant="white" small>{LocalizeText('gamecenter.players.score')} {player.score}</Text>
                                                    </Flex>
                                                </Flex>
                                            ))}
                                        </Flex>
                                    </Flex>
                                </Base>
                            }
                        </Flex>
                    </Base>
                    {votationVisible && !voteCompleted && <GameVotationInterfaceView username={votationUsername} figure={votationFigure} id={votationParticipantId} vote={vote} />}
                </>
            }
        </>
    );
}
