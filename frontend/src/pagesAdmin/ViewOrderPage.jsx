import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import ViewOrder from "../component/componentAdmin/ViewOrder.jsx";

const ViewOrderPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="ORDER" title="View Order Details" />
      <ViewOrder/>
    </LayoutAdmin>
  );
};

export default ViewOrderPage;
