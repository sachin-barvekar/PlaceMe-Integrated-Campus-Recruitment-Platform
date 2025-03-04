// eslint-disable-next-line
declare global {
    interface Window {
        fbAsyncInit: () => void,
        FB: any
    }
}

export const fbAppId = process.env.REACT_APP_FACEBOOK_APP_ID;

export const initFacebookSDK = () => {
    return new Promise<void>((resolve) => {
        // eslint-disable-next-line
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: fbAppId,
                autoLogAppEvents: true,
                xfbml: true,
                version: "v22.0",
            });
            resolve();
        };

        const script = document.createElement("script");
        script.src = "https://connect.facebook.net/en_US/sdk.js";
        script.async = true;
        script.defer = true;
        script.crossOrigin = "anonymous";
        script.onload = () => resolve();
        document.body.appendChild(script);
    });
};
