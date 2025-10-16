import React, { Suspense } from "react";
import SuccessRoute from "@/routes/auth/success-route";

const SuccessPage = () => {
  return (
    <Suspense>
      <SuccessRoute />
    </Suspense>
  );
};

export default SuccessPage;
