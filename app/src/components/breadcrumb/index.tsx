import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./breadcrumb.module.scss";

const Breadcrumb = () => {

    let router = useRouter();
    let [crumbs, setCrumbs] = useState<any[]>([]);

    useEffect(() => {

        const segmentsPath = router.asPath.split("/");
        const segmentsRoute = router.route.split("/");
        const crumbLinks = CombineAccumulatively(segmentsPath);
        
        let [_, ...crumbs] = crumbLinks.map((crumb : string) => {
            return {
                href : crumb,
                // @ts-ignore
                title : router?.components[crumb]?.Component.title
            }
        })
        setCrumbs(["Home", ...crumbs]);
        // console.log(rest)
        // console.log(router)
    }, [router.route])

    return (
        <nav className={styles.root}>
            <ol className="list-reset flex text-grey-dark">
                <li>
                    <Link href="/">
                        <a className="text-blue font-bold">Home</a>
                    </Link>
                </li>
                
                {
                    crumbs.map((crumb : any, i : number) => {
                        return (
                            <React.Fragment key={i}>
                                <li key={i}><span className="mx-2">/</span></li>
                                <li key={i+1}>
                                    <Link href={`${crumb.href}`}>
                                        <a className="text-blue font-bold">{crumb.title}</a>
                                    </Link>
                                </li>
                            </React.Fragment>
                        )
                    })
                }
                {/* <li><a href="#" className="text-blue font-bold">Library</a></li>
                <li><span className="mx-2">/</span></li>
                <li>Data</li> */}
            </ol>
        </nav>
    )
};

function CombineAccumulatively(segments : any) {
    /* 
    when segments = ['1','2','3']
    returns ['1','1/2','1/2/3']
    */
    const links = segments.reduce((acc : any[], cur : string, curIndex : number) => {
        const last = curIndex > 1 ? acc[curIndex - 1] : "";
        const newPath = last + "/" + cur;
        acc.push(newPath);
        return acc;
    }, []);
    return links;
}


export default Breadcrumb;