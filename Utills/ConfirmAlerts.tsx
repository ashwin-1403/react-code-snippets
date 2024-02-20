import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import "./ConfirmAlerts.style.scss";

export const ConfirmDelete = (
  key?: any,
  deleteCallback?: any,
  cancelCallback?: any
) => {
  confirmAlert({
    message: "Are you sure, you want to delete it?",
    buttons: [
      {
        label: "Delete",
        onClick: () => deleteCallback(key),
      },
      {
        label: "Cancel",
        onClick: () => cancelCallback && cancelCallback(),
      },
    ],
  });
};

export const ConfirmVenueChange = (
  key?: any,
  saveCallback?: any,
  cancelCallback?: any
) => {
  confirmAlert({
    message:
      "Your package will be delete once you change the venue. Are you sure you want to change the venue?",
    buttons: [
      {
        label: "Okay",
        onClick: () => saveCallback(key),
      },
      {
        label: "Cancel",
        onClick: () => cancelCallback && cancelCallback(),
      },
    ],
  });
};

export const ConfirmChange = (
  msg?: any,
  key?: any,
  saveCallback?: any,
  cancelCallback?: any
) => {
  confirmAlert({
    message: msg,
    buttons: [
      {
        label: "Okay",
        onClick: () => saveCallback(key),
      },
      {
        label: "Cancel",
        onClick: () => cancelCallback && cancelCallback(),
      },
    ],
  });
};

export const GenericConfirm = (
  key?: any,
  saveCallback?: any,
  triggerMsg?: any,
  SaveMsg?: any,
  cancelCallback?: any
) => {
  confirmAlert({
    message: key.triggerMsg,
    buttons: [
      {
        label: key.SaveMsg || "Okay",
        onClick: () => key.saveCallback(key.key),
      },
      {
        label: "Cancel",
        onClick: () => cancelCallback && cancelCallback(),
      },
    ],
  });
};
