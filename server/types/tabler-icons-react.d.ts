declare module "@tabler/icons-react" {
  import * as React from "react";

  export interface TablerIconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
  }

  export type TablerIcon = React.FC<TablerIconProps>;

  export const IconArrowDownCircle: TablerIcon;
  export const IconBolt: TablerIcon;
  export const IconBrain: TablerIcon;
  export const IconChartBar: TablerIcon;
  export const IconChartLine: TablerIcon;
  export const IconCheck: TablerIcon;
  export const IconDeviceMobile: TablerIcon;
  export const IconKey: TablerIcon;
  export const IconMoon: TablerIcon;
  export const IconPencil: TablerIcon;
  export const IconShield: TablerIcon;
  export const IconWifi: TablerIcon;
  export const IconMenu2: TablerIcon;
  export const IconX: TablerIcon;
}

