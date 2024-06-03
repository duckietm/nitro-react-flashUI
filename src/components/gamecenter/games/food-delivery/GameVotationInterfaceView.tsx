import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { LayoutAvatarImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';

interface GameVotationInterfaceProps {
    username: string;
    figure: string;
    id: number; // ID of the participant being voted on
    vote: (participantId: number, votationNumber: number) => void;
}

export const GameVotationInterfaceView = (props: GameVotationInterfaceProps) => {
    const [isVisible, setIsVisible] = useState(true); // Default visibility to true
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        if (!hasVoted) {
            setIsVisible(true);
        } else {
            setIsVisible(false); // Hide the interface if the user has voted
        }
    }, [hasVoted]);

    const handleVote = (votationNumber) => {
        if (!hasVoted) {
            props.vote(props.id, votationNumber); // Ensure this sends the correct participantId
            setHasVoted(true);
        }
    };

    return (
        <>
            {isVisible && (
                <NitroCardView style={{ width: "400px", height: "330px" }}>
                    <NitroCardHeaderView headerText="Abstimmung" onCloseClick={() => setIsVisible(false)} />
                    <NitroCardContentView>
                        <div className='alert bg-dark text-white mb-0'>
                            <Row>
                                <Col md={3}>
                                    <LayoutAvatarImageView style={{ position: "absolute", marginLeft: "-28px", marginTop: "-38px" }} figure={props.figure} headOnly={true} direction={2} />
                                </Col>
                                <Col md={9}>
                                    <Text variant="white" bold>Raum erstellt von {props.username}</Text>
                                </Col>
                            </Row>
                        </div>
                        <button onClick={() => handleVote(5)} className='btn w-100' style={{ backgroundColor: "#e163e6" }}>
                            Ich liebe
                        </button>
                        <button onClick={() => handleVote(4)} className='btn w-100' style={{ backgroundColor: "#63e674" }}>
                            Schön
                        </button>
                        <button onClick={() => handleVote(3)} className='btn w-100' style={{ backgroundColor: "#63c7e6" }}>
                            OK
                        </button>
                        <button onClick={() => handleVote(2)} className='btn w-100' style={{ backgroundColor: "#c7a52a" }}>
                            Könnte besser sein
                        </button>
                        <button onClick={() => handleVote(1)} className='btn w-100' style={{ backgroundColor: "#c72a2a" }}>
                            Hässlich
                        </button>
                    </NitroCardContentView>
                </NitroCardView>
            )}
        </>
    );
};
