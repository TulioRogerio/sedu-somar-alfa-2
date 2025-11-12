declare module 'react-apexcharts' {
  import React from 'react';
  
  export interface ApexOptions {
    [key: string]: any;
  }
  
  export interface Props {
    type: string;
    series: any[];
    options?: ApexOptions;
    height?: number | string;
    width?: number | string;
    [key: string]: any;
  }
  
  const ReactApexChart: React.FC<Props>;
  export default ReactApexChart;
}

