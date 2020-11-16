declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}

declare module 'redux-logger' {
  export function createLogger(): (...args: any) => any;
}

declare class ClipboardJS {
  onClick(): void;
}

declare const BASE_URL: string;
declare const ENV: 'development' | 'test' | 'prod' | 'stag';
