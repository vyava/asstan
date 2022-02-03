type Tail<L extends any[]> =
    ((...l: L) => void) extends ((h: infer H, ...t: infer T) => void) ? T : never;


export type DeepOmit<T, K extends Array<keyof any>> =
    K extends [] ? T : K extends [infer P] ? Pick<T, Exclude<keyof T, P>> : {
        [P in keyof T]: P extends K[0] ? DeepOmit<T[P], Tail<K>> : T[P]
    }