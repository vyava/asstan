import * as React from 'react';
import Link from 'next/link';

interface IProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    to: string | any;
    prefetch?: boolean;
    cls?: any;
}

export default React.forwardRef(({ to, prefetch, ...props }: IProps, ref: any) => {
    return (
        <Link href={to} prefetch={prefetch || false}>
            <a {...props} ref={ref} />
        </Link>
    );
});