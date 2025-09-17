import { useEffect, useState } from 'react';

export default function useBrowserAction() {
  const [actionClicked, setActionClicked] = useState(false);

  useEffect(() => {
    const handleMessage = (request: { message: string }) => {
      if (request.message === 'browser_action_clicked') {
        setActionClicked((prevState) => !prevState);
      }
    };
    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [actionClicked]);

  return !actionClicked;
}
