import React, { useCallback, useEffect, useRef, useState } from 'react';
import './monitor.css';
const AddButton = React.memo(({ addText }) => {
  console.log('1111 :>> ', 1111);
  return <div onClick={addText}>add</div>;
});

const useText = () => {
  const [texts, setTexts] = useState([]);
  const addText = useCallback(() => {
    setTexts((txts) => [...txts, 'hello world']);
  }, [setTexts]);

  return [texts, addText];
};
const MutationMonitor = () => {
  const domRef = useRef(null);
  const [texts, addText] = useText();

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const { clientHeight, offsetHeight, scrollHeight } = domRef.current;
      console.log(
        'clientHeight, offsetHeight, scrollHeight ',
        clientHeight,
        offsetHeight,
        scrollHeight
      );
    });
    observer.observe(domRef.current, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
    });
  }, []);

  return (
    <div ref={domRef} style={{ maxHeight: '200px' }}>
      <AddButton addText={addText} />
      {texts.map((text, index) => {
        return <div key={index}>{text}</div>;
      })}
    </div>
  );
};

const IframeResize = () => {
  const [texts, addText] = useText();
  const iframeRef = useRef(null);
  useEffect(() => {
    iframeRef.current.contentWindow.onresize = (target) => {
      console.log(target);
    };
  }, []);
  return (
    <div className='container'>
      <div>
        <div onClick={addText}>add iframe</div>
        {texts.map((text, index) => {
          return <div key={index}>{text}</div>;
        })}
      </div>
      <iframe
        id='size'
        title='size'
        ref={iframeRef}
        style={{ height: '100%', padding: 0, margin: 0 }}
      ></iframe>
    </div>
  );
};
const MonitorHeight = () => {
  return (
    <div>
      <MutationMonitor />
      <IframeResize />
    </div>
  );
};

export default MonitorHeight;
