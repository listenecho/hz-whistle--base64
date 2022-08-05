declare namespace ResetCssNamespace {
  export interface IResetCss {
    clearfix: string;
    dn: string;
  }
}

declare const ResetCssModule: ResetCssNamespace.IResetCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ResetCssNamespace.IResetCss;
};

export = ResetCssModule;
