import { createPortal } from "react-dom";

function Modal() {
  return (
    createPortal(<footer>HI I AM A PORTAL from React</footer>, document.body)
  );
}

export default Modal;

