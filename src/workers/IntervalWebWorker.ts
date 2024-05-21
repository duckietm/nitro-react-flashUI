export default () => {
  let interval: number = null;

  self.onmessage = (message: MessageEvent) => {
    if (!message) return;

    const data: { [index: string]: any } = message.data;

    switch (data.action) {
      case "START":
        interval = self.setInterval(() => self.postMessage(null), data.content);
        break;
      case "STOP":
        if (interval) {
          self.clearInterval(interval);
          interval = null;
        }
        break;
    }
  };
};