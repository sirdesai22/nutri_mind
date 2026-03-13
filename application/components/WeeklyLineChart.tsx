import React from 'react';
import { Dimensions, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';

const DEFAULT_HEIGHT = 140;
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const LABEL_H = 20;
const PADDING = { top: 20, right: 48, bottom: 0, left: 8 };

interface WeeklyLineChartProps {
  data: number[];
  maxValue: number;
  accentColor: string;
  lineColor: string;
  todayIndex: number;
  textMuted: string;
  chartHeight?: number;
  goalCalories?: number;
}

function buildPoints(data: number[], maxVal: number, width: number, drawHeight: number) {
  const graphWidth = width - PADDING.left - PADDING.right;
  const graphHeight = drawHeight - PADDING.top;
  const step = data.length > 1 ? graphWidth / (data.length - 1) : graphWidth;
  return data.map((val, i) => {
    const x = PADDING.left + i * step;
    const y = PADDING.top + graphHeight - (maxVal > 0 ? (val / maxVal) * graphHeight : 0);
    return { x, y };
  });
}

function buildSmoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  const d: string[] = [];
  d.push(`M ${points[0].x},${points[0].y}`);

  // Catmull–Rom to cubic Bezier conversion for a smooth, monotone-ish curve.
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d.push(`C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`);
  }

  return d.join(' ');
}

export function WeeklyLineChart({
  data,
  maxValue,
  accentColor,
  lineColor,
  todayIndex,
  textMuted,
  chartHeight = DEFAULT_HEIGHT,
  goalCalories,
}: WeeklyLineChartProps) {
  const { width } = Dimensions.get('window');
  const containerWidth = width - 64;
  const max = Math.max(maxValue, 1);
  const drawHeight = chartHeight - LABEL_H;
  const points = buildPoints(data, max, containerWidth, drawHeight);
  const smoothPath = buildSmoothPath(points);
  const graphWidth = containerWidth - PADDING.left - PADDING.right;
  const graphHeight = drawHeight - PADDING.top;

  // Goal line Y position
  const goalY =
    goalCalories != null
      ? PADDING.top + graphHeight - Math.min(1, goalCalories / max) * graphHeight
      : null;
  const showGoal = goalY !== null && goalY >= PADDING.top && goalY <= drawHeight;

  return (
    <View>
      <Svg width={containerWidth} height={chartHeight}>
        <Defs>
          <LinearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={accentColor} stopOpacity={0.3} />
            <Stop offset="1" stopColor={accentColor} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {/* Gradient area fill */}
        {points.length > 1 && (
          <Path
            d={
              smoothPath +
              ` L ${points[points.length - 1]?.x},${drawHeight}` +
              ` L ${points[0]?.x},${drawHeight} Z`
            }
            fill="url(#lineAreaGrad)"
            stroke="none"
          />
        )}

        {/* Goal dashed line */}
        {showGoal && goalY != null && (
          <>
            <Line
              x1={PADDING.left}
              y1={goalY}
              x2={containerWidth - PADDING.right}
              y2={goalY}
              stroke={textMuted}
              strokeWidth={1}
              strokeDasharray="4,4"
            />
            <SvgText
              x={containerWidth - PADDING.right + 4}
              y={goalY + 4}
              fontSize={9}
              fill={textMuted}
            >
              {goalCalories}
            </SvgText>
          </>
        )}

        {/* Trend line */}
        {points.length > 1 && (
          <Path
            d={smoothPath}
            fill="none"
            stroke={accentColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Data point dots */}
        {points.map((pt, i) => {
          const isToday = i === todayIndex;
          return (
            <Circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={isToday ? 5 : 3}
              fill={isToday ? accentColor : lineColor}
              stroke={isToday ? accentColor : 'transparent'}
              strokeWidth={1.5}
            />
          );
        })}

        {/* Day labels */}
        {points.map((pt, i) => (
          <SvgText
            key={`lbl-${i}`}
            x={pt.x}
            y={chartHeight - 3}
            textAnchor="middle"
            fontSize={11}
            fill={i === todayIndex ? accentColor : textMuted}
          >
            {DAY_LABELS[i]}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}
