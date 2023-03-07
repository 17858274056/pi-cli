import {useRouter} from "vue-router";
import {ref} from "vue";
let queue = [];
let isIframeReady = false;

function iframeReady(callback) {
  if (isIframeReady) {
    callback();
  } else {
    queue.push(callback);
  }
}

if (window.top === window) {
  // 子iframe
  window.addEventListener("message", (event) => {
    if (event.data.type === "iframeReady") {
      isIframeReady = true;
      queue.forEach((callback) => callback());
      queue = [];
    }
  });
} else {
  window.top.postMessage(
    {
      type: "iframeReady",
    },
    "*"
  );
}

export function getCurrentPath(router) {
  let {path} = router.currentRoute.value;
  return path;
}

export function syncPathToParent(router) {
  window.top.postMessage(
    {
      type: "replacePath",
      value: getCurrentPath(router),
    },
    "*"
  );
}

export function syncToChild(router) {
  // 子ifrmae同步path
  const iframe = document.querySelector("iframe");
  if (iframe) {
    iframeReady(() => {
      iframe.contentWindow.postMessage(
        {
          type: "replacePath",
          value: getCurrentPath(router),
        },
        "*"
      );
    });
  }
}

export function syncThemeToChild(theme) {
  // 更新theme
  const iframe = document.querySelector("iframe");
  if (iframe) {
    iframeReady(() => {
      iframe.contentWindow.postMessage({
        type: "updateTheme",
        value: theme,
      });
    });
  }
}

export function getDefaultTheme() {
  const cache = window.localStorage.getItem("theme");

  if (cache) {
    return cache;
  }

  const useDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return useDark ? "dark" : "light";
}

export function getCurrentTheme() {
  // 子iframe获取theme

  let theme = ref(getDefaultTheme());

  window.addEventListener("message", (event) => {
    if (event.data?.type === "updateTheme") {
      theme.value = event.data.value || "";
    }
  });
  return theme;
}

export function listenToSyncPath(router) {
  // 监听path 变化

  window.addEventListener("message", (event) => {
    console.log(event);
    if (event.data.type !== "replacePath") {
      return;
    }
    const path = event.data?.value || "";
    if (router.currentRoute.value.path !== path) {
      router.replace(path).catch(() => {});
    }
  });
}
