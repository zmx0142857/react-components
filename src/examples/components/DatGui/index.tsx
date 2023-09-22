import { useState } from 'react';
import { DatGui } from '@/components';
import { debounce } from '@/utils';

const debounced = debounce();

const DatGuiExample = () => {
    const [showGlow, setShowGlow] = useState(false);
    const [glowStrength, setGlowStrength] = useState(0.7);
    const [glowHardness, setGlowHardness] = useState(0.5);
    const [showEdgeOnly, setShowEdgeOnly] = useState(false);
    const [showSilhouetteOnly, setShowSilhouetteOnly] = useState(true);
    const [maxNormalAngle, setMaxNormalAngle] = useState(15);
    const [lineWidth, setLineWidth] = useState(2);
    const [depthTest, setDepthTest] = useState(true);
    const [visibleColor, setVisibleColor] = useState('#ffaa00');
    const [invisibleColor, setInvisibleColor] = useState('#555555');
    const [enableCesiumEdge, setEnableCesiumEdge] = useState(false);

    const panels = [
        {
            name: 'edge',
            label: '描边参数',
            children: [
                {
                    name: 'showGlow',
                    type: 'Switch',
                    label: '显示光晕',
                    value: showGlow,
                    onChange: setShowGlow,
                },
                {
                    name: 'glowStrength',
                    type: 'Slider',
                    label: '光晕亮度',
                    value: glowStrength,
                    onChange: setGlowStrength,
                    min: 0,
                    max: 1,
                    step: 0.01,
                },
                {
                    name: 'glowHardness',
                    type: 'Slider',
                    label: '边缘强度',
                    value: glowHardness,
                    onChange: (value: number) => {
                        // UI 立即响应
                        setGlowHardness(value);
                        // 业务代码进行防抖
                        debounced(() => console.log('change glowHardness', value), 300);
                    },
                    min: 0,
                    max: 1,
                    step: 0.01,
                },
                {
                    name: 'showEdgeOnly',
                    type: 'Switch',
                    label: '只显示边缘',
                    value: showEdgeOnly,
                    onChange: setShowEdgeOnly,
                },
                {
                    name: 'showSilhouetteOnly',
                    type: 'Switch',
                    label: '只显示轮廓',
                    value: showSilhouetteOnly,
                    onChange: setShowSilhouetteOnly,
                },
                {
                    name: 'maxNormalAngle',
                    type: 'Slider',
                    label: '最大法线夹角',
                    value: maxNormalAngle,
                    onChange: setMaxNormalAngle,
                    min: 0,
                    max: 180,
                },
                {
                    name: 'lineWidth',
                    type: 'Slider',
                    label: '线宽',
                    value: lineWidth,
                    onChange: setLineWidth,
                    min: 1,
                    max: 10,
                },
                {
                    name: 'depthTest',
                    type: 'Switch',
                    label: '遮挡检测',
                    value: depthTest,
                    onChange: setDepthTest,
                },
                {
                    name: 'visibleColor',
                    type: 'ColorPicker',
                    label: '可见部分颜色',
                    value: visibleColor,
                    onChange: setVisibleColor,
                },
                {
                    name: 'invisibleColor',
                    type: 'ColorPicker',
                    label: '被遮挡部分颜色',
                    value: invisibleColor,
                    onChange: setInvisibleColor,
                },
            ]
        },
        {
            name: 'cesium-edge',
            label: 'Cesium自带描边',
            children: [
                {
                    name: 'enable',
                    type: 'Switch',
                    label: '启用',
                    value: enableCesiumEdge,
                    onChange: setEnableCesiumEdge,
                },
            ]
        },
    ]
    return <DatGui panels={panels}/>
}

export default DatGuiExample;