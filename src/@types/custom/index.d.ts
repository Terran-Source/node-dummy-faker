/**
 * declare all global types/variables
 *
 * suppose you want to use somewhere like
 * ```js
 * global.RandomLength = 9;
 * ```
 *
 * you should declare here as
 * ```ts
 * declare var RandomLength: ?number;
 * ```
 *
 * Now you are free to use `RandomLength` in any of your *.ts code without
 * compilation/linting error
 **/

// type Obj = { [k: string]: any };
type Obj = Record<string, any>;
