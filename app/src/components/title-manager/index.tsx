import { useMemo, VFC } from "react";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import { assembleSeoUrl } from "src/utils/common";
import { APP_DESCRIPTION, APP_NAME } from "src/config";

const TitleManager: VFC = () => {
  const router = useRouter();
  let title = "";
  const titleText = useMemo(() => `${!title ? "" : `${title} - `}${APP_NAME}`, [
    title,
  ]);

  return (
    <DefaultSeo
      title={titleText}
      description={APP_DESCRIPTION}
      openGraph={{
        title: titleText,
        type: "website",
        url: assembleSeoUrl(router.asPath),
        locale: "tr-TR",
        site_name: APP_NAME,
        description: APP_DESCRIPTION,
        // images: [
        //   {
        //     url: assembleSeoUrl("/img/logo.png"),
        //   },
        // ],
      }}
      twitter={{
        cardType: "summary",
      }}
    />
  );
};

export default TitleManager;
