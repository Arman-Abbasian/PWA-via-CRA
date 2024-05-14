import React, { useEffect, useState } from "react";

const SwDev = () => {
  //show the element related to intalling app in page
  const [showInstallTag, setShowInstallTag] = useState(true);
  //show the element related to getting notifications in page
  const [showNotifPermTag, setShowNotifPermTag] = useState(false);
  //we want to put the e value of beforeinstallprompt handler
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  //this is related to registering SW in your app and must implement just one time
  //=> we put it in the useEffect
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((res) => {
        console.log("registered...");
      });
      // notification-------------
      //if the user still do not choose the codition of notification sending
      if (Notification.permission == "default") {
        setShowNotifPermTag(true);
      }
      //this handler is related to when th page loaded and we must have manifest file
      //this action related to manifest file
      window.addEventListener("beforeinstallprompt", (e) => {
        setDeferredPrompt(e);
      });
    }
  }, []);
  //when user click on element in page related to installing app
  const handleShowInstallPrompt = () => {
    console.log({ deferredPrompt });
    if (deferredPrompt) {
      console.log("1");
      //show popup related to installing app
      deferredPrompt.prompt();
      //remove the element from page
      setShowInstallTag(false);
      //this is related to which options user choosed
      deferredPrompt.userChoice.then((choiceRes) => {
        console.log(choiceRes.outcome);
        if (choiceRes.outcome === "accepted") {
          console.log("User accepted the install prompt.");
        } else if (choiceRes.outcome === "dismissed") {
          console.log("User dismissed the install prompt");
        }
      });
      setDeferredPrompt(null);
    }
  };
  //when user click on element in page related to notification permission
  const handleShowNotifPermission = () => {
    Notification.requestPermission((res) => {
      if (res == "granted") {
        showConfirmNotify();
      } else {
        console.log("Blocked...!");
      }
    });
  };

  //this handler manage the notifications
  const showConfirmNotify = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((sw) => {
        sw.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey:
              "BNbqX8M5NJJfs_IcL_5Gfisx7FkOYHtYniD4QMJq1RB4DeQsOmGo3lO-zzurFEqTUwtrqQHKb62p_TzxPU552yI",
          })
          .then((subscription) => {
            fetch("https://pushnotif.azhadev.ir/api/push-subscribe", {
              method: "post",
              body: JSON.stringify(subscription),
            })
              .then((res) => {
                return res.json();
              })
              .then((response) => {
                console.log(response);
                alert("این کد رو ذخیره کنید : " + response.user_code);
              });
          });
      });
    }
  };

  return (
    <>
      {showInstallTag && (
        <div
          style={{
            position: "fixed",
            width: "100%",
            height: "50px",
            background: "blue",
            color: "white",
            bottom: "0",
            textAlign: "center",
            paddingTop: "15px",
            cursor: "pointer",
          }}
          onClick={handleShowInstallPrompt}
        >
          Please install this app...
        </div>
      )}

      {showNotifPermTag && (
        <div
          style={{
            position: "fixed",
            width: "100%",
            height: "50px",
            background: "gray",
            color: "white",
            bottom: "100px",
            textAlign: "center",
            paddingTop: "15px",
            cursor: "pointer",
          }}
          onClick={handleShowNotifPermission}
        >
          Please click here to receive notifications
        </div>
      )}
    </>
  );
};

export default SwDev;
