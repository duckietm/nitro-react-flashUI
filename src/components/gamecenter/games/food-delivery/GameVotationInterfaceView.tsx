import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { LayoutAvatarImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';

interface GameVotationInterfaceProps
{
    username: string;
    figure: string;
    id: number;
    vote: any;
}

const GameVotationInterfaceView = (props: GameVotationInterfaceProps) =>
{
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() =>
    {
        setIsVisible(true);
    }, [props])

    return (
        <>
            {isVisible &&
                <NitroCardView style={{width: "400px", height: "330px"}}>
                    <NitroCardHeaderView headerText="Votación" onCloseClick={event => setIsVisible(false)} />
                    <NitroCardContentView>
                        <div className='alert bg-dark text-white mb-0'>
                            <Row>
                                <Col md={3}>
                                    <LayoutAvatarImageView style={{position: "absolute", marginLeft: "-28px", marginTop: "-38px"}} figure={ props.figure } headOnly={ true } direction={ 2 } />
                                </Col>
                                <Col md={9}>
                                    <Text variant="white" bold>Sala hecha por {props.username}</Text>
                                </Col>
                            </Row>
                        </div>
                        <button onClick={() => props.vote(props.id, 5)} className='btn w-100' style={{backgroundColor: "#e163e6"}}>
                            Lo mejor que he visto en mi vida
                        </button>
                        <button onClick={() => props.vote(props.id, 4)} className='btn w-100' style={{backgroundColor: "#63e674"}}>
                            Muy bonito
                        </button>
                        <button onClick={() => props.vote(props.id, 3)} className='btn w-100' style={{backgroundColor: "#63c7e6"}}>
                            Está bien
                        </button>
                        <button onClick={() => props.vote(props.id, 2)} className='btn w-100' style={{backgroundColor: "#c7a52a"}}>
                            Podría estar mejor
                        </button>
                        <button onClick={() => props.vote(props.id, 1)} className='btn w-100' style={{backgroundColor: "#c72a2a"}}>
                            Una puta mierda
                        </button>
                    </NitroCardContentView>
                </NitroCardView>
            }
        </>
    )
}

export default GameVotationInterfaceView
