import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

const DEFAULT_HEIGHT = 160;
const LABEL_H = 20;
const GAP = 8;
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface WeeklyBarChartProps {
  data: number[];
  maxValue: number;
  accentColor: string;
  barColor: string;
  todayIndex: number;
  textMuted: string;
  chartHeight?: number;
}

export function WeeklyBarChart({
  data,
  maxValue,
  accentColor,
  barColor,
  todayIndex,
  textMuted,
  chartHeight = DEFAULT_HEIGHT,
}: WeeklyBarChartProps) {
  const [pressedIdx, setPressedIdx] = useState<number | null>(null);
  const max = Math.max(maxValue, 1);
  const { width } = Dimensions.get('window');
  // 16 (screen h-pad) * 2 + 16 (card pad) * 2 = 64
  const containerWidth = width - 64;
  const n = data.length;
  const totalGap = GAP * (n - 1);
  const barWidth = Math.floor((containerWidth - totalGap) / n);
  const drawHeight = chartHeight - LABEL_H;

  return (
    <View>
      <Svg width={containerWidth} height={chartHeight}>
        {/* Baseline rule */}
        <Rect
          x={0}
          y={drawHeight - 1}
          width={containerWidth}
          height={1.5}
          rx={1}
          fill={barColor}
          opacity={0.5}
        />
        {data.map((value, i) => {
          const barH = Math.max(4, (value / max) * (drawHeight - 16));
          const x = i * (barWidth + GAP);
          const y = drawHeight - barH - 1;
          const isToday = i === todayIndex;
          const showLabel = pressedIdx === i || (isToday && value > 0);
          return (
            <React.Fragment key={i}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx={8}
                ry={8}
                fill={isToday ? accentColor : barColor}
                opacity={isToday ? 1 : 0.65}
                onPress={() => setPressedIdx(pressedIdx === i ? null : i)}
              />
              {showLabel && value > 0 && (
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize={9}
                  fill={accentColor}
                >
                  {value}
                </SvgText>
              )}
              <SvgText
                x={x + barWidth / 2}
                y={chartHeight - 3}
                textAnchor="middle"
                fontSize={11}
                fill={isToday ? accentColor : textMuted}
              >
                {DAY_LABELS[i]}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
