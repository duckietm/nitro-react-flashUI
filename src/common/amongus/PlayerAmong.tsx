import { FC, useMemo } from 'react';

export interface AmongViewProps
{
    classPlayer?: string[];
    classLegs?: string[];
    classBack?: string[];
    amongType: string;
    voting: boolean;
}

export const PlayerAmong: FC<AmongViewProps> = props =>
{
    const { classPlayer = ['animate__animated', 'animate__fadeIn'], classLegs = [], classBack = [], amongType = "red", voting = false, ...rest } = props;

    const getPlayer = useMemo(() =>
    {
        classPlayer.push('player-' + amongType)
        let newClassName = classPlayer.join(' ');

        if(classPlayer.length) newClassName += (' ' + classPlayer);

        return newClassName.trim();
    }, [classPlayer, amongType]);

    const getLegs = useMemo(() =>
    {
        classLegs.push('legs-' + amongType)
        let newClassName = classLegs.join(' ');
       
        if(classLegs.length) newClassName += (' ' + classLegs);

        return newClassName.trim();
    }, [classLegs, amongType]);

    const getBack = useMemo(() =>
    {
        classBack.push('back-' + amongType)
        let newClassName = classBack.join(' ');

        if(classBack.length) newClassName += (' ' + classBack);

        return newClassName.trim();
    }, [classBack, amongType]);
    
    return (
        <div className={getPlayer}>
            <div className={getLegs}></div>
            <div className={getBack}></div>
            <div className="glass"></div>
            <div className="shadow1"></div>
        </div>
    );
}
