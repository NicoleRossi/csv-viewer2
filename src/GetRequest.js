class GetRequest {
  constructor(url) {
    this.targetURL = url;

    this.updateProgress = this.updateProgress.bind(this);

    this.request = new XMLHttpRequest();
    this.request.addEventListener('progress', this.updateProgress);
  }

  updateProgress(oEvent) {
    if (oEvent.lengthComputable) {
      const percentComplete = oEvent.loaded / oEvent.total;
      console.log(`GetRequest --> updateProgress: downloaded \
        ${Math.round(percentComplete * 100)}%`);
    }
  }

  init() {
    const {
      targetURL,
      request,
    } = this;

    return new Promise((resolve, reject) => {
      request.addEventListener('error', (error) => {
        reject(error);
      });
      request.addEventListener('abort', (error) => {
        reject(error);
      });
      request.addEventListener('load', () => {
        if(request.status === 200) {
          resolve(request.responseText);          
        } else {
          reject(request.status);
        }
      });
      request.open('GET', targetURL);
      request.send();
    });
  }
}

export default GetRequest;
