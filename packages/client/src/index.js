import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Context from './context';
import Visitor from './utils/visitor';
import './index.css';

export default function Waline({
  el, 
  placeholder = "Just Go Go.", 
  path = location.pathname, 
  avatar, 
  avatarForce,
  avatarCDN,
  meta = ['nick','mail','link'], 
  pageSize = 10, 
  lang = "zh-CN",
  langMode = {},
  highlight, 
  serverURL,
  emojiCDN,
  emojiMaps,
  requiredFields = [],
  copyRight = true,
  visitor = false
} = {}) {
  if(visitor) {
    const visitorPromise = path ? Visitor.add({serverURL, path}) : Promise.resolve();
    visitorPromise.then(() => Visitor.show({serverURL}));
  }

  const root = document.querySelector(el);
  if(!root) {
    return;
  }
  ReactDOM.render(
    <React.StrictMode>
      <Context 
        lang={lang} 
        langMode={langMode}
        emojiCDN={emojiCDN} 
        emojiMaps={emojiMaps}
        avatar={avatar}
        avatarCDN={avatarCDN}
        avatarFore={avatarForce}
      >
        <App 
          boxConfig={{serverURL, placeholder, meta, highlight, requiredFields, path}}
          listConfig={{path, pageSize, serverURL, avatar}}
          copyRight={copyRight}
        />
      </Context>
    </React.StrictMode>,
    root
  );
}
