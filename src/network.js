__d(function (global, require, unused1, unused2, module, exports, deps) {
  const config = require(deps[0]), api = require(deps[1]);
  const md5 = require(deps[2]), crypto = require(deps[3]);
  const health=require(deps[4]);
  const noop = function () {};
  const readOnly = /^(setting|chapter|album|categories(?:\/filter)?|latest|promote(?:_list)?|search|forum|hot_tags|week(?:\/filter)?)$/;
  function hostsFor(url) {
    const path = url.replace(/^https?:\/\/[^/]+\//, '').split('?')[0];
    const setting = path === 'setting';
    const source = global.api_data || {};
    const current = setting ? global.setting_host : global.api_host;
    const hosts = [current].concat((setting ? source.Setting : health.order(source.Server || [])) || []);
    const urls = [];
    hosts.forEach(function (host) {
      if (typeof host !== 'string' || !/^[a-z0-9.-]+(?::\d+)?$/i.test(host)) return;
      const candidate = url.replace(/^(https?:\/\/)[^/]+/, '$1' + host);
      if (urls.indexOf(candidate) < 0) urls.push(candidate);
    });
    return {urls: urls.length ? urls : [url], path: path};
  }
  function headers(stamp) {
    const result = {'Accept-Language':'zh-CN,zh;q=0.9',Tokenparam: stamp + ',' + config.version, Token: md5(stamp + api.token)};
    if (global.ua) result['User-Agent'] = global.ua;
    return result;
  }
  function parseReply(text, stamp, plain) {
    const envelope = JSON.parse(text);
    if (!envelope || typeof envelope !== 'object') throw new Error('来源返回了无效数据');
    if (plain || typeof envelope.data === 'object' || envelope.code && Number(envelope.code) !== 200) return envelope;
    if (typeof envelope.data !== 'string' || !envelope.data) throw new Error('来源没有返回数据');
    const keys = [api.token, '18comicAPPContent'];
    for (let i = 0; i < keys.length; i++) {
      try {
        const key = crypto.enc.Utf8.parse(md5(stamp + keys[i]));
        const bytes = crypto.AES.decrypt(envelope.data, key, {mode: crypto.mode.ECB});
        envelope.data = JSON.parse(bytes.toString(crypto.enc.Utf8));
        return envelope;
      } catch (_) {}
    }
    throw new Error('来源数据无法读取');
  }
  function request(method, url, params, ok, fail, plain, probeHost) {
    const route = hostsFor(url), options = params || {}, sentAt = Date.now();
    if(probeHost)route.urls=['https://'+probeHost+'/promote'];
    const query = Object.keys(options).filter(k => options[k] != null).map(k =>
      encodeURIComponent(k) + '=' + encodeURIComponent(options[k])).join('&');
    const transport = plain ? options.method || 'GET' : method;
    const canRetry = transport === 'GET' && readOnly.test(route.path);
    const maxAttempts=canRetry?Math.min(3,route.urls.length):1, deadline=sentAt+18000;
    const kind=probeHost?'probe':!canRetry || route.path==='setting'?null:
      route.path==='promote' || route.path==='latest'?'home':route.path==='chapter'?'chapter':'api';
    const done = typeof ok === 'function' ? ok : noop, error = typeof fail === 'function' ? fail : noop;
    let xhr, stopped = false, complete;
    const task = new Promise(resolve => {complete=resolve;});
    function attempt(index) {
      const address = route.urls[index], stamp = String(Math.floor(Date.now() / 1000));
      const suffix = plain ? 'skipec=1' + (query ? '&' + query : '') : query;
      const endpoint = transport === 'POST' && !plain || !suffix ? address :
        address + (address.indexOf('?') < 0 ? '?' : '&') + suffix;
      if(!probeHost)global.current_url = endpoint;
      const host=address.split('/')[2], started=Date.now();
      const active = xhr = new XMLHttpRequest();
      let settled = false;
      function rejected(reason, transient) {
        if (settled || stopped) return;
        settled = true;
        if (kind && transient) health.record(host,kind,false,Date.now()-started);
        if (transient && index+1<maxAttempts && Date.now()<deadline) return attempt(index+1);
        complete(); error(reason);
      }
      try {
        active.open(transport, endpoint, true);
        active.withCredentials = !probeHost;
        active.timeout = probeHost ? 6000 : Math.min(10000,Math.max(1,Math.floor((deadline-started)/(maxAttempts-index))));
        const auth = headers(stamp);
        Object.keys(auth).forEach(k => active.setRequestHeader(k, auth[k]));
        if (transport === 'POST' && !plain) active.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        active.onerror = () => rejected(new Error('网络连接失败'), true);
        active.ontimeout = () => rejected(new Error('来源响应超时'), true);
        active.onload = function () {
          if (stopped || settled) return;
          if (!(active.status >= 200 && active.status < 300 || !plain && active.status === 401)){
            const error=Object.assign(new Error('来源返回 HTTP '+active.status),{status:active.status});
            return rejected(error,active.status===0 || active.status>=500);
          }
          let reply;
          try { reply = parseReply(active.responseText, stamp, plain); }
          catch (err) { return rejected(err, true); }
          if(kind && active.status!==401 && (reply.code==null || Number(reply.code)===200)){
            const data=reply.data;
            const valid=kind==='api' ? true : route.path==='chapter' ? data && (data.id==null || String(data.id)===String(options.id)) && Array.isArray(data.images) && data.images.length :
              route.path==='latest' ? Array.isArray(data) || data && Array.isArray(data.content) :
              Array.isArray(data) && data.some(row=>row && Array.isArray(row.content));
            if(!valid)return rejected(new Error('来源返回的数据不完整'),true);
            health.record(host,kind,true,Date.now()-started);
            if(index && !probeHost)health.fallback(route.urls[0].split('/')[2],host);
          } else if(kind && Number(reply.code)>=500)return rejected(new Error('来源暂时不可用'),true);
          else if(probeHost)return rejected(new Error('测速未获得有效数据'),true);
          settled = true;
          complete(); done(reply,{host:host});
        };
        active.send(transport === 'POST' && !plain ? query + '&' : null);
      } catch (err) { rejected(err, false); }
    }
    attempt(0);
    task.abort=function () { stopped = true; if (xhr) xhr.abort(); complete(); };
    return task;
  }
  Object.defineProperty(exports, '__esModule', {value: true});
  exports.default = {
    fetchGet: (url, params, ok, fail) => request('GET', url, params, ok, fail, false),
    fetchPost: (url, params, ok, fail) => request('POST', url, params, ok, fail, false),
    fetchSkipEc: (url, params, ok, fail) => request('GET', url, params, ok, fail, true),
    probe: host => request('GET',api.API_COMBIC_PROMOTE,{page:0},noop,noop,false,host),
    headers: headers
  };
},648,[649,650,679,683,2158]);
