import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AddEventLinkTracker, CreateLinkEvent, RemoveLinkEventTracker } from '../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../common';
import { useSessionInfo } from '../../hooks';

export const GameCenterTomb: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false)
    const [title, setTitle] = useState(null);
    const [iframeSrc, setIframeSrc] = useState(null);
    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);
    const user = useSessionInfo();

    useEffect(() => {
        if(isVisible) CreateLinkEvent('gamecenter/hide');
        else{
            setTitle(null);
            setWidth(null);
            setIframeSrc(null);
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
                        setTitle(parts[2]);
                        setIframeSrc(decodeURIComponent(parts[5]));
                        setWidth(parts[3]);
                        setHeight(parts[4]);
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                }
            },
            eventUrlPrefix: 'gamecentertomb/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ setIsVisible ]);

    return (
        <>
            { isVisible && title !== null && iframeSrc !== null && width !== null &&
                <NitroCardView style={{width: `${parseInt(width) + 20}px`}}>
                    <NitroCardHeaderView headerText={title}  onCloseClick={ event => setIsVisible(false) }/>
                    <NitroCardContentView>
                        <iframe src={iframeSrc} width={width} height={height} />
                    </NitroCardContentView>
                </NitroCardView>
            }
        </>
    );
}
