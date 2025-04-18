import { useEffect, useState, useContext } from "react";
import { useService } from "../../hooks/useService";
import { completeOrderServiceFactory } from "../../services/completeOrderService";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./CompleteOrder.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { authServiceFactory } from "../../services/authService";
import { ShippingDetails } from "./ShippingDetails/ShippingDetails";
import { useNavigate } from "react-router-dom";


export const CompleteOrder = () => {
  const { userId } = useContext(AuthContext);
  const completeOrderService = useService(completeOrderServiceFactory);
  const authService = useService(authServiceFactory);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  const onContinueCheckoutSubmit = async (data) => {
    await completeOrderService.update(userId, data);
    navigate(`/complete-checkout/${userId}`);
  };

  useEffect(() => {
    authService
      .getOne(userId)
      .then((dataFromServer) => {
        setUser(dataFromServer);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  });

  return (
    <section id={styles["complete-order-box"]}>
      <div className={styles["title-container"]}>
        <h2 className={styles["title"]}>Checkout</h2>
        <div className={styles["title-sub-container"]}>
          <h4 className={styles["main-sub-title"]}>Shipping</h4>
          <FontAwesomeIcon icon={faChevronRight} className={styles["arrow"]} />
          <h4 className={styles["sub-title"]}>Payment</h4>
        </div>
      </div>
      <div className={styles["complete-order-container"]}>
        <div className={styles["left-container"]}>
          <div className={styles["left-top-container"]}>
            <h4 className={styles["left-top-container-title"]}>
              Shipping Information
            </h4>
            <h4 className={styles["left-top-container-email"]}>{user.email}</h4>
          </div>
          <div>
            <ShippingDetails
              onContinueCheckoutSubmit={onContinueCheckoutSubmit}
            />
          </div>
        </div>
        <div className={styles["right-container"]}>
        <div className={styles["right-container-image"]}>
            <img
              className={styles["right-container-img"]}
              src="https://res.cloudinary.com/deztgvefu/image/upload/v1706522736/template_images/pink-delivery-car-deliver-express-with-cardboard-boxes-cartoon-shipping-transportation-concept-pink-background-3d-rendering_56104-1526_ttrakq.jpg"
              alt="image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
