import React from 'react';
import { NotificationAlertItem, NotificationAlertType } from '../../../../api';
import { NitroSystemAlertView } from './NitroSystemAlertView';
import { NotificationDefaultAlertView } from './NotificationDefaultAlertView';
import { NotificationSeachAlertView } from './NotificationSearchAlertView';

export const GetAlertLayout = (item: NotificationAlertItem, onClose: () => void) => {
    if (!item) return null;

    const { id, ...otherProps } = item;

    switch (item.alertType) {
        case NotificationAlertType.NITRO:
            return <NitroSystemAlertView key={id} item={item} onClose={onClose} />;
        case NotificationAlertType.SEARCH:
            return <NotificationSeachAlertView key={id} item={item} onClose={onClose} />;
        default:
            return <NotificationDefaultAlertView key={id} item={item} onClose={onClose} />;
    }
}