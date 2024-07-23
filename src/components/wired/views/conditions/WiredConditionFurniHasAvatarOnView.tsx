import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { WiredConditionBaseView } from './WiredConditionBaseView';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';

export const WiredConditionFurniHasAvatarOnView: FC<{}> = props =>
{
    const [selectOption, setSelection] = useState(0);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([selectOption, selectOption === 1 ? 1 : 0]);

    useEffect(() =>
    {
        setSelection((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [trigger]);

    return (
        <WiredConditionBaseView requiresFurni={WiredFurniType.STUFF_SELECTION_OPTION_BY_ID} hasSpecialInput={true} save={save}>
            <Column gap={1}>
                <Text bold>{LocalizeText('wiredfurni.params.conditions')}</Text>
                {
                    [1, 2].map(selection =>
                    {
                        return (
                            <Flex key={selection} gap={1}>
                                <input className="form-check-input" type="radio" name="selection" id={`selection${selection}`} checked={(selectOption === selection)} onChange={event => setSelection(selection)} />
                                <Text>{LocalizeText(`wiredfurni.params.condition.${selection}`)}</Text>
                            </Flex>
                        );
                    })
                }
            </Column>
        </WiredConditionBaseView>
    );
}
