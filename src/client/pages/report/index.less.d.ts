declare namespace IndexLessNamespace {
  export interface IIndexLess {
    big: string;
    card: string;
    container: string;
    middle: string;
    small: string;
    subText: string;
    textContainer: string;
  }
}

declare const IndexLessModule: IndexLessNamespace.IIndexLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexLessNamespace.IIndexLess;
};

export = IndexLessModule;
