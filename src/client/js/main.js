import "regenerator-runtime";
import "../scss/styles.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast } from "bootstrap";

const toastElList = [].slice.call(document.querySelectorAll('.toast'));
toastElList.map(function (toastEl) {
  const toast = new Toast(toastEl);
  toast.show();
});
