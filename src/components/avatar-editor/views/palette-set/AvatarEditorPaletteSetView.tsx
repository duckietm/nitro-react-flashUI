import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { AvatarEditorGridColorItem, AvatarEditorUtilities, CategoryData, IAvatarEditorCategoryModel } from '../../../../api';
import { PartColor } from '@nitrots/nitro-renderer';
import { HexColorPicker } from 'react-colorful';
import { ColorPicker, Hue, IColor, Saturation, useColor } from 'react-color-palette';
import "react-color-palette/css";
import { color } from '@uiw/react-color';

export interface AvatarEditorPaletteSetViewProps {
    model: IAvatarEditorCategoryModel;
    category: CategoryData;
    paletteSet: AvatarEditorGridColorItem[];
    paletteIndex: number;
    isCustomHeight: boolean;
}

export const AvatarEditorPaletteSetView: FC<AvatarEditorPaletteSetViewProps> = props => {
    const { model = null, category = null, paletteSet = [], paletteIndex = -1, isCustomHeight = false } = props;
    const elementRef = useRef<HTMLDivElement>(null);
    const COLOR_DEFAULT: string = "#FFFFFF"
    const [colorValue, setColorValue] = useColor(COLOR_DEFAULT);

    const selectColor = useCallback((item: AvatarEditorGridColorItem) => {
        const index = paletteSet.indexOf(item);

        if (index === -1) return;

        model.selectColor(category.name, index, paletteIndex);
    }, [model, category, paletteSet, paletteIndex]);

    const selectColorHex = useCallback((item: IColor) => {
        setColorValue(item)
        model.selectColorHex(category.name, item.hex.slice(0, -2), paletteIndex);
    }, [model, category, paletteSet, paletteIndex]);

    useEffect(() => {
        if (!model || !category || !elementRef || !elementRef.current) return;

        elementRef.current.scrollTop = 0;
    }, [model, category]);

    useEffect(() => {
        try {
            let color: string = category.getSelectedColorIdHex(paletteIndex);

            if (color) {
                const newColor: IColor = {
                    hex: color,
                    rgb: {
                        r: 0,
                        g: 0,
                        b: 0,
                        a: 0,
                    },
                    hsv: {
                        h: 0,
                        s: 0,
                        v: 0,
                        a: 0,
                    }
                };

                setColorValue(newColor);
            } else {

                const partType = category.getCurrentPart().partSet;

                if (partType != null) {
                    color = AvatarEditorUtilities.CURRENT_FIGURE.getColorIds(category.getCurrentPart().partSet.type)[paletteIndex];

                    const newColor: IColor = {
                        hex: color,
                        rgb: {
                            r: 0,
                            g: 0,
                            b: 0,
                            a: 0,
                        },
                        hsv: {
                            h: 0,
                            s: 0,
                            v: 0,
                            a: 0,
                        }
                    };

                    setColorValue(newColor);
                    category.getPalette(paletteIndex).push(new AvatarEditorGridColorItem(new PartColor(null, color, paletteIndex)))
                } else {
                    color = COLOR_DEFAULT;

                    const newColor: IColor = {
                        hex: COLOR_DEFAULT,
                        rgb: {
                            r: 0,
                            g: 0,
                            b: 0,
                            a: 0,
                        },
                        hsv: {
                            h: 0,
                            s: 0,
                            v: 0,
                            a: 0,
                        }
                    };

                    setColorValue(newColor);
                }
            }
        } catch (e) {
        }
    }, [model, category])

    return (
        <>
            <div style={{height: `${isCustomHeight ? '45%' : '95%'}`, marginBottom: '15px'}}>
                <Saturation height={300} color={colorValue} onChange={selectColorHex} />
                <Hue color={colorValue} onChange={selectColorHex} />
            </div>
        </>
    );
}
