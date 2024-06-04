import { HabboWebTools, ILinkEventTracker, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AddEventLinkTracker, GetCommunication, GetConfiguration, RemoveLinkEventTracker } from '../../api';
import { Base, TransitionAnimation, TransitionAnimationTypes } from '../../common';
import { useRoomSessionManagerEvent } from '../../hooks';
import { AchievementsView } from '../achievements/AchievementsView';
import { AmongUsPlayer } from '../gamecenter/amgonus/AmongUsPlayer';
import { AvatarEditorView } from '../avatar-editor/AvatarEditorView';
import { CameraWidgetView } from '../camera/CameraWidgetView';
import { CampaignView } from '../campaign/CampaignView';
import { CatalogView } from '../catalog/CatalogView';
import { ChatHistoryView } from '../chat-history/ChatHistoryView';
import { FloorplanEditorView } from '../floorplan-editor/FloorplanEditorView';
import { FriendsView } from '../friends/FriendsView';
import { GameCenter } from '../gamecenter/GameCenter';
import { GameInterface } from '../gamecenter/games/interfaces/GameInterface';
import { GroupsView } from '../groups/GroupsView';
import { GuideToolView } from '../guide-tool/GuideToolView';
import { HcCenterView } from '../hc-center/HcCenterView';
import { HelpView } from '../help/HelpView';
import { HotelView } from '../hotel-view/HotelView';
import { InventoryView } from '../inventory/InventoryView';
import { ModToolsView } from '../mod-tools/ModToolsView';
import { NavigatorView } from '../navigator/NavigatorView';
import { NitrobubbleHiddenView } from '../nitrobubblehidden/NitrobubbleHiddenView';																				   
import { NitropediaView } from '../nitropedia/NitropediaView';
import { PingComposer } from '../../packets/Auth/PingComposer';
import { RightSideView } from '../right-side/RightSideView';
import { RoomView } from '../room/RoomView';
import { SSOComposer } from '../../packets/Auth/SSOComposer';
import { ToolbarView } from '../toolbar/ToolbarView';
import { UserProfileView } from '../user-profile/UserProfileView';
import { UserSettingsView } from '../user-settings/UserSettingsView';
import { WiredView } from '../wired/WiredView';
import { YoutubeTvView } from '../youtube-tv/YoutubeTvView';

import useWebSocket from 'react-use-websocket';

export const MainView: FC<{}> = props =>
{
    const [isReady, setIsReady] = useState(false);
    const [landingViewVisible, setLandingViewVisible] = useState(true);
    const [socketUrl] = useState(GetConfiguration<string>("websocket.external.url"));
    const [messageHistory, setMessageHistory] = useState([]);
    const sso = new URLSearchParams(window.location.search).get('sso');

    const [connectionStatus, setConnectionStatus] = useState<any>(WebSocket.CONNECTING);
    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
        onOpen: () => {
            setConnectionStatus(WebSocket.OPEN);
        },
        onClose: () => {
            setConnectionStatus(WebSocket.CLOSED);
        },
        shouldReconnect: (closeEvent) => true,
        share: true
    });

    const sendPacket = (message) => {
        sendMessage(JSON.stringify(message));
    }

    useEffect(() => {
        if (readyState === WebSocket.CLOSED) {
            const maxReconnectAttempts = 5;
            if (reconnectAttempts < maxReconnectAttempts) {
                const reconnectTimeout = setTimeout(() => {
                    setReconnectAttempts(reconnectAttempts + 1);
                    sendMessage(JSON.stringify(new PingComposer()));
                }, 5000);
				console.log('ping!');

                return () => clearTimeout(reconnectTimeout);
            } else {
                console.error('Maximum reconnection attempts exceeded!');
            }
        }

        if (readyState === WebSocket.OPEN) {
            sendMessage(JSON.stringify(new SSOComposer(sso)))
            setInterval(() => {
                sendMessage(JSON.stringify(new PingComposer()))
            }, 5000)
			console.log('ping!');
        }
	}, [readyState, reconnectAttempts]);

    useRoomSessionManagerEvent<RoomSessionEvent>(RoomSessionEvent.CREATED, event => setLandingViewVisible(false));
    useRoomSessionManagerEvent<RoomSessionEvent>(RoomSessionEvent.ENDED, event => setLandingViewVisible(event.openLandingView));

    useEffect(() =>
    {
        setIsReady(true);

        GetCommunication().connection.onReady();
    }, []);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = { 
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');
        
                if(parts.length < 2) return;
        
                switch(parts[1])
                {
                    case 'open':
                        if(parts.length > 2)
                        {
                            switch(parts[2])
                            {
                                case 'credits':
                                    //HabboWebTools.openWebPageAndMinimizeClient(this._windowManager.getProperty(ExternalVariables.WEB_SHOP_RELATIVE_URL));
                                    break;
                                default: {
                                    const name = parts[2];
                                    HabboWebTools.openHabblet(name);
                                }
                            }
                        }
                        return;
                }
            },
            eventUrlPrefix: 'habblet/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    return (
        <Base fit>
			<AmongUsPlayer />
            <TransitionAnimation type={ TransitionAnimationTypes.FADE_IN } inProp={ landingViewVisible } timeout={ 300 }>
                <HotelView />
            </TransitionAnimation>
            <ToolbarView isInRoom={ !landingViewVisible } />
            <ModToolsView />
            <RoomView />
            <ChatHistoryView />
            <WiredView />
            <AvatarEditorView />
            <AchievementsView />
            <NavigatorView />
			<NitrobubbleHiddenView />						 
            <InventoryView />
            <CatalogView />
            <FriendsView />
            <RightSideView />
            <UserSettingsView />
            <UserProfileView />
            <GroupsView />
            <CameraWidgetView />
            <HelpView />
            <NitropediaView />
            <GuideToolView />
            <HcCenterView />
            <CampaignView />
            <FloorplanEditorView />
			<YoutubeTvView />
			<GameCenter sendPacket={sendPacket} />
            <GameInterface sendPacket={sendPacket} />
        </Base>
    );
}
