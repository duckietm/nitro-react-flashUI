import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { GetSessionDataManager } from '../../../../api';
import { LayoutAvatarImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';

interface GameVotationInterfaceProps {
    username: string;
    figure: string;
    id: number; // ID of the participant being voted on
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
    const [isVisible, setIsVisible] = useState(true); // Default visibility to true
    const [hasVoted, setHasVoted] = useState(false);
    const [isVoting, setIsVoting] = useState(false); // State to handle voting status
    const userInfo = GetSessionDataManager().userId;

    useEffect(() => {
        if (!hasVoted) {
            setIsVisible(true);
        } else {
            setIsVisible(false); // Hide the interface if the user has voted
        }
    }, [hasVoted]);

    useEffect(() => {
        if (userInfo) {
            console.log(`Look : Current user ID: ${userInfo}`);
            console.log(`Look: Participant ID: ${id}`);
        }
    }, [userInfo, id]);

    const handleVote = (votationNumber: number) => {
        if (!hasVoted && !isVoting) { // Check if the user has already voted or if a vote is in progress
            setIsVoting(true); // Set voting in progress
            vote(id, votationNumber); // Ensure this sends the correct participantId
            setHasVoted(true);
            setIsVoting(false); // Reset voting status
        }
    };

    const voteOptions = [
        { label: 'I Love it', color: '#e163e6', value: 5 },
        { label: 'Very good', color: '#63e674', value: 4 },
        { label: 'OK', color: '#63c7e6', value: 3 },
        { label: 'Have seen better', color: '#c7a52a', value: 2 },
        { label: 'Very bad', color: '#c72a2a', value: 1 },
    ];

    return (
        <>
            {isVisible && (
                <NitroCardView style={{ width: "400px", height: "330px" }}>
                    <NitroCardHeaderView headerText="Poll" onCloseClick={() => setIsVisible(false)} />
                    <NitroCardContentView>
                        <div className='alert bg-dark text-white mb-0'>
                            <Row>
                                <Col md={3}>
                                    <LayoutAvatarImageView style={{ position: "absolute", marginLeft: "-28px", marginTop: "-38px" }} figure={figure} headOnly={true} direction={2} />
                                </Col>
                                <Col md={9}>
                                    <Text variant="white" bold>Space created by {username}</Text>
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
                                Please wait until other players have voted
                            </Text>
                        )}
                    </NitroCardContentView>
                </NitroCardView>
            )}
        </>
    );
};
