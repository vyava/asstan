declare module 'Promise' {
  export function promisify<T>(
    // @ts-ignore
    func: (data: any, cb: (err: NodeJS.ErrnoException, data?: T) => void) => void
  ): (...input: any[]) => Promise<T>;
}
