declare namespace _default {
    export { get };
    export { set };
}
export default _default;
export function get(obj: object, path: string, defaultValue?: any): any;
export function set(obj: object, path: string, value: any): object;
