import { useEffect, useState, VFC } from 'react';
import { Router } from 'next/router';
import TopBarProgress from 'react-topbar-progress-indicator';

TopBarProgress.config({
  barColors: {
    "0" : "#585db3",
    "0.5" : "#292c64",
    "1" : "#040849"
  },
  shadowBlur: 5,
  barThickness: 2,
});

const ProgressBar: VFC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const start = () => void setVisible(true);
    const complete = () => void setVisible(false);

    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', complete);
    Router.events.on('routeChangeError', complete);

    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', complete);
      Router.events.off('routeChangeError', complete);
    };
  }, []);

  return <>{visible && <TopBarProgress />}</>;
};

export default ProgressBar;