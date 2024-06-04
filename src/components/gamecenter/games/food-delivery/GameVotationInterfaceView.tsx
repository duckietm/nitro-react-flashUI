import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { GetSessionDataManager, LocalizeText } from '../../../../api';
import { LayoutAvatarImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';

interface GameVotationInterfaceProps {
    username: string;
    figure: string;
    id: number;
    vote: (participantId: number, votationNumber: number) => void;
}

interface VoteButtonProps {
    label: string;
    color: string;
    onClick: () => void;
    disabled: boolean;
}

const VoteButton = ({ label, color, onClick, disabled }: VoteButtonProps) => (
    <button onClick={onClick} className='btn w-100' style={{ backgroundColor: color }} disabled={disabled}>
        {label}
    </button>
);

export const GameVotationInterfaceView = ({ username, figure, id, vote }: GameVotationInterfaceProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const [hasVoted, setHasVoted] = useState(false);
    const [isVoting, setIsVoting] = useState(false);
    const userInfo = GetSessionDataManager().userId;

    useEffect(() => {
        if (!hasVoted) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [hasVoted]);

    const handleVote = (votationNumber: number) => {
        if (!hasVoted && !isVoting) {
            setIsVoting(true);
            vote(id, votationNumber);
            setHasVoted(true);
            setIsVoting(false);
        }
    };

    const voteOptions = [
        { label: LocalizeText('gamecenter.vote.room.bestihaveseen'), color: '#e163e6', value: 5 },
        { label: LocalizeText('gamecenter.vote.room.nice'), color: '#63e674', value: 4 },
        { label: LocalizeText('gamecenter.vote.room.normal'), color: '#63c7e6', value: 3 },
        { label: LocalizeText('gamecenter.vote.room.couldbebetter'), color: '#c7a52a', value: 2 },
        { label: LocalizeText('gamecenter.vote.room.bad'), color: '#c72a2a', value: 1 },
    ];

    return (
        <>
            {isVisible && (
                <NitroCardView style={{ width: "400px", height: "330px" }}>
                    <NitroCardHeaderView headerText={LocalizeText('gamecenter.vote.description')} onCloseClick={() => setIsVisible(false)} />
                    <NitroCardContentView>
                        <div className='alert bg-dark text-white mb-0'>
                            <Row>
                                <Col md={3}>
                                    <LayoutAvatarImageView style={{ position: "absolute", marginLeft: "-28px", marginTop: "-38px" }} figure={figure} headOnly={true} direction={2} />
                                </Col>
                                <Col md={9}>
                                    <Text variant="white" bold>{LocalizeText('gamecenter.vote.room.made.by')} {username}</Text>
                                </Col>
                            </Row>
                        </div>
                        {userInfo && userInfo !== id ? (
                            voteOptions.map(option => (
                                <VoteButton
                                    key={option.value}
                                    label={option.label}
                                    color={option.color}
                                    onClick={() => handleVote(option.value)}
                                    disabled={isVoting}
                                />
                            ))
                        ) : (
                            <Text variant="black" className="text-center mt-3">
                                {LocalizeText('gamecenter.vote.room.wait')}
                            </Text>
                        )}
                    </NitroCardContentView>
                </NitroCardView>
            )}
        </>
    );
};
